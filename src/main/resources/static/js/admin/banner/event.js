(() => {
    if (window.bannerEventsBound) return;
    window.bannerEventsBound = true;

    function observeVisibleRefresh(section, onShow) {
        if (!section) return;
        const runIfVisible = () => {
            const st = getComputedStyle(section);
            if (st.display !== 'none' && st.visibility !== 'hidden') onShow();
        };

        const mo = new MutationObserver(runIfVisible);
        mo.observe(section, { attributes: true, attributeFilter: ['style', 'class'] });
    }

    function bindUpload() {
        const input = document.getElementById('banner-file');
        const listEl = document.getElementById('registered-banner-list');
        if (!input || !listEl) return;

        input.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            try {
                const count = listEl.querySelectorAll('.registered-item').length;
                await bannerService.insertBanner({ bannerOrder: count }, [file]);
                await bannerLayout.render();
            } catch (err) {
                console.error(err);
                alert(err.message || '배너 등록 실패');
            } finally {
                e.target.value = '';
            }
        });
    }

    function bindClicks() {
        const section = document.getElementById('section-banner');
        const listEl  = document.getElementById('registered-banner-list');
        const saveBtn = document.getElementById('save-order-btn');
        if (!section || !listEl) return;

        section.addEventListener('click', async (e) => {
            if (e.target.closest('#save-order-btn')) {
                try {
                    const items = [...listEl.querySelectorAll('.registered-item')];
                    for (let i = 0; i < items.length; i++) {
                        await bannerService.updateBanner(items[i].dataset.id, { bannerOrder: i });
                    }
                    alert('순서를 저장했습니다.');
                    await bannerLayout.render();
                } catch (err) {
                    console.error(err);
                    alert(err.message || '순서 저장 실패');
                }
                return;
            }

            const li = e.target.closest('.registered-item');
            if (!li || !listEl.contains(li)) return;
            const bannerId = li.dataset.id;

            if (e.target.matches('[data-action="delete"]')) {
                if (!confirm('삭제할까요?')) return;
                try {
                    await bannerService.deleteBanner(bannerId);
                    await bannerLayout.render();
                } catch (err) {
                    console.error(err);
                    alert(err.message || '배너 삭제 실패');
                }
                return;
            }

            if (e.target.matches('[data-action="replace"]')) {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async () => {
                    const file = input.files?.[0];
                    if (!file) return;
                    try {
                        await bannerService.updateBanner(bannerId, {}, [file]);
                        await bannerLayout.render();
                    } catch (err) {
                        console.error(err);
                        alert(err.message || '이미지 교체 실패');
                    }
                };
                input.click();
                return;
            }
        });
    }

    // 수정 드래그
    function bindDragSort() {
        const listEl = document.getElementById('registered-banner-list');
        if (!listEl) return;
        let draggingEl = null;

        listEl.addEventListener('dragstart', (e) => {
            const item = e.target.closest('.registered-item');
            if (!item) return;
            draggingEl = item;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', item.dataset.id);
        });

        listEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!draggingEl) return;
            const after = getDragAfterElement(listEl, e.clientY);
            if (after == null) listEl.appendChild(draggingEl);
            else listEl.insertBefore(draggingEl, after);
        });

        listEl.addEventListener('dragend', () => {
            draggingEl?.classList.remove('dragging');
            draggingEl = null;
        });

        function getDragAfterElement(container, y) {
            const els = [...container.querySelectorAll('.registered-item:not(.dragging)')];
            let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
            for (const child of els) {
                const box = child.getBoundingClientRect();
                const offset = y - (box.top + box.height / 2);
                if (offset < 0 && offset > closest.offset) closest = { offset, element: child };
            }
            return closest.element;
        }
    }

    async function init() {
        const section = document.getElementById('section-banner');
        if (!section) return;

        await bannerLayout.render();

        observeVisibleRefresh(section, () => bannerLayout.render());
        bindUpload();
        bindClicks();
        bindDragSort();
    }

    window.bannerInit = async function bannerInit() {
        if (window.bannerInitDone) return;
        window.bannerInitDone = true;
        try {
            await init();
            console.log('[bannerInit] inited');
        } catch (e) {
            console.error('[bannerInit] init failed:', e);
        }
    };
})();
