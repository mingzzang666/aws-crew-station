bannerService.showList(bannerLayout.list);

const registerBtn = document.querySelector(".add-btn");
const addInput = document.querySelector("#banner-file");

registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    addInput?.click();
});

addInput.addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    bannerService.insert(file);
    e.target.value = "";
});
