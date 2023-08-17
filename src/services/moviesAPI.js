import axios from 'axios';

axios.defaults.baseURL = 'https://api.themoviedb.org/3/';
const API_KEY = '8770560c7097e815657709cb3d71f99c';
// export const IMAGE_URL = 'https://image.tmdb.org/t/p/w500';
const TRENDING_PATH = '/trending/movie/day';

export const getTrendingMovies = page => {
  return axios(TRENDING_PATH, {
    params: {
      api_key: API_KEY,
      page,
    },
  });
};
