// ===================== My Sale Detail Layout =====================
const saleLayout = (() => {

    // 상태 텍스트 매핑
    const mapStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case "request": return "요청 대기";
            case "pending": return "결제 대기";
            case "success": return "결제 완료";
            case "received": return "수령 완료";
            case "reviewed": return "리뷰 완료";
            case "refund": return "주문 취소";
            default: return status || "";
        }
    };

    // 날짜 + 요일 포맷
    function formatDateLabel(dateString) {
        if (!dateString) return "";
        const dateObj = new Date(dateString);
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const day = String(dateObj.getDate()).padStart(2, "0");
        const week = ["일", "월", "화", "수", "목", "금", "토"];
        const dayLabel = week[dateObj.getDay()];
        return `${month}/${day} (${dayLabel})`;
    }

    // 상태선 렌더링
    function renderStatusLines(status) {
        const s = status?.toLowerCase();
        const statusOrder = {
            request: 0,
            pending: 1,
            success: 2,
            received: 3,
            reviewed: 4
        };
        const labels = ["요청 대기", "결제 대기", "결제 완료", "수령 완료", "리뷰 완료"];
        const currentIndex = statusOrder[s] ?? 0;

        return labels.map((label, idx) => {
            if (idx < currentIndex) {
                return `<div class="line fill"><h3 class="status">${label}</h3></div>`;
            } else if (idx === currentIndex) {
                return `
                    <div class="line">
                        <span class="now">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none">
                                <path fill="#2F3438" fill-rule="evenodd" d="M1.201 3.182a.6.6 0 0 1 .847.05l3.996 4.495 3.997-4.496a.6.6 0 1 1 .896.798l-4.07 4.58a1.1 1.1 0 0 1-1.645 0l-4.07-4.58a.6.6 0 0 1 .05-.847" clip-rule="evenodd"></path>
                            </svg>
                        </span>
                        <h3 class="status">${label}</h3>
                    </div>
                `;
            } else {
                return `<div class="line"><h3 class="status">${label}</h3></div>`;
            }
        }).join("");
    }

    // 전화번호 포맷
    function formatPhone(phone) {
        if (!phone) return "";
        const digits = phone.replace(/\D/g, "");
        if (digits.length === 10) return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
        return phone;
    }

    // 상세 렌더링
    const renderSaleDetail = (container, order) => {
        container.innerHTML = `
        <section class="header ${order.paymentPhase === "refund" ? "refund-bg" : ""}">
            <section class="header-wrapper">
                <h1 class="header-title">
                    <span class="date">${formatDateLabel(order.updatedDatetime || order.createdDatetime)}</span>
                    <span>${mapStatusText(order.paymentPhase)}</span>
                </h1>
            </section>

            <div class="status-wrapper">
                ${renderStatusLines(order.paymentPhase)}
            </div>
        </section>

        <hr class="bar">

        <div class="product">
            <section class="header-wrapper">
                <h1 class="header-title"><span>주문 정보</span></h1>
            </section>

            <a href="/gifts/detail/${order.postId}" class="product-wrapper">
                <img src="${order.mainImage}" alt="상품 이미지">
                <div class="purchase-info">
                    <p class="info-title">${order.postTitle}</p>
                    <p class="info-price">${order.purchaseProductPrice.toLocaleString()} 원</p>
                </div>
            </a>

            <hr class="divider">

            <div class="info-container">
                <h2 class="address-wrap">구매자 정보</h2>
                <div class="buyer-info-category"><span class="buyer-info">이름</span>${order.memberName}</div>
                <div class="buyer-info-category"><span class="buyer-info">전화번호</span>${formatPhone(order.memberPhone)}</div>
            </div>

            <hr class="divider">

            <div class="info-container">
                <h2 class="address-wrap">배송지 정보</h2>
                <div class="address-info-category">
                    <span class="address-info">주소</span>
                    ${order.addressZipCode ? "(" + order.addressZipCode + ") " : ""}${order.address || ""} ${order.addressDetail || ""}
                </div>
                <div class="address-info-category"><span class="address-info">수령인</span>${order.memberName}</div>
                <div class="address-info-category"><span class="address-info">전화번호</span>${formatPhone(order.memberPhone)}</div>
            </div>
        </div>
    `;
    };

    return {
        renderSaleDetail : renderSaleDetail
    };

})();
