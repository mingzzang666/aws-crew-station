// 전역 공통 닫기
window.closeAllLayerUIs = function () {
    const popups = document.querySelectorAll('.bt-pop-menu.show, .bt-pop-menu-back.show, #pop-menu-bt2.show');
    popups.forEach(el => el.classList.remove('show'));

    const modals = document.querySelectorAll('.modal.show, .payment-modal.show');
    modals.forEach(m => {
        m.classList.remove('show');
        m.style.display = 'none';
    });

    document.body.classList.remove('modal-open');
};

// 문의 초기화
window.inquiryInit = async function () {
    if (window.inquireInited) return;
    window.inquireInited = true;

    window.closeAllLayerUIs();

    const section = document.getElementById('section-inquiry');
    if (!section) return;

    const modal = document.getElementById('inquiry-modal');
    const searchInput = section.querySelector('.filter-search input');
    const searchBtn = section.querySelector('.filter-search .btn-search');
    const filterBtn = section.querySelector('#button-filter-status');
    const filterPopup = section.querySelector('#pop-menu-bt2');
    const chkAns = section.querySelector('#checkboxactive1');
    const chkUnAns = section.querySelector('#checkboxactive2');
    const btnAll = section.querySelector('#allchecked1');
    const btnNone = section.querySelector('#allflasechecked1');
    const btnApply = filterPopup ? filterPopup.querySelector('.btn.btn-outline-primary.btn-sm') : null;
    const tbody = section.querySelector('table tbody');

    // 상태
    const state = { keyword: '', category: '' }; // '', 'ANSWERED', 'UNANSWERED'

    function calcCategory() {
        const a = chkAns && chkAns.classList.contains('is-checked');
        const u = chkUnAns && chkUnAns.classList.contains('is-checked');
        if (a && !u) state.category = 'ANSWERED';
        else if (!a && u) state.category = 'UNANSWERED';
        else state.category = '';
    }

    async function loadList() {
        try {
            const list = await inquireService.getList({
                keyword: state.keyword,
                category: state.category
            });
            inquireLayout.showList(list);
        } catch (e) {
            console.error(e);
            if (inquireLayout.showEmpty) inquireLayout.showEmpty();
        }
    }
    await loadList();

    // 검색
    if (searchBtn) {
        searchBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            state.keyword = (searchInput && searchInput.value.trim()) || '';
            await loadList();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', async function (e) {
            if (e.key === 'Enter') {
                state.keyword = searchInput.value.trim();
                await loadList();
            }
        });
    }

    // 필터
    if (filterBtn) {
        filterBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (filterPopup) filterPopup.classList.toggle('show');
        });
    }

    if (filterPopup) {
        filterPopup.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    document.addEventListener('click', function () {
        const visible = section && section.offsetParent !== null;
        if (!visible) return;
        if (filterPopup) filterPopup.classList.remove('show');
    });

    if (btnAll) {
        btnAll.addEventListener('click', function (e) {
            e.preventDefault();
            if (chkAns) chkAns.classList.add('is-checked');
            if (chkUnAns) chkUnAns.classList.add('is-checked');
        });
    }

    if (btnNone) {
        btnNone.addEventListener('click', function (e) {
            e.preventDefault();
            if (chkAns) chkAns.classList.remove('is-checked');
            if (chkUnAns) chkUnAns.classList.remove('is-checked');
        });
    }

    if (chkAns) {
        chkAns.addEventListener('click', function () {
            chkAns.classList.toggle('is-checked');
        });
    }

    if (chkUnAns) {
        chkUnAns.addEventListener('click', function () {
            chkUnAns.classList.toggle('is-checked');
        });
    }

    if (btnApply) {
        btnApply.addEventListener('click', async function (e) {
            e.preventDefault();
            calcCategory();
            if (filterPopup) filterPopup.classList.remove('show');
            await loadList();
        });
    }

    // 상세 보기 (목록 클릭)
    if (tbody) {
        tbody.addEventListener('click', async function (e) {
            const btn = e.target.closest('.action-btn.view, .td-action .action-btn');
            if (!btn) return;

            const id = btn.dataset.id || (btn.closest('tr') ? btn.closest('tr').dataset.id : null);
            if (!id) return;

            try {
                const dto = await inquireService.getDetail(id);
                inquireLayout.showDetail(dto);

                // 모달 열기
                if (typeof inquireLayout.openModal === 'function') {
                    inquireLayout.openModal();
                } else if (modal) {
                    modal.classList.add('show');
                    modal.style.display = 'block';
                    document.body.classList.add('modal-open');
                }
            } catch (err) {
                console.error('문의 상세 조회 실패', err);
                alert('상세 조회에 실패했습니다.');
            }
        });
    }

    // 모달 닫기 & 답변하기
    if (modal) {
        modal.addEventListener('click', async function (e) {
            const target = e.target;

            // 닫기(X)
            if (target.closest('[data-role="inquiry-close"], .btn-close, .close')) {
                e.preventDefault();
                if (typeof inquireLayout.closeModal === 'function') {
                    inquireLayout.closeModal();
                } else {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                }
                return;
            }

            // 답변하기
            const replyBtn = target.closest('button, a');
            if (replyBtn) {
                const text = replyBtn.textContent.trim();
                const isReply = text === '답변하기' || replyBtn.classList.contains('btn-reply');
                if (isReply) {
                    e.preventDefault();
                    const id = modal.dataset.inquiryId;
                    const input = modal.querySelector('.inquiry-reply input, .inquiry-reply textarea');
                    const content = input ? input.value.trim() : '';

                    if (!id) {
                        alert('유효하지 않은 문의입니다.');
                        return;
                    }
                    if (!content) {
                        alert('답변 내용을 입력해 주세요.');
                        return;
                    }

                    try {
                        await inquireService.postReply(id, content);
                        if (typeof inquireLayout.closeModal === 'function') {
                            inquireLayout.closeModal();
                        } else {
                            modal.classList.remove('show');
                            modal.style.display = 'none';
                            document.body.classList.remove('modal-open');
                        }
                        await loadList();
                    } catch (err) {
                        console.error('답변 등록 실패', err);
                        alert('답변 등록에 실패했습니다.');
                    }
                }
            }
        });

        // 배경 클릭 시 닫기
        modal.addEventListener('mousedown', function (e) {
            if (e.target === modal) {
                if (typeof inquireLayout.closeModal === 'function') {
                    inquireLayout.closeModal();
                } else {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                }
            }
        });

        // ESC 닫기
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                if (typeof inquireLayout.closeModal === 'function') {
                    inquireLayout.closeModal();
                } else {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                    document.body.classList.remove('modal-open');
                }
            }
        });
    }
};
