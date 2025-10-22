const bannerService = (() => {
    const showList = async (callback) => {
        const response = await fetch("/api/admin/banner");
        const data = await response.json();

        const urls = data.map(item => {
            if (typeof item === 'string') return item;
            return item.url || item.presignedUrl || item.path || '';
        });
        console.log(`urls = ${urls}`);
        if (callback) {
            callback(urls);
        }
    }

    const insert = async (file) => {
        const formData = new FormData();
        formData.append("files", file );

        const response = await fetch("/api/admin/banner", {
            method : 'POST',
            body : formData,

        });

        if (response.ok) {
            console.log("업로드 성공");
        }

    }


    return {showList: showList, insert: insert}

})();

