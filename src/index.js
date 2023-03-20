import './css/styles.css';

import Notiflix, { Notify } from 'notiflix';
// import SimpleLightbox from "simplelightbox";
// import "simplelightbox/dist/simple-lightbox.min.css";

import GetImages from './js/api';

const refs = {
  searchForm: document.querySelector('search-form'),
  galleryRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreButtonClick);

const getImagesOnSubmit = new GetImages();

async function onSearch(event) {
  event.preventDefault();
  getImages.query = event.currentTarget.elements.searchQuery.value.trim();
  getImages.resetPage();
  try {
    const imagesSet = await getImages.passImages();
    if (imagesSet.length === 0) {
      clearGallery();
      refs.loadMoreBtn.style.display = 'none';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    clearGallery();
    renderContent(imagesSet);
    
    getImages.incrementPage();

    if (imagesSet.length < 40) {
      refs.loadMoreBtn.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
      return;
    } else {
      refs.loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    Notify.failure('Sorry, an error occurred');
  }
}

async function onLoadMoreBtnClick(event) {
  try {
    const nextImagesSet = await getImages.bringImages();
    renderContent(nextImagesSet);

    getImages.incrementPage();
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
