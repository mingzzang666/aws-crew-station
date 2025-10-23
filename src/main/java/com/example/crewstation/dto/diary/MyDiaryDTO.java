package com.example.crewstation.dto.diary;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.stereotype.Component;

@Component
@Getter
@Setter
@ToString
@EqualsAndHashCode(of="id")
public class MyDiaryDTO {
    private Long id;
    private Long postId;
    private String postTitle;
    private Long diaryId;
    private String filePath;
    private Long memberId;
    private Long diaryPathId;
    private String postContent;
    private String createdDatetime;
    private String updatedDatetime;
}
