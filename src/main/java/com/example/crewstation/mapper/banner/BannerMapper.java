package com.example.crewstation.mapper.banner;

import com.example.crewstation.dto.banner.BannerDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BannerMapper {

//    배너 리스트 조회
    public List<BannerDTO> getBanners(@Param("limit") int limit);

    //    배너 추가
    public void insertBanner(BannerDTO bannerDTO);

    //    배너 파일 추가
    public void insertBannerFile(BannerDTO bannerDTO);

    //    배너 수정
    public void updateBannerFile(BannerDTO bannerDTO);

    //    배너 삭제
    public void deleteBanner(@Param("bannerId") Long bannerId);

}
