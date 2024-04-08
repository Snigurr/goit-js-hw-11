import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


function preloadImages(images) {
  return new Promise((resolve, reject) => {
    const imagePromises = images.map(image => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.largeImageURL;
      });
    });

    Promise.all(imagePromises)
      .then(resolve)
      .catch(reject);
  });
}

export async function renderImages(images) {
  try {
    showLoader();
    await clearImages();
    await preloadImages(images); 
    const list = document.querySelector("ul");
    if (!list) {
      throw new Error("List element not found");
    }
    const limitedImages = images.slice(0, 9); 
    list.insertAdjacentHTML("beforeend", createMarkup(limitedImages));
    const lightbox = new SimpleLightbox("ul a", {
        captionsData: "alt",
        captionDelay: 250,
    });
    hideLoader(); 
  } catch (error) {
    console.error("Error while preloading images:", error);
    hideLoader(); 
  }
}

async function clearImages() {
  const list = document.querySelector("ul");
  if (list) {
    list.innerHTML = "";
  }
}

function createMarkup(arr) {
    return arr
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <li>
    <a href="${largeImageURL}" alt="${tags}">
        <img src="${webformatURL}" alt="${tags}" width="360"  />
       <p class="image-info" >
    <span>Likes<br> ${likes}</span>
    <span>Views<br> ${views}</span>
    <span>Comments<br> ${comments}</span>
    <span>Downloads<br> ${downloads}</span>
         </p>
     </a>
       </li>
        `)
        .join("");
}

function showLoader() {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "block";
  }
}

function hideLoader() {
  const loader = document.querySelector(".loader");
  if (loader) {
    loader.style.display = "none";
  }
}
