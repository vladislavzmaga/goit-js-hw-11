const axios = require('axios').default;

export default async function fetchImages(image, page) {
  const fetch = await axios.get(
    `https://pixabay.com/api/?key=29843837-89aa08ca674206f7a0cb82fcb&q=${image}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
  return fetch;
}
