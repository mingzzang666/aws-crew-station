const diarySection = document.getElementById("section-diary-report");
const diaryReport = diarySection
    ? diarySection.querySelector(".table-reports tbody")
    : null;

const diaryReportLayout = (() => {
    const showReportDiaryList = (reportDiary) => {
        if (!diaryReport) return;            // 섹션 DOM이 없으면 안전 탈출
        // 첫 페이지면 비우고 시작(원하면 유지)
        if (diaryReport.children.length === 0 && Array.isArray(reportDiary) && reportDiary.length > 0) {
            // 필요 시 초기화 로직 추가
        }

        reportDiary.forEach((diary) => {
            const reportTr = document.createElement("tr");
            reportTr.dataset.reportId = diary.reportId;
            reportTr.dataset.status = diary.processStatus || "PENDING";

            const statusValue = (diary.processStatus || "").toUpperCase();
            const statusClass = statusValue === "RESOLVED" ? "status-resolved" : "status-pending";
            const statusText  = statusValue === "RESOLVED" ? "처리완료" : "대기중";

            reportTr.innerHTML = `
        <td class="td-post">
          <div class="post-title">${diary.postTitle}</div>
          <div class="post-meta">
            <span class="meta">by <b>${diary.writerEmail}</b></span>
            <span class="dot">·</span>
            <span class="meta">postId: ${diary.postId}</span>
          </div>
        </td>
        <td class="text-center">
          <span class="badge badge-label reason-badge text-danger">${diary.reportContent}</span>
        </td>
        <td>
          <div>reporter: <b>${diary.reporterEmail ?? diary.reporterSocialEmail ?? "익명"}</b></div>
          <div class="text-muted">${diary.reporterEmail ?? diary.reporterSocialEmail ?? "-"}</div>
        </td>
        <td class="text-center text-muted">${(diary.createdDatetime || "").substring(0,16)}</td>
        <td class="td-actions text-right">
          <span class="approval-status status-badge ${statusClass}">${statusText}</span>
          <button class="btn btn-light-danger btn-sm action-btn view" title="상세보기">
            <i class="mdi mdi-chevron-right"></i>
          </button>
        </td>
      `;
            diaryReport.appendChild(reportTr);
        });
    };

    return { showReportDiaryList };
})();