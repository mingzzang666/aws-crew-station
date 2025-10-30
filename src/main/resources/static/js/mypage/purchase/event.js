document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("keywordInput");

    if (!searchBtn || !searchInput) {
        console.warn("검색창 요소를 찾을 수 없습니다.");
        return;
    }

    function goSearch() {
        const keyword = searchInput.value.trim();
        const baseUrl = "/mypage/purchase-list";
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        params.append("page", 1);
        params.append("size", 8);

        window.location.href = `${baseUrl}?${params.toString()}`;
    }

    searchBtn.addEventListener("click", goSearch);

    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") goSearch();
    });

    document.querySelectorAll(".oh-pagination__btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const page = new URL(e.currentTarget.href).searchParams.get("page");
            const keyword = searchInput.value.trim();
            const baseUrl = "/mypage/purchase-list";
            const params = new URLSearchParams();
            if (keyword) params.append("keyword", keyword);
            params.append("page", page);
            params.append("size", 8);
            window.location.href = `${baseUrl}?${params.toString()}`;
        });
    });
});
