package com.example.crewstation.interceptor;

import com.example.crewstation.auth.JwtTokenProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.servlet.HandlerInterceptor;

@RequiredArgsConstructor
@Slf4j
public class GuestInterceptor implements HandlerInterceptor {
    private final JwtTokenProvider jwtTokenProvider;

    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
        String username = null;
        String accessToken = null;

        Cookie[] cookies = req.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("accessToken".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                    break;
                }
            }
        }

        if(accessToken != null){
            username = jwtTokenProvider.getUserName(accessToken);
        }

        if (username != null) {
            if(username.contains("@")){
                return true;
            }
            log.info("dwqdqwfqfqdff");
            Cookie deleteAccessCookie = new Cookie("accessToken", null);
            deleteAccessCookie.setHttpOnly(true);
            deleteAccessCookie.setSecure(true);
            deleteAccessCookie.setPath("/");
            deleteAccessCookie.setMaxAge(0);

            res.addCookie(deleteAccessCookie);

            Cookie deleteRefreshCookie = new Cookie("refreshToken", null);
            deleteRefreshCookie.setHttpOnly(true);
            deleteRefreshCookie.setSecure(true);
            deleteRefreshCookie.setPath("/");
            deleteRefreshCookie.setMaxAge(0);

            res.addCookie(deleteRefreshCookie);

            jwtTokenProvider.deleteRefreshToken(username);
            res.sendRedirect("/member/login");
            return false;
        }

        return true;
    }

}
