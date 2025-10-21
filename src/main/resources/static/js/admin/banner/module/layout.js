window.bannerLayout = (() => {
    const getId    = (b) => b?.bannerId ?? b?.id;
    const getOrder = (b) => (b?.bannerOrder ?? b?.sortOrder ?? 0);
    const pickImageUrl = (b) =>
        b?.imageUrl || b?.bannerImageUrl || b?.fileUrl ||
        (Array.isArray(b?.files) && b.files[0]?.url) ||
        (Array.isArray(b?.bannerFiles) && b.bannerFiles[0]?.url) ||
        b?.url || '';

    const rowHTML = (b) => `
    <li class="registered-item" data-id="${getId(b)}" data-order="${getOrder(b)}" draggable="true"
        style="display:grid;grid-template-columns:120px 1fr auto;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid #f1f1f1;">
      <div class="reg-thumb" style="width:120px;height:64px;border:1px solid #eaeaea;border-radius:6px;overflow:hidden;background:#f7f7f7;display:flex;align-items:center;justify-content:center;">
        <img src="${pickImageUrl(b)}" alt="" style="width:100%;height:100%;object-fit:cover;">
      </div>
      <div class="reg-actions" style="display:flex;gap:6px;align-items:center;">
        <button class="reg-btn" data-action="replace">이미지교체</button>
        <button class="reg-btn" data-action="delete">삭제</button>
        <span class="reg-handle" style="cursor:grab;">⋮⋮</span>
      </div>
    </li>`;

    async function render() {
        const listEl = document.getElementById('registered-banner-list');
        if (!listEl) return;
        try {
            const list = await bannerService.getBanners(50);
            console.log('[banner] fetched:', list);
            const ordered = (Array.isArray(list) ? list : [])
                .slice().sort((a, b) => getOrder(a) - getOrder(b));

            listEl.innerHTML = ordered.length
                ? ordered.map(rowHTML).join('')
                : '<li style="padding:12px;color:#888;">등록된 배너가 없습니다.</li>';
        } catch (e) {
            console.error('failed:', e);
            listEl.innerHTML = '<li style="padding:12px;color:#d33;">배너 목록을 불러오지 못했습니다.</li>';
        }
    }

    return { render };
})();
