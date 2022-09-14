import './css/common.css';
import Notiflix from 'notiflix';
import fetchImages from './fetch-images';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const containerEL = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const toStartBtn = document.querySelector('.to-start');

let page = 1;
let searchEl = '';

loadMoreBtn.disabled = false;

searchFormEl.addEventListener('submit', checkResult);
loadMoreBtn.addEventListener('click', loadMore);

function checkResult(evt) {
  evt.preventDefault();
  searchEl = evt.currentTarget.elements.searchQuery.value;
  if (searchEl === '') {
    Notiflix.Report.failure('ERROR', 'Enter what you want to find.', 'close');
    return;
  }

  fetchImages(searchEl, (page = 1)).then(response => {
    const result = response.data;
    if (result.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      containerEL.innerHTML = '';
      renderMarckup(result.hits);
      Notiflix.Notify.success(`Hooray! We found ${result.totalHits} images.`);
      loadMoreBtn.classList.remove('hiden');
      toStartBtn.classList.remove('hiden');
      loadMoreBtn.disabled = false;
    }
  });
}

function renderMarckup(images) {
  const marckup = images
    .map(
      image => `<a class = "simplelightbox" href = "${image.largeImageURL}">
      <div class="photo-card">
  <img src="${image.webformatURL}" alt="${image.tags}" width = "100%" height = "250px" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes <br/> ${image.likes}</b>
    </p>
    <p class="info-item">
      <b>Views <br/> ${image.views}</b>
    </p>
    <p class="info-item">
      <b>Comments <br/> ${image.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads <br/> ${image.downloads}</b>
    </p>
  </div>
</div>
<a/>`
    )
    .join('');
  containerEL.insertAdjacentHTML('beforeend', marckup);
  simpleLightBox();
}

function loadMore(evt) {
  evt.preventDefault();
  page += 1;
  fetchImages(searchEl, page).then(response => {
    const result = response.data;
    const galeryArrEl = containerEL.childNodes.length / 2 + 40;
    if (galeryArrEl > result.totalHits) {
      Notiflix.Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.disabled = true;
    }
    renderMarckup(result.hits);
  });
}

function simpleLightBox() {
  new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
  });
}
