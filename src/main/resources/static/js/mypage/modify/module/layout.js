document.addEventListener("DOMContentLoaded", async () => {
    try {
        const data = await memberService.getMemberInfo();

        // 프로필 이미지 처리
        const profileImg = document.querySelector(".profile-img");
        if (data.profileImageUrl && data.profileImageUrl.trim() !== "") {
            profileImg.src = data.profileImageUrl;
        } else {
            profileImg.src =
                "https://image.ohousecdn.com/i/bucketplace-v2-development/uploads/default_images/avatar.png?w=144&h=144&c=c";
        }

        // 이미지 깨짐 방지
        profileImg.onerror = () => {
            profileImg.src =
                "https://image.ohousecdn.com/i/bucketplace-v2-development/uploads/default_images/avatar.png?w=144&h=144&c=c";
        };

        // 데이터 채워넣기
        document.querySelector(".input-email").value = data.memberEmail || "";
        document.querySelector(".read-name").value = data.memberName || "";
        document.querySelector(".birth-name").value = data.memberBirth || "";
        document.querySelector(".phone .input-input").value =
            data.memberPhone || "";
        document.querySelector(".address-code").value = data.zipCode || "";
        document.querySelector(".address").value = data.address || "";
        document.querySelector(".address-detail").value = data.addressDetail || "";
        document.querySelector(".password-check").value =
            data.memberSocialUrl || "";

        // 이벤트 초기화
        initModifyEvents();
    } catch (err) {
        console.error("마이페이지 정보 조회 실패:", err);
        alert("내 정보를 불러올 수 없습니다.");
    }
});
