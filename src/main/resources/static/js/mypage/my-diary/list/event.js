// /static/js/mypage/my-diary/list/event.js

document.addEventListener("DOMContentLoaded", async () => {
    let page = 1;
    const size = 5;
    let hasMore = true;
    let checkScroll = true;

    // 첫 로드 시 다이어리 목록 및 총 개수 표시
    const totalCount = await DiaryService.getMyDiaryCount();
    DiaryLayout.updateDiaryCount(totalCount);
    await loadMyDiaryList(page);

    // ===================== 무한 스크롤 =====================
    window.addEventListener("scroll", async () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 스크롤이 맨 아래에 도달했을 때
        if (scrollTop + windowHeight >= documentHeight - 2) {
            if (!checkScroll) return;

            if (hasMore) {
                page++;
                const newCriteria = await loadMyDiaryList(page);
                hasMore = newCriteria?.hasMore ?? false;
            }

            // 스크롤 딜레이(중복 요청 방지)
            checkScroll = false;
            setTimeout(() => { checkScroll = true; }, 1100);
        }
    });

    // ===================== 목록 로딩 함수 =====================
    async function loadMyDiaryList(page) {
        const data = await DiaryService.getMyDiaryList(page, size);

        if (data && data.myDiaryDTOs) {
            DiaryLayout.renderDiaryList(data.myDiaryDTOs);
            hasMore = data.criteria.total > page * size;
            return data.criteria;
        } else {
            hasMore = false;
        }
    }
});
