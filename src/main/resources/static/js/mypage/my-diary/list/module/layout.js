const DiaryLayout = (() => {

    // 상단 개수 표시 업데이트
    const updateDiaryCount = (count) => {
        const tagName = document.querySelector(".tag-name");
        if (tagName) tagName.textContent = `모두(${count})`;
    };

    // 다이어리 목록 렌더링
    const renderDiaryList = (diaries) => {
        const container = document.querySelector(".diary-container-inner");
        container.innerHTML = "";

        if (!diaries || diaries.length === 0) {
            container.innerHTML = `<p class="user-project-feed__empty">결과가 존재하지 않습니다.</p>`;
            return;
        }

        diaries.forEach(diary => {
            const diaryHTML = `
                <div class="diary-wrap">
                    <div class="diary-div">
                        <a href="/diary/${diary.diaryId}">
                            <div class="diary-img-wrap">
                                <img class="diary-img" src="${diary.mainImage || '/static/images/default-diary.jpg'}">
                                <div class="date-tag">
                                    <span class="tag-span">${diary.createdDatetime?.split('T')[0] || ''}</span>
                                </div>
                                <p class="diary-title">${diary.postTitle || '제목 없음'}</p>
                                <p class="diary-content">${diary.postContent || ''}</p>
                            </div>
                        </a>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML("beforeend", diaryHTML);
        });
    };

    return { renderDiaryList : renderDiaryList,
            updateDiaryCount : updateDiaryCount };
})();
