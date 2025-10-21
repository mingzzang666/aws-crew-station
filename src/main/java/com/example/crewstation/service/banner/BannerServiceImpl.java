package com.example.crewstation.service.banner;

import com.example.crewstation.aop.aspect.annotation.LogReturnStatus;
import com.example.crewstation.aop.aspect.annotation.LogStatus;
import com.example.crewstation.common.enumeration.Type;
import com.example.crewstation.common.exception.PurchaseNotFoundException;
import com.example.crewstation.dto.accompany.AccompanyDTO;
import com.example.crewstation.dto.banner.BannerDTO;
import com.example.crewstation.dto.diary.DiaryDTO;
import com.example.crewstation.dto.file.FileDTO;
import com.example.crewstation.dto.file.section.FilePostSectionDTO;
import com.example.crewstation.repository.banner.BannerDAO;
import com.example.crewstation.repository.file.FileDAO;
import com.example.crewstation.service.s3.S3Service;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.Banner;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class BannerServiceImpl implements BannerService {
    private final BannerDAO bannerDAO;
    private final S3Service s3Service;
    private final RedisTemplate<String, Object> redisTemplate;
    private final BannerTransactionService bannerTransactionService;
    private final FileDAO fileDAO;
    private final FileDTO fileDTO;

    @Override
    @Transactional(rollbackFor = Exception.class)
    @LogReturnStatus
    public List<BannerDTO> getBanners(int limit) {
        List<BannerDTO> banners = null;
        Object obj = redisTemplate.opsForValue().get("banners");
        if (obj != null) {
            ObjectMapper mapper = new ObjectMapper();
            banners = mapper.convertValue(
                    obj,
                    new TypeReference<List<BannerDTO>>() {}
            );
        }

//        if (banners != null) {
//            banners.forEach(banner -> {
//                String filePath = banner.getFilePath();
//                String presignedUrl = s3Service.getPreSignedUrl(filePath, Duration.ofMinutes(5));
//
//                log.info("Accompany ID={}, 원본 filePath={}, 발급된 presignedUrl={}",
//                        banner, filePath, presignedUrl);
//                banner.setFilePath(s3Service.getPreSignedUrl(banner.getFilePath(),
//                        Duration.ofMinutes(5)));
//            });
//            return banners;
//        }
        return bannerTransactionService.getBanners(limit);
    }

    @Override
    public void insertBanner(BannerDTO bannerDTO) {
        bannerDTO.setBannerOrder(bannerDTO.getBannerOrder());
        bannerDAO.insertBanner(bannerDTO);

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void insertBannerFile(BannerDTO bannerDTO, List<MultipartFile> files) {
        FileDTO fileDTO = new FileDTO();
        bannerDAO.insertBannerFile(bannerDTO);
        IntStream.range(0, files.size()).forEach(i -> {
            MultipartFile file = files.get(i);
            if (file.getOriginalFilename().equals("")) {
                return;
            }
            try {
                String s3Key = s3Service.uploadPostFile(file, fileDTO.getFilePath());
                String originalFilename = file.getOriginalFilename();
                String extension = "";

                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }

                fileDTO.setFileName(UUID.randomUUID() + extension);
                fileDTO.setFilePath(s3Key);
                fileDTO.setFileSize(String.valueOf(file.getSize()));
                fileDTO.setFileOriginName(originalFilename);
                fileDAO.saveFile(fileDTO);

            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

    }

    @Override
    public void updateBanner(BannerDTO bannerDTO, Long[] deleteFiles, List<MultipartFile> multipartFiles) {
        FileDTO fileDTO = new FileDTO();
        bannerDAO.updateBannerFile(bannerDTO);

        if (deleteFiles != null && deleteFiles.length > 0) {
            s3Service.deleteFile(fileDTO.getFilePath());
            fileDAO.delete(fileDTO.getId());

        }
    }

    @Override
    public void deleteBanner(Long id) {

    }
}








