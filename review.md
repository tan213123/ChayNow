# Review Favourite Places Feature

## Tong quan

Phuong phap trong `favourite_places_feature.md` hop ly: tach bang `favourite_places` lam entity rieng thay vi dung `@ManyToMany` truc tiep, co API them/xoa/lay danh sach/kiem tra trang thai, va khong nhan `userId` tu client nen tranh duoc IDOR.

Code hien tai da trien khai gan dung tai lieu: co `FavouritePlaceController`, `FavouritePlaceService`, `FavouritePlaceServiceImpl`, `FavouritePlaceRepository`, va dung `ApiResponse` + JWT context.

## Diem can cai thien

1. Can them unique constraint cho cap `user_id` + `restaurant_id`.
   Hien tai service check `existsByUserAndRestaurantId` truoc khi save, nhung 2 request dong thoi van co the tao duplicate. Nen them o entity:
   ```java
   @Table(
       name = "favourite_places",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "restaurant_id"})
   )
   ```
   Dong thoi nen co migration/schema tuong ung neu project dung Flyway/Liquibase hoac ddl SQL rieng.

2. Nen bat duplicate bang loi rieng hoac xu ly idempotent ro rang.
   `POST /api/favourites/restaurants/{restaurantId}` hien dang idempotent ngam: neu da favorite thi van tra success. Cach nay chap nhan duoc, nhung nen ghi ro trong tai lieu API. Neu muon strict hon, them `FAVOURITE_ALREADY_EXISTS`.

3. `DELETE` dang tra success ke ca khi restaurant ton tai nhung user chua favorite.
   Neu giu idempotent thi OK, nhung nen ghi ro. Neu muon bao loi dung nghia hon, them `FAVOURITE_NOT_FOUND`.

4. Can validate `page` va `size`.
   Hien controller nhan `int page`, `int size` truc tiep. Nen chan `page < 0`, `size <= 0`, va gioi han `size` toi da, vi `PageRequest.of(page, size)` co the loi hoac bi request qua lon.

5. Can giam nguy co N+1 query khi lay danh sach yeu thich.
   `findByUser` tra `FavouritePlace`, sau do `RestaurantResponse.from()` cham vao `typeRestaurant`, `place`, `owner`, `mediaList`. Neu cac quan he lazy, danh sach co the phat sinh nhieu query. Nen dung `@EntityGraph` hoac query `join fetch` trong repository cho man hinh favourite.

6. Tai lieu de cap `FavouritePlaceResponse` nhung code dang tra `RestaurantResponse`.
   Nen chon 1 huong:
   - Neu UI chi can thong tin restaurant: bo `FavouritePlaceResponse` khoi tai lieu.
   - Neu UI can `favouriteId` va `createdAt`: tao DTO rieng, vi `RestaurantResponse` hien khong co thoi diem user da luu.

7. Nen tai su dung `SecurityUtils`.
   Project da co `com.teamg5.be.utils.SecurityUtils`, trong khi `FavouritePlaceServiceImpl` tu lay user bang `SecurityContextHolder`. Nen gom logic lay current user vao mot noi de tranh lech cach xu ly authentication.

8. Can can nhac chi cho favorite nha hang dang hop le.
   Hien service chi check restaurant ton tai. Neu business yeu cau, nen chan favorite restaurant `active = false` hoac `status != APPROVED`.

9. Can them test cho cac case chinh.
   Toi thieu nen co test cho:
   - Them favourite thanh cong.
   - Them trung khong tao duplicate.
   - Xoa favourite cua chinh user.
   - User A khong anh huong favourite cua User B.
   - Lay danh sach co phan trang.
   - Restaurant khong ton tai tra `RESTAURANT_NOT_FOUND`.

## De xuat cap nhat code uu tien

Uu tien 1:
- Them unique constraint `(user_id, restaurant_id)`.
- Validate `page`, `size`.
- Dong bo tai lieu API ve hanh vi idempotent cua `POST` va `DELETE`.

Uu tien 2:
- Toi uu repository bang `@EntityGraph`/`join fetch` de tranh N+1.
- Quyet dinh dung `RestaurantResponse` hay `FavouritePlaceResponse`.
- Tai su dung `SecurityUtils` cho lay current user.

Uu tien 3:
- Them error code rieng cho favourite neu muon API strict.
- Them unit/integration test cho service va controller.
