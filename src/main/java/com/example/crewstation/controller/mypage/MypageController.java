package com.example.crewstation.controller.mypage;

import com.example.crewstation.auth.CustomUserDetails;
import com.example.crewstation.dto.member.MySaleListDTO;
import com.example.crewstation.dto.purchase.PurchaseListCriteriaDTO;
import com.example.crewstation.service.member.MemberService;
import com.example.crewstation.service.purchase.PurchaseService;
import com.example.crewstation.util.ScrollCriteria;
import com.example.crewstation.util.Search;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/mypage/**")
public class MypageController {

    private final PurchaseService purchaseService;
    private final MemberService memberService;

    // 마이페이지 -> 내가 좋아요한 일기 목록 화면 & 내가 댓글 단 일기 목록 화면
    @GetMapping("/my-activities")
    public String loadMyActivitiesPage() {
        log.info("마이페이지 - 좋아요한 일기 화면 요청");
        return "mypage/my-activities";
    }

    // 마이페이지 -> 나의 구매내역 목록
    @GetMapping("/purchase-list")
    public String getPurchaseList(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                  @RequestParam(defaultValue = "1") int page,
                                  @RequestParam(defaultValue = "10") int size,
                                  @RequestParam(required = false) String keyword,
                                  Model model) {

        Long memberId = customUserDetails.getId();

        ScrollCriteria scrollCriteria = new ScrollCriteria(page, size);
        Search search = new Search();
        search.setKeyword(keyword);

        PurchaseListCriteriaDTO result = purchaseService.getPurchaseListByMemberId(memberId, scrollCriteria, search);

        model.addAttribute("result", result);
        model.addAttribute("purchaseList", result.getPurchaseListDTOs());
        model.addAttribute("criteria", result.getScrollcriteria());
        model.addAttribute("search", result.getSearch());

        log.info("memberId={}, keyword={}, page={}, size={}", memberId, keyword, page, size);
        log.info("otal={}, hasMore={}", scrollCriteria.getTotal(), scrollCriteria.isHasMore());

        return "mypage/purchase-list";
    }

    // 마이페이지 - 구매 상세 페이지
    @GetMapping("/purchase-detail/{postId}")
    public String loadMyPurchaseDetailPage(@PathVariable("postId") Long postId, Model model) {
        model.addAttribute("postId", postId);
        return "mypage/purchase-detail";
    }


    @GetMapping("/sale-list")
    public String goToMySaleListPage(Model model,@AuthenticationPrincipal CustomUserDetails customUserDetails) {

        Long memberId = customUserDetails.getId();

        List<MySaleListDTO> saleList = memberService.getMySaleList(memberId);
        model.addAttribute("saleList", saleList);

        return "mypage/sale-list";
    }
}
