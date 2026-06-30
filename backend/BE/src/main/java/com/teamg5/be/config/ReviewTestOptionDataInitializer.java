package com.teamg5.be.config;

import com.teamg5.be.entity.ReviewTestOption;
import com.teamg5.be.repository.ReviewTestOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ReviewTestOptionDataInitializer implements CommandLineRunner {

    private final ReviewTestOptionRepository optionRepository;

    @Override
    public void run(String... args) {
        if (optionRepository.count() > 0) {
            return;
        }

        List<ReviewTestOption> defaultOptions = List.of(
            buildOption("Món ăn ngon", 1),
            buildOption("Phục vụ tốt", 2),
            buildOption("Phục vụ nhanh", 3),
            buildOption("Nhân viên thân thiện", 4),
            buildOption("Nhà hàng sạch sẽ", 5),
            buildOption("Không gian đẹp", 6),
            buildOption("Không gian ấm cúng", 7),
            buildOption("Giá hợp lý", 8),
            buildOption("Khẩu phần phù hợp", 9),
            buildOption("Thực đơn đa dạng", 10),
            buildOption("Món chay ngon", 11),
            buildOption("Món tráng miệng ngon", 12),
            buildOption("Phù hợp cho gia đình", 13),
            buildOption("Phù hợp đi theo nhóm", 14),
            buildOption("Phù hợp ăn một mình", 15),
            buildOption("Có chỗ đỗ xe thuận tiện", 16),
            buildOption("Dễ tiếp cận bằng xe lăn", 17),
            buildOption("Nhà vệ sinh sạch sẽ", 18),
            buildOption("Sẽ quay lại", 19)
        );

        optionRepository.saveAll(defaultOptions);
    }

    private ReviewTestOption buildOption(String label, int displayOrder) {
        return ReviewTestOption.builder()
                .label(label)
                .displayOrder(displayOrder)
                .active(true)
                .build();
    }
}
