const CATS_IMAGES_LIMIT = 10;

export const CATS_FETCH_URL = `https://api.thecatapi.com/v1/images/search?limit=${CATS_IMAGES_LIMIT}`;

export const ROUTES = {
  root: '/',
  button: '/button',
};

export const WINDOW_MESSAGES = {
  loading: 'loading',
  loadingFinished: 'loadingFinished',
  error: 'error',
  noError: 'noError',
  nextImage: 'nextImage',
};
