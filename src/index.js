import './css/styles.css';
import GetImages from './js/api.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);
// refs.galleryRef.addEventListener('click', createImagesCardsMarkup);

const getImagesFromApi = new GetImages();

refs.loadMoreBtn.style.display = 'none';

async function onSearch(e) {

  e.preventDefault();

  getImagesFromApi.query = e.currentTarget.elements.searchQuery.value.trim();
  getImagesFromApi.resetPage();

  try {
    const imagesSet = await getImagesFromApi.bringImages();
    if (imagesSet.length === 0) {
      clearGallery();
      refs.loadMoreBtn.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else if (getImagesFromApi.query === '') {
      clearGallery();
      refs.loadMoreBtn.style.display = 'none';
      return;
    }

    clearGallery();
    renderContent(imagesSet);
    
    getImagesFromApi.incrementPage();

    if (imagesSet.length < 40) {
      refs.loadMoreBtn.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    }  else {
      refs.loadMoreBtn.style.display = 'block';
    }
  }
  catch (error) {
    Notify.failure('Sorry, an error occurred');
  }
}

async function onLoadMoreBtnClick(event) {
  try {
    const nextImagesSet = await getImagesFromApi.bringImages();
    renderContent(nextImagesSet);

    getImagesFromApi.incrementPage();
  } catch (error) {
    console.log(error);
  }
}

function createCard(item) {
  return `<div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" height="200"/>
  <div class="info">
    <p class="info-item">   
      <b>Likes </b>${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${item.downloads}
    </p>
  </div>
</div>`;
}

// function createImagesCardsMarkup(galleryItems) {
//     return galleryItems.map(({ webformatURL, largeImageURL, tags }) => {
//         return ` 
//         <a class="gallery__item" href="${largeImageURL}">
//           <img class="gallery__image" src="${webformatURL}" alt="${tags}" />
//         </a>
//         `;
//     }).join('');

//     return markup

// }



function createGallery(array) {
  return array.reduce((acc, item) => {
    return acc + createCard(item);
  }, '');
}

function renderContent(array) {
  const result = createGallery(array);
  refs.galleryRef.insertAdjacentHTML('beforeend', result);
}

function clearGallery() {
  refs.galleryRef.innerHTML = '';
}
