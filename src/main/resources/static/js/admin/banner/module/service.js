const bannerService = (() => {
    const showList = async (callback) => {
        const response = await fetch("/api/admin/banner");
        const urls = await response.json();
        console.log(`urls = ${urls}`);
        if (callback) {
            callback(urls);
        }
    }

    const insert = async (callback) => {
        const urls = null;
        const response = await fetch("/api/admin/banner", {
            method : 'POST',
            body : JSON.stringify(insert),
            headers: {
                'Content-Type' : 'application/json'
            }

        });
        if (callback) {
            callback(urls);
        }

    }


    return {showList: showList, insert: insert}

})();

