import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '34527642-ac518720cead8e0413be90d5a';

export default class GetImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async bringImages() {
    const URL = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
    const responce = await axios.get(URL);
    return responce.data.hits;
  };
  
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}