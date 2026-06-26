package com.teamg5.be.config;

import com.teamg5.be.entity.*;
import com.teamg5.be.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TypeRestaurantRepository typeRestaurantRepository;
    private final PlaceRepository placeRepository;
    private final RestaurantRepository restaurantRepository;
    private final MediaRepository mediaRepository;
    private final MenuRepository menuRepository;
    private final ReviewRepository reviewRepository;
    private final RestaurantOptionRepository restaurantOptionRepository;
    private final EventRepository eventRepository;
    private final PostingRepository postingRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedAdmin();
        if (restaurantRepository.count() == 0) {
            seedData();
        } else {
            log.info("Database already seeded, skipping restaurant seed data.");
        }
    }

    // ===================== ADMIN =====================
    private void seedAdmin() {
        String adminEmail = "admin@chaynow.com";
        User admin = userRepository.findByEmail(adminEmail).orElse(null);
        if (admin == null) {
            admin = User.builder()
                    .email(adminEmail)
                    .fullName("System Administrator")
                    .password(passwordEncoder.encode("123456"))
                    .role(Role.ADMIN)
                    .status(AccountStatus.ACTIVE)
                    .phone("0123456789")
                    .build();
            userRepository.save(admin);
            log.info("Created admin account: {}", adminEmail);
        } else {
            admin.setPassword(passwordEncoder.encode("123456"));
            userRepository.save(admin);
            log.info("Updated admin account password to 123456: {}", adminEmail);
        }
    }

    // ===================== SEED ALL =====================
    private void seedData() {
        log.info("Seeding restaurant data...");

        // ---- TypeRestaurants ----
        TypeRestaurant typeChaySanh = saveTypeIfNotExists("Chay Sành Điệu",
                "Nhà hàng chay hiện đại, phục vụ các món chay cao cấp theo phong cách fusion");
        TypeRestaurant typeChayThien = saveTypeIfNotExists("Chay Thiền",
                "Phong cách ẩm thực chay mang tính tâm linh, thanh tịnh, gần gũi thiên nhiên");
        TypeRestaurant typeChayVegan = saveTypeIfNotExists("Vegan - Thuần Chay",
                "100% thuần chay, không sử dụng bất kỳ sản phẩm từ động vật");
        TypeRestaurant typeChayBinhDan = saveTypeIfNotExists("Chay Bình Dân",
                "Quán cơm chay bình dân, giá rẻ, phù hợp mọi đối tượng");

        // ---- Places ----
        Place placeQ1 = savePlaceIfNotExists("Quận 1", "Quận 1", "TP.HCM", "Trung tâm Quận 1", 10.7769, 106.7009);
        Place placeQ3 = savePlaceIfNotExists("Quận 3", "Quận 3", "TP.HCM", "Trung tâm Quận 3", 10.7801, 106.6891);
        Place placeQ7 = savePlaceIfNotExists("Quận 7", "Quận 7", "TP.HCM", "Phú Mỹ Hưng, Quận 7", 10.7313, 106.7193);
        Place placeBD = savePlaceIfNotExists("Bình Dương", "Bình Dương", "Bình Dương", "TP. Thủ Dầu Một, Bình Dương", 10.9804, 106.6519);
        Place placeHN = savePlaceIfNotExists("Hoàn Kiếm", "Hoàn Kiếm", "Hà Nội", "Khu phố cổ Hà Nội", 21.0285, 105.8542);

        // ---- Users (Owners + Regular) ----
        User owner1 = saveUserIfNotExists("owner1@chaynow.com", "Nguyễn Văn An", "owner123", Role.OWNER, "0901111111");
        User owner2 = saveUserIfNotExists("owner2@chaynow.com", "Trần Thị Bình", "owner123", Role.OWNER, "0902222222");
        User owner3 = saveUserIfNotExists("owner3@chaynow.com", "Lê Minh Cường", "owner123", Role.OWNER, "0903333333");
        User owner4 = saveUserIfNotExists("owner4@chaynow.com", "Phạm Thị Duyên", "owner123", Role.OWNER, "0904444444");

        User user1 = saveUserIfNotExists("user1@chaynow.com", "Hoàng Mỹ Linh", "user123", Role.USER, "0911111111");
        User user2 = saveUserIfNotExists("user2@chaynow.com", "Bùi Văn Đức", "user123", Role.USER, "0912222222");
        User user3 = saveUserIfNotExists("user3@chaynow.com", "Vũ Thị Hoa", "user123", Role.USER, "0913333333");
        User user4 = saveUserIfNotExists("user4@chaynow.com", "Đặng Quốc Hùng", "user123", Role.USER, "0914444444");
        User user5 = saveUserIfNotExists("user5@chaynow.com", "Ngô Thanh Tuyền", "user123", Role.USER, "0915555555");

        User adminUser = userRepository.findByEmail("admin@chaynow.com").orElse(null);

        // ================================================================
        // RESTAURANT 1 - APPROVED - Q1
        // ================================================================
        Restaurant r1 = Restaurant.builder()
                .name("Thiên Nhiên Chay - Fine Dining")
                .address("25 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM")
                .description("Nhà hàng chay cao cấp tại trung tâm Quận 1, mang đến trải nghiệm ẩm thực chay tinh tế với các nguyên liệu hữu cơ, tươi sạch. Không gian sang trọng, ánh đèn ấm cúng, phù hợp cho các buổi họp mặt gia đình và tiệc đặc biệt.")
                .phoneNumber("028 3911 2233")
                .openTime(LocalTime.of(8, 0))
                .closedTime(LocalTime.of(22, 0))
                .typeRestaurant(typeChaySanh)
                .place(placeQ1)
                .owner(owner1)
                .status(RestaurantStatus.APPROVED)
                .approvedBy(adminUser != null ? adminUser.getId() : null)
                .approvedAt(LocalDateTime.now().minusDays(30))
                .build();
        restaurantRepository.save(r1);

        // Media cho r1
        saveMedia(r1, "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800", Mediatype.IMAGE);
        saveMedia(r1, "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800", Mediatype.IMAGE);
        saveMedia(r1, "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800", Mediatype.IMAGE);
        saveMedia(r1, "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800", Mediatype.IMAGE);

        // Menu cho r1
        saveMenu(r1, "Cơm Cuộn Rong Biển Hữu Cơ", "Cơm gạo lứt cuộn rong biển với nhân rau củ tươi, sốt miso", 85000, "Cơm", "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400", true, true);
        saveMenu(r1, "Phở Chay Đặc Biệt", "Nước dùng hầm từ 12 loại rau củ, phục vụ với bánh phở tươi và các loại rau thơm", 75000, "Phở", "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=400", true, true);
        saveMenu(r1, "Gỏi Cuốn Chay Ngũ Sắc", "5 cuốn gỏi với rau củ tươi đủ màu sắc, chấm tương đậu phộng đặc biệt", 65000, "Khai Vị", "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400", true, false);
        saveMenu(r1, "Bún Bò Chay Huế", "Bún tươi với nước dùng cay đặc trưng Huế, kèm sả và các loại rau", 70000, "Bún", "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", true, false);
        saveMenu(r1, "Nước Ép Cần Tây Táo Gừng", "Nước ép tươi thanh lọc cơ thể, tốt cho hệ tiêu hóa", 45000, "Nước uống", "https://images.unsplash.com/photo-1540502220095-b53de6eb85b2?w=400", true, false);
        saveMenu(r1, "Chè Dừa Ba Màu", "Chè dừa truyền thống với đậu xanh, đậu đỏ và thạch dừa", 35000, "Tráng miệng", "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400", true, false);

        // Reviews cho r1
        saveReview(user1, r1, 5, "Tuyệt vời! Không gian rất đẹp và sang trọng. Món ăn ngon, trình bày tinh tế. Đặc biệt là phở chay có nước dùng rất đậm đà, khó tin là chay hoàn toàn!");
        saveReview(user2, r1, 4, "Đồ ăn ngon, phục vụ chuyên nghiệp. Hơi đắt một chút nhưng xứng đáng với chất lượng. Sẽ quay lại vào dịp đặc biệt.");
        saveReview(user3, r1, 5, "Không gian tuyệt vời để ăn tối lãng mạn. Gỏi cuốn ngũ sắc trông rất đẹp và ngon. Giá hơi cao nhưng chấp nhận được.");
        saveReview(user4, r1, 4, "Phở chay đặc biệt ngon! Không tưởng được là nước dùng có thể đậm đà đến vậy mà không cần xương.");

        // Options cho r1
        saveOption(r1, "Phục vụ bàn tận nơi", OptionCategory.SERVICE_OPTIONS, 45, true);
        saveOption(r1, "Đặt bàn trước", OptionCategory.SERVICE_OPTIONS, 38, true);
        saveOption(r1, "Ăn tại chỗ", OptionCategory.DINING_OPTIONS, 42, true);
        saveOption(r1, "Không gian riêng tư", OptionCategory.ATMOSPHERE, 30, true);
        saveOption(r1, "Thanh toán thẻ", OptionCategory.PAYMENT, 40, true);
        saveOption(r1, "Wifi miễn phí", OptionCategory.AMENITIES, 35, true);

        // Events cho r1
        saveEvent(r1, owner1, "Lễ Hội Ẩm Thực Chay Mùa Hè 2026",
                "Sự kiện ẩm thực chay đặc biệt với hơn 20 món chay mới ra mắt. Có chương trình biểu diễn nghệ thuật và triển lãm ẩm thực chay.",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
                LocalDate.of(2026, 7, 15), LocalDate.of(2026, 7, 20), "UPCOMING");

        // ================================================================
        // RESTAURANT 2 - APPROVED - Q3
        // ================================================================
        Restaurant r2 = Restaurant.builder()
                .name("Vườn Thiền Tịnh Tâm")
                .address("78 Võ Văn Tần, Phường 6, Quận 3, TP.HCM")
                .description("Quán chay mang phong cách Thiền, không gian xanh mát với nhiều cây cối, ao cá và tiếng nhạc nhẹ nhàng. Thực đơn theo mùa, sử dụng hoàn toàn rau củ hữu cơ từ vườn riêng. Phù hợp để thư giãn tâm hồn và tận hưởng bữa ăn trong lành.")
                .phoneNumber("028 3811 5566")
                .openTime(LocalTime.of(7, 30))
                .closedTime(LocalTime.of(21, 30))
                .typeRestaurant(typeChayThien)
                .place(placeQ3)
                .owner(owner2)
                .status(RestaurantStatus.APPROVED)
                .approvedBy(adminUser != null ? adminUser.getId() : null)
                .approvedAt(LocalDateTime.now().minusDays(20))
                .build();
        restaurantRepository.save(r2);

        saveMedia(r2, "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", Mediatype.IMAGE);
        saveMedia(r2, "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800", Mediatype.IMAGE);
        saveMedia(r2, "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800", Mediatype.IMAGE);

        saveMenu(r2, "Cơm Niêu Chay Thập Cẩm", "Cơm niêu nấu bằng củi, ăn kèm 8 món chay truyền thống", 65000, "Cơm", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", true, true);
        saveMenu(r2, "Canh Chua Chay", "Canh chua nấu với me, cà chua, dứa và đậu hũ chiên vàng", 45000, "Canh", "https://images.unsplash.com/photo-1547592180-85f173990554?w=400", true, true);
        saveMenu(r2, "Đậu Hũ Sốt Cay", "Đậu hũ non sốt tương cay đặc trưng, rắc hành lá và tương ớt", 40000, "Món Mặn", "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", true, false);
        saveMenu(r2, "Bún Bì Chay", "Bún tươi với bì chay (làm từ đậu hũ), nước mắm chay chua ngọt", 50000, "Bún", "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", true, false);
        saveMenu(r2, "Trà Sen Hoa Nhài", "Trà thảo mộc pha từ hoa sen và hoa nhài, thư giãn tâm trí", 30000, "Nước uống", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", true, false);

        saveReview(user1, r2, 5, "Không gian rất bình yên, cảm giác như thoát khỏi phố thị ồn ào. Cơm niêu chay rất ngon và đặc biệt. Trà sen hoa nhài uống thư giãn cực kỳ!");
        saveReview(user3, r2, 4, "Quán rất xanh và yên tĩnh. Đồ ăn ngon, giá hợp lý. Nhân viên thân thiện và chu đáo. Điểm trừ là hơi khó tìm chỗ đậu xe.");
        saveReview(user5, r2, 5, "Đây là quán chay yêu thích nhất của mình! Không khí thiền định rất đặc biệt. Canh chua chay nấu rất chuẩn vị Miền Nam.");

        saveOption(r2, "Phục vụ tại chỗ", OptionCategory.SERVICE_OPTIONS, 50, true);
        saveOption(r2, "Mang về", OptionCategory.SERVICE_OPTIONS, 35, true);
        saveOption(r2, "Không gian ngoài trời", OptionCategory.ATMOSPHERE, 45, true);
        saveOption(r2, "Gia đình thân thiện", OptionCategory.CUSTOMER_TARGET, 40, true);
        saveOption(r2, "Thanh toán tiền mặt", OptionCategory.PAYMENT, 50, true);

        // ================================================================
        // RESTAURANT 3 - APPROVED - Q7
        // ================================================================
        Restaurant r3 = Restaurant.builder()
                .name("Green Lotus Vegan Café")
                .address("Block B2, Midtown Phú Mỹ Hưng, Quận 7, TP.HCM")
                .description("Quán cà phê và ăn uống thuần chay (100% vegan) theo phong cách hiện đại. Tất cả nguyên liệu đều plant-based, không sử dụng trứng, sữa hay bất kỳ sản phẩm từ động vật. Không gian Instagram-worthy, phù hợp cho giới trẻ và người theo lối sống lành mạnh.")
                .phoneNumber("028 5411 7788")
                .openTime(LocalTime.of(7, 0))
                .closedTime(LocalTime.of(22, 30))
                .typeRestaurant(typeChayVegan)
                .place(placeQ7)
                .owner(owner3)
                .status(RestaurantStatus.APPROVED)
                .approvedBy(adminUser != null ? adminUser.getId() : null)
                .approvedAt(LocalDateTime.now().minusDays(15))
                .build();
        restaurantRepository.save(r3);

        saveMedia(r3, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", Mediatype.IMAGE);
        saveMedia(r3, "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800", Mediatype.IMAGE);
        saveMedia(r3, "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800", Mediatype.IMAGE);

        saveMenu(r3, "Acai Bowl Siêu Thực Phẩm", "Bowl açaí với granola, hạt chia, dâu tây và chuối, phủ mật ong thực vật", 95000, "Breakfast", "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400", true, true);
        saveMenu(r3, "Buddha Bowl Rau Củ Nướng", "Bowl với rau củ nướng đủ màu sắc, quinoa, đậu hũ marinate và sốt tahini", 110000, "Cơm", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", true, true);
        saveMenu(r3, "Burger Nấm Portobello", "Burger chay với nhân nấm portobello nướng, rau xà lách, cà chua và sốt vegan mayo", 85000, "Burger", "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400", true, true);
        saveMenu(r3, "Smoothie Xanh Detox", "Sinh tố rau xanh (cải xoăn, táo, gừng, chanh) - thanh lọc cơ thể", 65000, "Nước uống", "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400", true, false);
        saveMenu(r3, "Oat Latte Vegan", "Cà phê với sữa yến mạch thay cho sữa động vật", 55000, "Nước uống", "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400", true, false);
        saveMenu(r3, "Bánh Mì Bơ Đậu Phộng Chuối", "Bánh mì nướng bơ đậu phộng tự làm với chuối thái lát và hạt điều", 45000, "Bánh", "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400", true, false);

        saveReview(user2, r3, 5, "Quán vegan ngon nhất Sài Gòn mình từng ăn! Buddha Bowl rau củ nướng đẹp và ngon tuyệt. Oat latte cũng rất ngon, không thua gì sữa bò.");
        saveReview(user4, r3, 4, "Không gian rất trendy và đẹp để chụp ảnh. Đồ ăn ngon và lành mạnh. Acai bowl rất tươi và bổ dưỡng. Giá hơi cao nhưng chất lượng ổn.");
        saveReview(user5, r3, 5, "Burger nấm portobello ngon không kém gì burger thịt! Cực kỳ ấn tượng. Nhân viên rất hiểu biết về vegan lifestyle.");

        saveOption(r3, "Giao hàng tận nơi", OptionCategory.SERVICE_OPTIONS, 55, true);
        saveOption(r3, "Đặt online", OptionCategory.SERVICE_OPTIONS, 48, true);
        saveOption(r3, "Không gian làm việc", OptionCategory.ATMOSPHERE, 42, true);
        saveOption(r3, "Sinh viên - Giới trẻ", OptionCategory.CUSTOMER_TARGET, 60, true);
        saveOption(r3, "Thanh toán thẻ", OptionCategory.PAYMENT, 55, true);
        saveOption(r3, "Điểm sạc điện thoại", OptionCategory.AMENITIES, 40, true);

        saveEvent(r3, owner3, "Vegan Challenge Tháng 7",
                "Thử thách ăn vegan 30 ngày cùng Green Lotus! Tham gia để nhận ưu đãi giảm 20% tất cả menu trong suốt tháng 7.",
                "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600",
                LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 31), "UPCOMING");

        // ================================================================
        // RESTAURANT 4 - APPROVED - Q1
        // ================================================================
        Restaurant r4 = Restaurant.builder()
                .name("Cơm Chay Mẹ Nấu")
                .address("12 Phan Bội Châu, Phường Bến Thành, Quận 1, TP.HCM")
                .description("Quán cơm chay bình dân với các món ăn thuần Việt đậm đà hương vị quê nhà. Nấu theo kiểu mẹ nấu - ít dầu mỡ, nhiều rau củ, giá cả hợp lý. Mở cửa từ sáng sớm đến tối, phục vụ cả ba bữa. Nơi lý tưởng cho những ai muốn ăn chay ngon với giá bình dân.")
                .phoneNumber("0901 234 567")
                .openTime(LocalTime.of(6, 0))
                .closedTime(LocalTime.of(20, 0))
                .typeRestaurant(typeChayBinhDan)
                .place(placeQ1)
                .owner(owner4)
                .status(RestaurantStatus.APPROVED)
                .approvedBy(adminUser != null ? adminUser.getId() : null)
                .approvedAt(LocalDateTime.now().minusDays(45))
                .build();
        restaurantRepository.save(r4);

        saveMedia(r4, "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800", Mediatype.IMAGE);
        saveMedia(r4, "https://images.unsplash.com/photo-1547592180-85f173990554?w=800", Mediatype.IMAGE);

        saveMenu(r4, "Cơm Phần Chay (5 món)", "Cơm trắng kèm 5 món chay đổi hàng ngày, gồm canh, xào và kho", 35000, "Cơm", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", true, true);
        saveMenu(r4, "Bún Riêu Chay", "Bún riêu chay nấu với cà chua, đậu hũ và giả cua chay", 30000, "Bún", "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", true, true);
        saveMenu(r4, "Bánh Mì Chay Đặc Biệt", "Bánh mì nhân chả lụa chay, dưa leo, đồ chua và nước sốt đặc biệt", 20000, "Bánh mì", "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400", true, false);
        saveMenu(r4, "Xôi Đậu Đen", "Xôi nếp với đậu đen, dừa nạo và muối vừng", 20000, "Xôi", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400", true, false);
        saveMenu(r4, "Chè Thập Cẩm", "Chè thập cẩm với các loại đậu và nước cốt dừa", 20000, "Tráng miệng", "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400", true, false);

        saveReview(user1, r4, 5, "Quán bình dân mà ngon cực! Cơm phần 35k mà được 5 món ăn no nê. Chất lượng hơn nhiều quán khác gấp đôi giá.");
        saveReview(user2, r4, 4, "Bún riêu chay ngon lắm, nước dùng chua chua cay cay rất đúng vị. Giá rẻ phù hợp với sinh viên và người lao động.");
        saveReview(user3, r4, 5, "Đây là quán cơm chay quen của mình hàng ngày. Giá rẻ, ngon, sạch. Cô chủ quán rất thân thiện và nhiệt tình.");

        saveOption(r4, "Phục vụ nhanh", OptionCategory.SERVICE_OPTIONS, 60, true);
        saveOption(r4, "Mang về", OptionCategory.SERVICE_OPTIONS, 55, true);
        saveOption(r4, "Bình dân", OptionCategory.ATMOSPHERE, 70, true);
        saveOption(r4, "Học sinh - Sinh viên", OptionCategory.CUSTOMER_TARGET, 65, true);
        saveOption(r4, "Tiền mặt", OptionCategory.PAYMENT, 80, true);

        // ================================================================
        // RESTAURANT 5 - APPROVED - Bình Dương
        // ================================================================
        Restaurant r5 = Restaurant.builder()
                .name("Nhà Hàng Chay Phúc Lộc Thọ")
                .address("45 Đại lộ Bình Dương, Phú Hòa, Thủ Dầu Một, Bình Dương")
                .description("Nhà hàng chay theo phong cách truyền thống với sức chứa lớn, phù hợp tổ chức tiệc chay, giỗ chạp và các sự kiện quan trọng. Thực đơn đa dạng với hơn 50 món, trong đó có nhiều món chay cao cấp như hải sản chay, thịt chay các loại.")
                .phoneNumber("0274 3688 999")
                .openTime(LocalTime.of(9, 0))
                .closedTime(LocalTime.of(22, 0))
                .typeRestaurant(typeChaySanh)
                .place(placeBD)
                .owner(owner1)
                .status(RestaurantStatus.APPROVED)
                .approvedBy(adminUser != null ? adminUser.getId() : null)
                .approvedAt(LocalDateTime.now().minusDays(60))
                .build();
        restaurantRepository.save(r5);

        saveMedia(r5, "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", Mediatype.IMAGE);
        saveMedia(r5, "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800", Mediatype.IMAGE);
        saveMedia(r5, "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800", Mediatype.IMAGE);

        saveMenu(r5, "Lẩu Chay Thập Cẩm", "Lẩu chay với nhiều loại nấm, rau củ và các món thịt chay, nước dùng thanh ngọt", 280000, "Lẩu", "https://images.unsplash.com/photo-1547592180-85f173990554?w=400", true, true);
        saveMenu(r5, "Tôm Hùm Chay Sốt Bơ", "Tôm hùm làm từ bột konjac, sốt bơ tỏi thơm nức", 150000, "Hải sản chay", "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400", true, true);
        saveMenu(r5, "Cá Hồi Chay Nướng Miso", "Cá hồi làm từ đậu hũ non, ướp miso và nướng trên than hoa", 120000, "Hải sản chay", "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400", true, false);
        saveMenu(r5, "Súp Vi Cá Chay", "Súp vi cá chay với thạch nấu từ rong biển, vị thanh ngọt", 85000, "Súp", "https://images.unsplash.com/photo-1547592180-85f173990554?w=400", true, false);
        saveMenu(r5, "Chả Giò Chay Giòn", "Chả giò nhân rau củ và miến giòn, chấm tương ớt chua ngọt", 55000, "Khai Vị", "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400", true, false);

        saveReview(user4, r5, 5, "Đây là nhà hàng chay tốt nhất Bình Dương! Lẩu chay thập cẩm rất đậm đà và phong phú. Tôm hùm chay giống thật đến mức ngạc nhiên!");
        saveReview(user5, r5, 4, "Không gian rộng rãi, phù hợp tổ chức sự kiện. Cá hồi chay nướng miso rất ngon và đặc biệt. Giá hơi cao nhưng xứng đáng với chất lượng.");

        saveOption(r5, "Đặt tiệc", OptionCategory.SERVICE_OPTIONS, 30, true);
        saveOption(r5, "Phòng VIP", OptionCategory.DINING_OPTIONS, 25, true);
        saveOption(r5, "Sang trọng", OptionCategory.ATMOSPHERE, 30, true);
        saveOption(r5, "Tiệc gia đình", OptionCategory.CUSTOMER_TARGET, 35, true);
        saveOption(r5, "Thanh toán thẻ", OptionCategory.PAYMENT, 30, true);

        saveEvent(r5, owner1, "Tiệc Vu Lan 2026 - Buffet Chay",
                "Buffet chay đặc biệt mùa Vu Lan với hơn 40 món, giá chỉ 199.000đ/người. Có chương trình văn nghệ và tri ân mẹ.",
                "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
                LocalDate.of(2026, 8, 10), LocalDate.of(2026, 8, 12), "UPCOMING");

        // ================================================================
        // RESTAURANT 6 - PENDING - Hà Nội
        // ================================================================
        Restaurant r6 = Restaurant.builder()
                .name("Bồ Đề Tâm - Chay Hà Thành")
                .address("56 Hàng Bông, Hoàn Kiếm, Hà Nội")
                .description("Nhà hàng chay phong cách Bắc truyền thống giữa lòng phố cổ Hà Nội. Các món chay mang đậm hương vị Hà Thành như bún thang chay, bánh cuốn chay, nem cuốn chay. Không gian hoài cổ với bàn ghế gỗ và đèn lồng đỏ.")
                .phoneNumber("024 3826 1234")
                .openTime(LocalTime.of(8, 0))
                .closedTime(LocalTime.of(21, 30))
                .typeRestaurant(typeChayThien)
                .place(placeHN)
                .owner(owner2)
                .status(RestaurantStatus.PENDING)
                .build();
        restaurantRepository.save(r6);

        saveMedia(r6, "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", Mediatype.IMAGE);

        saveMenu(r6, "Bún Thang Chay", "Bún tươi với nước dùng gà chay, giò chay và trứng rán thái lát", 65000, "Bún", "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=400", true, true);
        saveMenu(r6, "Bánh Cuốn Chay Hà Nội", "Bánh cuốn mỏng nhân giả thịt và mộc nhĩ, chan nước mắm chay", 55000, "Bánh", "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400", true, true);
        saveMenu(r6, "Chả Cá Chay Hà Nội", "Đậu hũ chiên kiểu chả cá Lã Vọng, ăn với bún và rau thì là", 80000, "Món Đặc Biệt", "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400", true, false);

        // ================================================================
        // RESTAURANT 7 - PENDING - Q3
        // ================================================================
        Restaurant r7 = Restaurant.builder()
                .name("Raw Vegan Kitchen")
                .address("101 Cách Mạng Tháng 8, Phường 7, Quận 3, TP.HCM")
                .description("Nhà bếp thuần chay sống (raw vegan) - tất cả nguyên liệu không qua nấu chín trên 42°C để giữ nguyên enzyme và dinh dưỡng. Đây là khái niệm ẩm thực mới tại Việt Nam dành cho người quan tâm đến sức khỏe tối ưu.")
                .phoneNumber("0938 777 888")
                .openTime(LocalTime.of(8, 30))
                .closedTime(LocalTime.of(21, 0))
                .typeRestaurant(typeChayVegan)
                .place(placeQ3)
                .owner(owner3)
                .status(RestaurantStatus.PENDING)
                .build();
        restaurantRepository.save(r7);

        saveMedia(r7, "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800", Mediatype.IMAGE);

        saveMenu(r7, "Zucchini Pasta Raw", "Mì từ bí ngòi thái sợi với sốt pesto basil tươi và hạt thông", 115000, "Pasta", "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400", true, true);
        saveMenu(r7, "Raw Cheesecake Hạt Điều", "Bánh cheesecake làm từ hạt điều ngâm không cần lò nướng", 85000, "Bánh", "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400", true, true);

        // ================================================================
        // RESTAURANT 8 - REJECTED - Q1
        // ================================================================
        Restaurant r8 = Restaurant.builder()
                .name("Quán Chay Tâm An (Từ Chối)")
                .address("99 Lê Lợi, Quận 1, TP.HCM")
                .description("Quán chay nhỏ với thực đơn cơ bản.")
                .phoneNumber("0909 111 222")
                .openTime(LocalTime.of(8, 0))
                .closedTime(LocalTime.of(21, 0))
                .typeRestaurant(typeChayBinhDan)
                .place(placeQ1)
                .owner(owner4)
                .status(RestaurantStatus.REJECTED)
                .rejectReason("Hồ sơ đăng ký thiếu giấy phép vệ sinh an toàn thực phẩm. Vui lòng bổ sung và nộp lại.")
                .approvedBy(adminUser != null ? adminUser.getId() : null)
                .approvedAt(LocalDateTime.now().minusDays(5))
                .build();
        restaurantRepository.save(r8);

        // ================================================================
        // RESTAURANT 9 - PENDING - Q7
        // ================================================================
        Restaurant r9 = Restaurant.builder()
                .name("Sakura Vegan Japanese")
                .address("18 Nguyễn Lương Bằng, Tân Phú, Quận 7, TP.HCM")
                .description("Nhà hàng vegan phong cách Nhật Bản với các món như sushi chay, ramen chay dashi kombu và tempura rau củ. Không gian trang trí phong cách Nhật với hoa anh đào nhân tạo và đèn giấy.")
                .phoneNumber("028 5411 9900")
                .openTime(LocalTime.of(10, 0))
                .closedTime(LocalTime.of(22, 0))
                .typeRestaurant(typeChayVegan)
                .place(placeQ7)
                .owner(owner2)
                .status(RestaurantStatus.PENDING)
                .build();
        restaurantRepository.save(r9);

        saveMedia(r9, "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800", Mediatype.IMAGE);

        saveMenu(r9, "Sushi Chay Ngũ Sắc", "Set 8 cuốn sushi với nhân rau củ đủ màu và avocado", 120000, "Sushi", "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400", true, true);
        saveMenu(r9, "Ramen Chay Dashi Kombu", "Ramen nước dùng tảo kombu, topping nấm shiitake và đậu hũ", 95000, "Ramen", "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400", true, true);
        saveMenu(r9, "Tempura Rau Củ Mix", "Rau củ chiên tempura giòn ăn với dipping sauce", 75000, "Khai Vị", "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400", true, false);

        // ================================================================
        // RESTAURANT 10 - APPROVED - Q3
        // ================================================================
        Restaurant r10 = Restaurant.builder()
                .name("Hoa Sen Trắng - Chay Café")
                .address("33 Nguyễn Đình Chiểu, Phường 3, Quận 3, TP.HCM")
                .description("Không gian kết hợp giữa cà phê và ẩm thực chay, mở cả ngày. Đặc biệt nổi tiếng với các món bánh ngọt chay thuần và cà phê specialty. Không gian thoáng mát với nhiều cây xanh, phù hợp để làm việc và gặp gỡ bạn bè.")
                .phoneNumber("028 3822 4455")
                .openTime(LocalTime.of(7, 0))
                .closedTime(LocalTime.of(22, 0))
                .typeRestaurant(typeChaySanh)
                .place(placeQ3)
                .owner(owner1)
                .status(RestaurantStatus.APPROVED)
                .approvedBy(adminUser != null ? adminUser.getId() : null)
                .approvedAt(LocalDateTime.now().minusDays(10))
                .build();
        restaurantRepository.save(r10);

        saveMedia(r10, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800", Mediatype.IMAGE);
        saveMedia(r10, "https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=800", Mediatype.IMAGE);

        saveMenu(r10, "Bánh Tiramisu Chay", "Tiramisu thuần chay với kem cashew và cà phê espresso", 75000, "Bánh", "https://images.unsplash.com/photo-1543352634-a1c51d9f1fa7?w=400", true, true);
        saveMenu(r10, "Croissant Chay Nhân Chocolate", "Croissant nướng giòn nhân socola đen 70% không sữa", 55000, "Bánh", "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400", true, true);
        saveMenu(r10, "Cold Brew Oat Milk", "Cold brew cà phê ủ lạnh 24 giờ với sữa yến mạch tươi", 65000, "Nước uống", "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400", true, false);
        saveMenu(r10, "Bánh Mì Avocado Toast", "Bánh mì giòn phết bơ bơ tươi, hạt lựu và tương balsamic", 75000, "Breakfast", "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400", true, false);

        saveReview(user1, r10, 5, "Bánh tiramisu chay mà ngon hơn cả tiramisu thường! Không gian quán rất đẹp để ngồi làm việc. Cold brew oat milk là nước uống yêu thích mới của mình.");
        saveReview(user3, r10, 4, "Quán đẹp, cà phê ngon, bánh ngọt variety. Giá khá cao nhưng chất lượng xứng đáng. Hay bị full vào giờ cao điểm nên nên đặt bàn trước.");

        saveOption(r10, "Không gian làm việc", OptionCategory.ATMOSPHERE, 45, true);
        saveOption(r10, "Wifi nhanh", OptionCategory.AMENITIES, 42, true);
        saveOption(r10, "Đặt bàn online", OptionCategory.SERVICE_OPTIONS, 38, true);
        saveOption(r10, "Pet-friendly", OptionCategory.CUSTOMER_TARGET, 30, true);
        saveOption(r10, "Thanh toán thẻ / ví điện tử", OptionCategory.PAYMENT, 50, true);

        // ================================================================
        // POSTINGS - Bài đăng của các owner
        // ================================================================

        // Owner1 (Nguyễn Văn An) đăng bài cho r1
        savePosting(owner1, r1, null,
                "Khai trương menu mùa hè 2026 tại Thiên Nhiên Chay!",
                "Chúng tôi vừa ra mắt thực đơn mùa hè với 8 món mới hoàn toàn từ rau củ hữu cơ. Đặc biệt là bộ đôi Phở Chay Đặc Biệt và Gỏi Cuốn Ngũ Sắc — bạn không thể bỏ qua! Đặt bàn ngay hôm nay để nhận ưu đãi giảm 15% cho lần đầu.",
                "Cơm", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600",
                12, 5, "APPROVED");

        savePosting(owner1, r1, null,
                "Review từ khách hàng: Tại sao Phở Chay của chúng tôi khiến mọi người ngạc nhiên?",
                "Nhiều khách hàng khi lần đầu thử Phở Chay Đặc Biệt tại Thiên Nhiên Chay đều không tin đây là món chay hoàn toàn. Bí quyết nằm ở nước dùng hầm 12 tiếng từ 8 loại rau củ và thảo mộc tươi. Hôm nay chúng tôi chia sẻ một phần bí quyết đó với bạn...",
                "Phở", "https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=600",
                28, 9, "APPROVED");

        savePosting(owner1, r1, null,
                "Chương trình khuyến mãi đặc biệt cuối tuần này",
                "Thứ 7 và Chủ Nhật này, mua 2 món chính tặng 1 ly nước ép tươi bất kỳ. Áp dụng cho tất cả các bàn từ 11h-14h và 17h-20h. Số lượng có hạn, đừng bỏ lỡ!",
                "Khuyến mãi", "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600",
                5, 2, "PENDING");

        // Owner1 đăng bài cho r5 (Phúc Lộc Thọ)
        savePosting(owner1, r5, null,
                "Bí quyết làm Tôm Hùm Chay đúng vị — Công thức từ đầu bếp nhà hàng",
                "Tôm Hùm Chay tại Phúc Lộc Thọ được làm từ bột konjac nhập khẩu, kết hợp với kỹ thuật tạo hình độc quyền giúp giữ nguyên kết cấu và hương vị tự nhiên. Sốt bơ tỏi được nấu từ bơ thực vật hữu cơ và tỏi phi vàng...",
                "Hải sản chay", "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600",
                45, 18, "APPROVED");

        savePosting(owner1, r5, null,
                "Đặt tiệc Vu Lan 2026 - Buffet Chay 40 món chỉ 199k",
                "Mùa Vu Lan về, Phúc Lộc Thọ xin kính chúc quý khách và gia đình một mùa lễ đầy ý nghĩa. Để ghi nhớ công ơn cha mẹ, hãy cùng gia đình thưởng thức bữa tiệc buffet chay với hơn 40 món đặc sắc. Đặt trước để được giảm thêm 10%.",
                "Sự kiện", "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600",
                33, 12, "APPROVED");

        // Owner2 (Trần Thị Bình) đăng bài cho r2
        savePosting(owner2, r2, null,
                "Vườn Thiền Tịnh Tâm - Nơi ẩm thực chữa lành tâm hồn",
                "Đã bao giờ bạn cảm thấy kiệt sức và cần một khoảng không gian tĩnh lặng? Vườn Thiền Tịnh Tâm được thiết kế để trở thành ốc đảo xanh giữa lòng Sài Gòn ồn ào. Hôm nay, chúng tôi chia sẻ về triết lý ẩm thực thiền của chúng tôi...",
                "Câu chuyện", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
                67, 24, "APPROVED");

        savePosting(owner2, r2, null,
                "Trà Sen Hoa Nhài — Thức uống của sự bình yên",
                "Công thức pha trà sen của chúng tôi được lưu truyền từ một thiền viện ở Huế. Trà được hái vào buổi sáng sớm khi còn đọng sương, ướp với hoa nhài tươi trong 8 tiếng trước khi phục vụ. Mỗi tách trà là một trải nghiệm thiền định...",
                "Nước uống", "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600",
                41, 15, "APPROVED");

        savePosting(owner2, r2, null,
                "Thực đơn theo mùa tháng 7 - Rau củ từ vườn nhà",
                "Tháng 7 chúng tôi thu hoạch được mẻ rau hữu cơ đầu tiên từ vườn rau riêng tại ngoại ô. Thực đơn tháng này sẽ có thêm 5 món mới hoàn toàn từ rau vườn nhà, đảm bảo tươi sạch 100%.",
                "Cơm", "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600",
                8, 3, "REJECTED");

        // Owner3 (Lê Minh Cường) đăng bài cho r3
        savePosting(owner3, r3, null,
                "Acai Bowl mới - Siêu thực phẩm đến từ Amazon",
                "Chúng tôi vừa nhập về lô açaí tươi đông lạnh đầu tiên tại Việt Nam! Açaí berry được chứng minh có hàm lượng antioxidant cao gấp 3 lần blueberry, giúp chống lão hóa và tăng cường năng lượng. Hãy thử ngay Acai Bowl tại Green Lotus!",
                "Breakfast", "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600",
                89, 31, "APPROVED");

        savePosting(owner3, r3, null,
                "Vegan Challenge Tháng 7 — Cùng nhau thay đổi vì hành tinh",
                "Ăn vegan không chỉ tốt cho sức khỏe mà còn giảm 50% lượng carbon footprint của bạn! Tham gia Vegan Challenge Tháng 7 của Green Lotus — đăng ký nhận meal plan miễn phí và được giảm 20% tất cả menu trong suốt tháng 7.",
                "Sự kiện", "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=600",
                124, 47, "APPROVED");

        savePosting(owner3, r3, null,
                "Behind the scene: Cách chúng tôi làm Burger Nấm Portobello",
                "Burger Nấm Portobello là món best-seller tại Green Lotus. Nấm được ướp 24 giờ với sốt balsamic và herbs trước khi nướng trên than. Bơ vegan mayo tự làm từ cashew và lemon. Tất cả nguyên liệu đều organic và không biến đổi gen...",
                "Burger", "https://images.unsplash.com/photo-1550317138-10000687a72b?w=600",
                56, 22, "PENDING");

        log.info("✅ Seed data completed: 10 restaurants, menus, reviews, options, events and postings created.");
    }

    // ===================== HELPER METHODS =====================

    private TypeRestaurant saveTypeIfNotExists(String name, String description) {
        if (!typeRestaurantRepository.existsByName(name)) {
            TypeRestaurant type = TypeRestaurant.builder()
                    .name(name)
                    .description(description)
                    .build();
            return typeRestaurantRepository.save(type);
        }
        return typeRestaurantRepository.findAll().stream()
                .filter(t -> t.getName().equals(name))
                .findFirst()
                .orElseThrow();
    }

    private Place savePlaceIfNotExists(String name, String district, String city, String address,
                                        double lat, double lng) {
        return placeRepository.findAll().stream()
                .filter(p -> p.getName().equals(name))
                .findFirst()
                .orElseGet(() -> placeRepository.save(Place.builder()
                        .name(name)
                        .district(district)
                        .city(city)
                        .active(true)
                        .build()));
    }

    private User saveUserIfNotExists(String email, String fullName, String rawPassword, Role role, String phone) {
        if (!userRepository.existsByEmail(email)) {
            User user = User.builder()
                    .email(email)
                    .fullName(fullName)
                    .password(passwordEncoder.encode(rawPassword))
                    .role(role)
                    .status(AccountStatus.ACTIVE)
                    .phone(phone)
                    .build();
            return userRepository.save(user);
        }
        return userRepository.findByEmail(email).orElseThrow();
    }

    private void saveMedia(Restaurant restaurant, String url, Mediatype type) {
        Media media = Media.builder()
                .url(url)
                .type(type)
                .restaurant(restaurant)
                .build();
        mediaRepository.save(media);
    }

    private void saveMenu(Restaurant restaurant, String name, String description,
                          Integer price, String category, String imageUrl,
                          boolean available, boolean featured) {
        Menu menu = Menu.builder()
                .restaurant(restaurant)
                .name(name)
                .description(description)
                .price(price)
                .category(category)
                .imageUrl(imageUrl)
                .available(available)
                .featured(featured)
                .build();
        menuRepository.save(menu);
    }

    private void saveReview(User user, Restaurant restaurant, int rating, String context) {
        if (!reviewRepository.existsByUser_IdAndRestaurant_Id(user.getId(), restaurant.getId())) {
            Review review = Review.builder()
                    .user(user)
                    .restaurant(restaurant)
                    .rating(rating)
                    .context(context)
                    .build();
            reviewRepository.save(review);
        }
    }

    private void saveOption(Restaurant restaurant, String name, OptionCategory category,
                            int voteCount, boolean isApproved) {
        RestaurantOption option = RestaurantOption.builder()
                .restaurant(restaurant)
                .name(name)
                .category(category)
                .voteCount(voteCount)
                .isApproved(isApproved)
                .build();
        restaurantOptionRepository.save(option);
    }

    private void saveEvent(Restaurant restaurant, User creator, String title,
                           String description, String imageUrl,
                           LocalDate startDate, LocalDate endDate, String status) {
        Event event = Event.builder()
                .restaurant(restaurant)
                .creator(creator)
                .title(title)
                .description(description)
                .imageUrl(imageUrl)
                .startDate(startDate)
                .endDate(endDate)
                .status(status)
                .build();
        eventRepository.save(event);
    }

    private void savePosting(User owner, Restaurant restaurant, Menu menu,
                              String title, String content, String category,
                              String thumbnailUrl, int likeCount, int commentCount,
                              String status) {
        Posting posting = Posting.builder()
                .user(owner)
                .restaurant(restaurant)
                .menu(menu)
                .title(title)
                .content(content)
                .category(category)
                .thumbnailUrl(thumbnailUrl)
                .likeCount(likeCount)
                .commentCount(commentCount)
                .status(status)
                .build();
        postingRepository.save(posting);
    }
}
