# Thiết kế & Tài liệu Tính năng Lưu Địa điểm / Nhà hàng Yêu thích (Favorite Restaurants)

Tài liệu này trình bày phương pháp thiết kế và triển khai tính năng **Lưu địa điểm/nhà hàng yêu thích** (Favorite Restaurants) của người dùng trong hệ thống ChayNow, đã được tối ưu hóa dựa trên các góp ý chuyên môn (N+1 queries, ràng buộc dữ liệu, bảo mật, và DTO).

---

## 1. Thiết kế Cơ sở dữ liệu & Entity

Hệ thống sử dụng bảng trung gian `favourite_places` liên kết mối quan hệ **Một - Nhiều** từ `User` và `Restaurant`. 

### Ràng buộc duy nhất (Unique Constraint)
Để tránh dữ liệu trùng lặp trong database khi xảy ra các yêu cầu đồng thời (concurrent requests), thực thể [FavouritePlace.java](file:///D:/Ki7/SWD391/ChayNow/backend/BE/src/main/java/com/teamg5/be/entity/FavouritePlace.java) được định nghĩa ràng buộc duy nhất trên cặp khóa ngoại `(user_id, restaurant_id)`:
```java
@Entity
@Table(
    name = "favourite_places",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "restaurant_id"})
)
public class FavouritePlace extends BaseEntity { ... }
```

---

## 2. Danh sách các API Endpoints (Idempotent Behavior)

Tất cả các API yêu cầu đăng nhập (Token JWT). Cả hai thao tác thêm và xóa đều có tính chất **Idempotent** (đảm bảo tính nhất quán của dữ liệu dù gọi nhiều lần liên tiếp).

| Phương thức | Đường dẫn API | Tham số | Mô tả | Hành vi Idempotent |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/favourites/restaurants/{restaurantId}` | `restaurantId` (Path) | Thêm nhà hàng vào danh sách yêu thích. | Nếu đã tồn tại liên kết, hệ thống bỏ qua và trả về `success = true` (không ném lỗi trùng lặp). |
| **DELETE** | `/api/favourites/restaurants/{restaurantId}` | `restaurantId` (Path) | Xóa nhà hàng khỏi danh sách yêu thích. | Nếu liên kết không tồn tại hoặc đã xóa trước đó, vẫn trả về `success = true`. |
| **GET** | `/api/favourites/restaurants` | `page` (Default: 0), `size` (Default: 10) | Lấy danh sách yêu thích của người dùng đang đăng nhập (Phân trang). | Trả về danh sách được phân trang. Tham số được validate: `page >= 0`, `1 <= size <= 50`. |
| **GET** | `/api/favourites/restaurants/{restaurantId}/status` | `restaurantId` (Path) | Kiểm tra trạng thái đã yêu thích hay chưa. | Trả về `true` (đã lưu) hoặc `false` (chưa lưu). |

---

## 3. Các Lớp Cấu trúc Code triển khai

### Bước 1: Tạo DTO Response `FavouritePlaceResponse.java`
Chứa thông tin chi tiết về việc lưu và thực thể nhà hàng:
```java
package com.teamg5.be.dto;

import lombok.Builder;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@Builder
public class FavouritePlaceResponse {
    private Long id;                  // ID bản ghi FavouritePlace
    private RestaurantResponse restaurant; // Thông tin chi tiết nhà hàng
    private LocalDateTime createdAt;  // Thời điểm lưu
}
```

### Bước 2: Tối ưu hóa Repository `FavouritePlaceRepository.java` (N+1 Queries)
Để ngăn ngừa lỗi hiệu năng **N+1 queries** khi duyệt danh sách các địa điểm yêu thích, chúng ta sử dụng truy vấn `JOIN FETCH` để nạp trước (eager loading) các thông tin liên quan của nhà hàng như `typeRestaurant`, `place`, và `owner`:
```java
@Repository
public interface FavouritePlaceRepository extends JpaRepository<FavouritePlace, Long> {
    boolean existsByUserAndRestaurantId(User user, Long restaurantId);
    Optional<FavouritePlace> findByUserAndRestaurantId(User user, Long restaurantId);

    @Query(value = "SELECT fp FROM FavouritePlace fp " +
                   "JOIN FETCH fp.restaurant r " +
                   "JOIN FETCH r.typeRestaurant " +
                   "LEFT JOIN FETCH r.place " +
                   "LEFT JOIN FETCH r.owner " +
                   "WHERE fp.user = :user",
           countQuery = "SELECT count(fp) FROM FavouritePlace fp WHERE fp.user = :user")
    Page<FavouritePlace> findByUser(@Param("user") User user, Pageable pageable);
}
```

### Bước 3: Nghiệp vụ Service `FavouritePlaceServiceImpl.java`
* **Xác thực tập trung:** Sử dụng [SecurityUtils.getCurrentUserLogin()](file:///D:/Ki7/SWD391/ChayNow/backend/BE/src/main/java/com/teamg5/be/utils/SecurityUtils.java) để lấy thông tin Email từ Token của user hiện tại, đảm bảo tính nhất quán bảo mật của hệ thống.
* **Kiểm tra trạng thái nhà hàng:** Khi thêm yêu thích, hệ thống kiểm tra và chỉ cho phép lưu các nhà hàng đang **Active** (`active = true`) và đã được **Duyệt** (`status = RestaurantStatus.APPROVED`). Các nhà hàng chưa duyệt hoặc bị khóa sẽ trả về lỗi `RESTAURANT_NOT_FOUND`.

### Bước 4: Điều phối API `FavouritePlaceController.java`
* **Validate dữ liệu đầu vào:** Kiểm tra tham số phân trang để ngăn chặn lỗi `PageRequest` bất hợp lý hoặc yêu cầu tải dữ liệu quá tải:
  ```java
  if (page < 0 || size <= 0 || size > 50) {
      throw new AppException(ErrorCode.INVALID_INPUT, "Page must be >= 0 and size must be between 1 and 50");
  }
  ```
* Sử dụng `@PreAuthorize("isAuthenticated()")` ở mức lớp để tự động bảo vệ toàn bộ Endpoint yêu thích.
