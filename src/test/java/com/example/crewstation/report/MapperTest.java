package com.example.crewstation.report;

import com.example.crewstation.common.enumeration.AccompanyStatus;
import com.example.crewstation.dto.report.ReportDTO;
import com.example.crewstation.dto.report.post.ReportPostDTO;
import com.example.crewstation.mapper.post.PostMapper;
import com.example.crewstation.mapper.report.ReportMapper;
import com.example.crewstation.util.ScrollCriteria;
import com.example.crewstation.util.Search;
import lombok.extern.slf4j.Slf4j;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

@SpringBootTest
@Slf4j
public class MapperTest {
    @Autowired
    private ReportMapper reportMapper;

    @Test
    public void testInsertReport() {
        ReportDTO reportDTO = new ReportDTO();
        reportDTO.setReportContent("불법 물품 같아요");
        reportDTO.setMemberId(1L);
        reportMapper.insertReport(reportDTO);
        assertNotNull(reportDTO.getId());
        log.info(reportDTO.toString());
    }

    @Test
    public void testSelectAccompanyReport() {
        ScrollCriteria scrollCriteria = new ScrollCriteria(1, 10);
        Search search = new Search();
        search.setPage(1);
        search.setAccompanyStatus(AccompanyStatus.SHORT);
        scrollCriteria.setTotal(reportMapper.selectReportAccompanyCount(search.getAccompanyStatus()));

//        reportMapper.selectAllReportAccompany(scrollCriteria, search);
        log.info(reportMapper.selectAllReportAccompany(scrollCriteria, search).toString());
    }
}
