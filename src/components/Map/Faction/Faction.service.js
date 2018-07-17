import request from 'libs/js/request.js';

const getMapPaintingFactionList = data => request.post('getMapPaintingFactionList/v1', data);
const setFaction = data => request.post('setMapPaintingFaction/v1', data);
const deleteMapPaintingFaction = data => request.post('deleteMapPaintingFaction/v1', data);

// 画派代表人物
const setMapFactionArtist = data => request.post('setMapFactionArtist/v1', data);
const getMapFactionArtistList = data => request.post('getMapFactionArtistList/v1', data);
const deleteMapFactionArtist = data => request.post('deleteMapFactionArtist/v1', data);
const getArtistList = data => request.post('getArtistList/v1', data);

// 画派代表作品
const setMapFactionProduct = data => request.post('setMapFactionProduct/v1', data);
const getMapFactionProductList = data => request.post('getMapFactionProductList/v1', data);
const deleteMapFactionProduct = data => request.post('deleteMapFactionProduct/v1', data);
const getRepProductList = data => request.post('getRepProductList/v1', data);

export {
  getMapPaintingFactionList,
  setFaction,
  deleteMapPaintingFaction,

  setMapFactionArtist,
  getMapFactionArtistList,
  deleteMapFactionArtist,
  getArtistList,

  setMapFactionProduct,
  getMapFactionProductList,
  deleteMapFactionProduct,
  getRepProductList
};
