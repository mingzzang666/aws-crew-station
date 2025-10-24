package com.example.crewstation.dto.member;

import com.example.crewstation.common.enumeration.PaymentPhase;
import lombok.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MySaleListDTO {
    private Long memberId;
    private Long postId;
    private String postTitle;
    private String purchaseProductPrice;
    private Long fileId;
    private String filePath;
    private String fileName;
    private String fileOriginName;
    private String createdDatetime;
    private String updatedDatetime;
    private PaymentPhase status;
    private Long paymentStatusId;

    public String getFormattedCreatedDatetime() {
        return formatDateString(createdDatetime);
    }

    public String getFormattedUpdatedDatetime() {
        return formatDateString(updatedDatetime);
    }

    private String formatDateString(String datetime) {
        if (datetime == null || datetime.isBlank()) return "";

        try {
            // 정규식으로 소수점 이하 자릿수 보정
            if (datetime.contains(".")) {
                Pattern pattern = Pattern.compile("\\.(\\d{1,6})$");
                Matcher matcher = pattern.matcher(datetime);
                if (matcher.find()) {
                    String frac = matcher.group(1);
                    String padded = String.format("%-6s", frac).replace(' ', '0');
                    datetime = matcher.replaceAll("." + padded);
                }
            }

            DateTimeFormatter dbFormat = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");
            LocalDateTime parsed = LocalDateTime.parse(datetime, dbFormat);
            return parsed.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

        } catch (DateTimeParseException e1) {
            try {
                DateTimeFormatter fallback = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                LocalDateTime parsed = LocalDateTime.parse(datetime, fallback);
                return parsed.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
            } catch (Exception e2) {
                return datetime; // 포맷 실패 시 원본 반환
            }
        }
    }
}
