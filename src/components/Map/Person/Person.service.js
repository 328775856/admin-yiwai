import request from 'libs/js/request.js';

const getArtistProductList = data => request.post('getArtistProductList/v1', data);
const setArtistProduct = data => request.post('setArtistProduct/v1', data);
const deleteArtistProduct = data => request.post('deleteArtistProduct/v1', data);
const getRepProductList = data => request.post('getRepProductList/v1',data);

export {getArtistProductList, setArtistProduct, deleteArtistProduct,getRepProductList};
