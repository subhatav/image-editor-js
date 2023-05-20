const imageInput = document.querySelector(".file-input");

const filterOptions = document.querySelectorAll(".filter button");
const filterName = document.querySelector(".filter-info .name");
const filterValue = document.querySelector(".filter-info .value");
const filterSlider = document.querySelector(".slider input");

const rotateOptions = document.querySelectorAll(".rotate button");
const previewImage = document.querySelector(".preview-img img");

const resetButton = document.querySelector(".reset-filter");
const pickButton = document.querySelector(".choose-img");
const storeButton = document.querySelector(".save-img");

let inversion = "0", grayscale = "0";
let brightness = "100", saturation = "100";

let rotation = 0;
let flipHorizontal = 1, flipVertical = 1;

const loadImage = () => {

  let file = imageInput.files[0];

  if (!file) return;

  previewImage.src = URL.createObjectURL(file);

  previewImage.addEventListener("load", () => {

    resetButton.click();

    document.querySelector(".container").classList.toggle("disable");

    document.querySelector(".preview-img").classList.toggle("placeholder");
    document.querySelector(".preview-img").classList.toggle("uploaded");
  });
}

const applyFilter = () => {

  previewImage.style.transform = `rotate(${rotation}deg) scale(${flipHorizontal}, ${flipVertical})`;

  previewImage.style.filter = `brightness(${brightness}%) saturate(${saturation}%) 
                               invert(${inversion}%) grayscale(${grayscale}%)`;
}

filterOptions.forEach(option => {

  option.addEventListener("click", () => {

    document.querySelector(".active").classList.remove("active");

    option.classList.add("active");

    filterName.innerText = option.innerText;

    if (option.id === "brightness") {

      filterSlider.max = "200";
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;

    } else if (option.id === "saturation") {

      filterSlider.max = "200";
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`

    } else if (option.id === "inversion") {

      filterSlider.max = "100";
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;

    } else {

      filterSlider.max = "100";
      filterSlider.value = grayscale;
      filterValue.innerText = `${grayscale}%`;
    }
  });
});

const updateFilter = () => {

  filterValue.innerText = `${filterSlider.value}%`;

  const selectedFilter = document.querySelector(".filter .active");

  switch (selectedFilter.id) {

    case "brightness": brightness = filterSlider.value; break;
    case "saturation": saturation = filterSlider.value; break;

    case "inversion": inversion = filterSlider.value; break;
    case "grayscale": grayscale = filterSlider.value; break;
  }

  applyFilter();
}

rotateOptions.forEach(option => {

  option.addEventListener("click", () => {

    switch (option.id) {

      case "left": rotation -= 90; break;
      case "right": rotation += 90; break;

      case "horizontal": flipHorizontal = (flipHorizontal === 1) ? -1 : 1; break;
      case "vertical": flipVertical = (flipVertical === 1) ? -1 : 1; break;
    }

    applyFilter();
  });
});

const resetFilters = () => {

  inversion = "0"; grayscale = "0";
  brightness = "100"; saturation = "100";

  rotation = 0;
  flipHorizontal = 1; flipVertical = 1;

  filterOptions[0].click();

  applyFilter();
}

const saveImage = () => {

  const editorCanvas = document.createElement("canvas");
  const editorContext = editorCanvas.getContext("2d");

  editorCanvas.width = previewImage.naturalWidth;
  editorCanvas.height = previewImage.naturalHeight;

  editorContext.filter = `brightness(${brightness}%) saturate(${saturation}%)
                          invert(${inversion}%) grayscale(${grayscale}%)`;

  editorContext.translate(editorCanvas.width / 2, editorCanvas.height / 2);

  if (rotation !== 0) editorContext.rotate(rotation * Math.PI / 180);

  editorContext.scale(flipHorizontal, flipVertical);

  editorContext.drawImage(previewImage, -editorCanvas.width / 2, -editorCanvas.height / 2,
                                         editorCanvas.width, editorCanvas.height);

  // Create an `a` Element Link for downloading the Image
  const link = document.createElement("a");

  console.log("Link = " + link);

  // Pass the Canvas Data URL to the `href` value of the `<a>` element
  link.href = editorCanvas.toDataURL();
  link.download = `${Date.now()}.jpg`;

  link.click(); // Click the Link created to start the download
}

filterSlider.addEventListener("input", updateFilter);
resetButton.addEventListener("click", resetFilters);

imageInput.addEventListener("change", loadImage);
storeButton.addEventListener("click", saveImage);

pickButton.addEventListener("click", () => imageInput.click());