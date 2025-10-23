const DiaryService = (() => {

    // 나의 다이어리 목록 조회 (무한스크롤)
    const getMyDiaryList = async (page = 1, size = 5) => {
        try {
            const response = await fetch(`/api/mypage/my-diaries?page=${page}&size=${size}`);
            if (!response.ok) throw new Error("다이어리 목록 조회 실패");
            return await response.json();
        } catch (error) {
            console.error("getMyDiaryList error:", error);
            return null;
        }
    };

    // 나의 다이어리 총 개수 조회
    const getMyDiaryCount = async () => {
        try {
            const response = await fetch(`/api/mypage/my/count`);
            if (!response.ok) throw new Error("다이어리 총 개수 조회 실패");
            return await response.json(); // int 값 반환
        } catch (error) {
            console.error(" getMyDiaryCount error:", error);
            return 0;
        }
    };

    return { getMyDiaryList, getMyDiaryCount };
})();