const bannerService = (() => {

    const request = async (url, options = {}) => {
        const response = await fetch(url, {
            credentials: 'include',
            ...options,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `Fetch error: ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            return await response.json();
        } else {
            return await response.text();
        }
    };

    //  배너 목록 조회
    const getBanners = async (limit = 10) => {
        return await request(`/api/admin/banner?limit=${limit}`, {
            method: 'GET'
        });
    };

    //  배너 등록
    const insertBanner = async (bannerDTO, files = []) => {
        const formData = new FormData();

        if (bannerDTO.bannerOrder !== undefined)
            formData.append('bannerOrder', bannerDTO.bannerOrder);
        if (bannerDTO.title)
            formData.append('title', bannerDTO.title);
        if (bannerDTO.linkUrl)
            formData.append('linkUrl', bannerDTO.linkUrl);

        // 파일 추가
        if (files && files.length > 0) {
            files.forEach(file => formData.append('files', file));
        }

        await request('/api/admin/banner', {
            method: 'POST',
            body: formData
        });
    };

    //  배너 수정 (교체, 순서 변경, 파일 삭제)
    const updateBanner = async (bannerId, bannerDTO = {}, files = [], deleteFiles = []) => {
        const formData = new FormData();

        if (bannerDTO.bannerOrder !== undefined)
            formData.append('bannerOrder', bannerDTO.bannerOrder);
        if (bannerDTO.title)
            formData.append('title', bannerDTO.title);
        if (bannerDTO.linkUrl)
            formData.append('linkUrl', bannerDTO.linkUrl);

        if (deleteFiles && deleteFiles.length > 0) {
            deleteFiles.forEach(id => formData.append('deleteFiles', id));
        }

        if (files && files.length > 0) {
            files.forEach(file => formData.append('files', file));
        }

        await request(`/api/admin/banner/${bannerId}`, {
            method: 'PUT',
            body: formData
        });
    };

    const deleteBanner = async (bannerId) => {
        await request(`/api/admin/banner/${bannerId}`, {
            method: 'DELETE'
        });
    };

    return {getBanners, insertBanner, updateBanner, deleteBanner};
})();
