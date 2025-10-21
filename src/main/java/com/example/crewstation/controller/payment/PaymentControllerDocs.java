package com.example.crewstation.controller.payment;

import com.example.crewstation.auth.CustomUserDetails;
import com.example.crewstation.dto.payment.PaymentResponseDTO;
import com.example.crewstation.dto.payment.status.PaymentStatusDTO;
import com.example.crewstation.dto.reply.ReplyCriteriaDTO;
import com.example.crewstation.dto.reply.ReplyDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

// http://localhost:10000/swagger-ui/index.html
@Tag(name = "Payment", description = "Payment API")
public interface PaymentControllerDocs {
    @Operation(summary = "비회원 접수",
    description = "비회원에게 임시 주문번호 전송",
    parameters = {
            @Parameter(name = "paymentStatusDTO",description = "비회원 유저의 정보가 들어온다"),
            @Parameter(name="userDetails",description = "로그인한 회원의 정보가 들어온다.")
    })
    public ResponseEntity<PaymentResponseDTO> requestPayment(@RequestBody PaymentStatusDTO paymentStatusDTO, @AuthenticationPrincipal CustomUserDetails userDetails);


}
