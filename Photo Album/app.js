let images = document.querySelectorAll(".img-gallery img");
let wrapper = document.getElementById("wrapper");
let imgWrapper = document.getElementById("fullImg");
let close = document.querySelector(".imageWrapper span");


// Calculate and set dynamic row spans
images.forEach((img, index) => {
  img.onload = () => {
    const height = img.naturalHeight;
    const width = img.naturalWidth;
    const rowSpan = Math.ceil((height / width) * 10); // Adjust rows dynamically
    img.style.setProperty("--row-span", rowSpan);
  };

  img.addEventListener("click", () => {
    openModal(`images/Img${index + 1}.jpg`);
  });
});

close.addEventListener("click", () => (wrapper.style.display = "none"));

function openModal(pic) {
  wrapper.style.display = "flex";
  imgWrapper.src = pic;
}
