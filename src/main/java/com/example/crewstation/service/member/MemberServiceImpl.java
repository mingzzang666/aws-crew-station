package com.example.crewstation.service.member;

import aj.org.objectweb.asm.TypeReference;
import com.example.crewstation.common.enumeration.PaymentPhase;
import com.example.crewstation.common.exception.MemberLoginFailException;
import com.example.crewstation.common.exception.MemberNotFoundException;
import com.example.crewstation.domain.file.FileVO;
import com.example.crewstation.domain.member.MemberVO;
import com.example.crewstation.dto.file.FileDTO;
import com.example.crewstation.dto.file.member.MemberFileDTO;
import com.example.crewstation.dto.member.*;
import com.example.crewstation.mapper.payment.status.PaymentStatusMapper;
import com.example.crewstation.repository.country.CountryDAO;
import com.example.crewstation.repository.crew.CrewDAO;
import com.example.crewstation.repository.file.FileDAO;
import com.example.crewstation.repository.member.AddressDAO;
import com.example.crewstation.repository.member.MemberDAO;
import com.example.crewstation.repository.member.MemberFileDAO;
import com.example.crewstation.service.s3.S3Service;
import com.example.crewstation.util.Criteria;
import com.example.crewstation.util.Search;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemberServiceImpl implements MemberService {
    private final MemberDAO memberDAO;
    private final MemberFileDAO memberFileDAO;
    private final AddressDAO addressDAO;
    private final FileDAO fileDAO;
    private final PasswordEncoder passwordEncoder;
    private final S3Service s3Service;
    private final PaymentStatusMapper paymentStatusMapper;
    private final MemberDTO memberDTO;
    private final CrewDAO crewDAO;
    private final CountryDAO countryDAO;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void join(MemberDTO memberDTO, MultipartFile multipartFile) {
        memberDTO.setMemberPassword(passwordEncoder.encode(memberDTO.getMemberPassword()));

        MemberVO vo = toVO(memberDTO);
        memberDAO.save(vo);

        Long memberId = vo.getId();

        AddressDTO addressDTO = new AddressDTO();


        log.info("memberId: {}",memberId);

        addressDTO.setMemberId(memberId);
        addressDTO.setAddressDetail(memberDTO.getAddressDTO().getAddressDetail());
        addressDTO.setAddress(memberDTO.getAddressDTO().getAddress());
        addressDTO.setAddressZipCode(memberDTO.getAddressDTO().getAddressZipCode());

        addressDAO.save(toVO(addressDTO));

        if(multipartFile.getOriginalFilename().equals("")){
            return;
        }
        FileDTO fileDTO = new FileDTO();
        MemberFileDTO memberFileDTO = new MemberFileDTO();
        try {
            String s3Key = s3Service.uploadPostFile(multipartFile, getPath());

            String originalFileName = multipartFile.getOriginalFilename();
            String extension = "";

            if(originalFileName != null && originalFileName.contains(".")){
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }


            fileDTO.setFileOriginName(multipartFile.getOriginalFilename());
            fileDTO.setFilePath(s3Key);
            fileDTO.setFileSize(String.valueOf(multipartFile.getSize()));
            fileDTO.setFileName(UUID.randomUUID() + extension);

            FileVO filevo = toVO(fileDTO);
            fileDAO.save(filevo);

            Long fileId = filevo.getId();

            memberFileDTO.setMemberId(memberId);
            memberFileDTO.setFileId(fileId);

            memberFileDAO.save(toVO(memberFileDTO));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }


    }

    @Override
    public boolean checkEmail(String memberEmail) {
        return memberDAO.checkEmail(memberEmail);
    }

    @Override
    public MemberDTO login(MemberDTO memberDTO) {
        log.info("memberDTO: {}", memberDTO);
        return memberDAO.findForLogin(memberDTO).orElseThrow(MemberLoginFailException::new);
    }

    public String getPath() {
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");
        return today.format(formatter);
    }

    @Override
    @Cacheable(value="member", key="#memberEmail")
    public MemberDTO getMember(String memberEmail, String provider) {
        return (provider == null ? memberDAO.findByMemberEmail(memberEmail)
                : memberDAO.findBySnsEmail(memberEmail)).orElseThrow(MemberNotFoundException::new);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void joinSns(MemberDTO memberDTO, MultipartFile multipartFile) {
        MemberVO vo = toVO(memberDTO);
        memberDAO.saveSns(vo);

        Long memberId = vo.getId();

        AddressDTO addressDTO = new AddressDTO();


        log.info("memberId: {}", memberId);

        addressDTO.setMemberId(memberId);
        addressDTO.setAddressDetail(memberDTO.getAddressDTO().getAddressDetail());
        addressDTO.setAddress(memberDTO.getAddressDTO().getAddress());
        addressDTO.setAddressZipCode(memberDTO.getAddressDTO().getAddressZipCode());

        addressDAO.save(toVO(addressDTO));

        if (multipartFile.getOriginalFilename().equals("")) {
            return;
        }
        FileDTO fileDTO = new FileDTO();
        MemberFileDTO memberFileDTO = new MemberFileDTO();
        try {
            String s3Key = s3Service.uploadPostFile(multipartFile, getPath());

            String originalFileName = multipartFile.getOriginalFilename();
            String extension = "";

            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }


            fileDTO.setFileOriginName(multipartFile.getOriginalFilename());
            fileDTO.setFilePath(s3Key);
            fileDTO.setFileSize(String.valueOf(multipartFile.getSize()));
            fileDTO.setFileName(UUID.randomUUID() + extension);

            FileVO filevo = toVO(fileDTO);
            fileDAO.save(filevo);

            Long fileId = filevo.getId();

            memberFileDTO.setMemberId(memberId);
            memberFileDTO.setFileId(fileId);

            memberFileDAO.save(toVO(memberFileDTO));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }


        memberDAO.saveSns(toVO(memberDTO));

    }
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Optional<MemberProfileDTO> getMemberProfile (Long memberId) {
        MemberProfileDTO profiles = new MemberProfileDTO();
        Optional<MemberProfileDTO> result = memberDAO.selectProfileById(memberId);

        result.ifPresent(profile -> {
           if (profile.getProfileImage() != null) {
               String filePath = profile.getProfileImage();
               profile.setProfileImage(s3Service.getPreSignedUrl(filePath, Duration.ofMinutes(5)));
           }
        });

        return result;
    }

    @Override
    public void resetPassword(String memberEmail, String memberPassword) {
        String newPassword = passwordEncoder.encode(memberPassword);

        memberDAO.updatePassword(memberEmail, newPassword);
    }

    @Override
    public List<MemberDTO> searchMember(String search) {
        List<MemberDTO> searchMember = memberDAO.findSearchMember(search);
        searchMember.forEach(member->{
            if(member.getFilePath() != null) {
                member.setFilePath(s3Service.getPreSignedUrl(member.getFilePath(), Duration.ofMinutes(5)));
            }

        });
//        return memberDAO.findSearchMember(search);
        return searchMember;
    }
// 관리자 회원 목록
    @Override
    public MemberCriteriaDTO getMembers(Search search) {
        int page = Optional.ofNullable(search.getPage()).orElse(1);
        int size = 10;
        int offset = (page - 1) * size;

        int total = memberDAO.countAdminMembers(search);
        List<MemberDTO> members = memberDAO.findAdminMembers(search, size, offset);
        Criteria criteria = new Criteria(page, size, total, 5);

        MemberCriteriaDTO dto = new MemberCriteriaDTO();
        dto.setMembers(members);
        dto.setTotal(total);
        dto.setCriteria(criteria);
        dto.setSearch(search);

        return dto;
    }

//관리자 회원 상세
    @Override
    @Transactional(rollbackFor = Exception.class)
    public MemberDTO getMemberDetail(Long memberId) {
        if (memberId == null) {
            throw new MemberNotFoundException();
        }
        MemberDTO dto = memberDAO.findAdminMemberDetail(memberId);

        if (dto == null) {
            throw new MemberNotFoundException();
        }
        return dto;
    }

    @Override
    public MemberAdminStatics getStatics() {
        MemberAdminStatics statics = new MemberAdminStatics();
        statics.setMonthlyJoins(memberDAO.findMonthlyJoin());
        statics.setTodayJoin(memberDAO.selectCountTodayJoin());
        statics.setTotalCrewCount(crewDAO.selectTotalCrewCount());
        statics.setTotalMemberCount(memberDAO.selectTotalMemberCount());
        statics.setPopularCountries(countryDAO.selectPopularCountries());
        return statics;
    }

    @Override
    public void joinAdmin(MemberDTO memberDTO) {
        memberDTO.setMemberPassword(passwordEncoder.encode(memberDTO.getMemberPassword()));

        memberDTO.setMemberName(memberDTO.getMemberName());
        memberDTO.setMemberRole(memberDTO.getMemberRole());
        memberDTO.setMemberEmail(memberDTO.getMemberEmail());
        memberDTO.setMemberPassword(memberDTO.getMemberPassword());

        memberDAO.insertAdmin(memberDTO);
    }

    public Optional<MemberProfileDTO> getMember(Long memberId) {
        return Optional.empty();
    }

//  별점 등록 시 케미점수 및 상태 갱신
    @Transactional
    public void submitReview(Long sellerId, Long purchaseId, int rating) {
        // 판매자 케미 점수 갱신
        memberDAO.updateChemistryScore(sellerId, rating);

        // 주문 상태 reviewed 로 변경
        paymentStatusMapper.updatePaymentStatus(purchaseId, PaymentPhase.REVIEWED);
    }

//  나의 판매내역 목록
    @Override
    public List<MySaleListDTO> getMySaleList(Long memberId) {
        return memberDAO.findMySaleList(memberId);
    }

}
