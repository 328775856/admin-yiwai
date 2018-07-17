import request from 'libs/js/request.js';

const getMapCityList = data => request.post('getMapCityList/v1', data);
const setCity = data => request.post('setMapCity/v1', data);
const deleteMapCity = data => request.post('deleteMapCity/v1', data);


// 城市代表画派
const getMapPaintingFactionList = data => request.post('getMapPaintingFactionList/v1', data);
const getMapCityFactionList = data => request.post('getMapCityFactionList/v1', data);
const setMapCityFaction = data => request.post('setMapCityFaction/v1', data);
const deleteMapCityFaction = data => request.post('deleteMapCityFaction/v1', data);


// 城市代表人物
const setMapCityArtist = data => request.post('setMapCityArtist/v1', data);
const getMapCityArtistList = data => request.post('getMapCityArtistList/v1', data);
const deleteMapCityArtist = data => request.post('deleteMapCityArtist/v1', data);
const getArtistList = data => request.post('getArtistList/v1', data);

const getMaterialList = data => request.post('getMaterialList/v1', data);
const deleteMaterial = data => request.post('deleteMaterial/v1', data);
const getCustomerList = data => request.post('getCustomerStatisticsList/v1', data);


export {
  getMapCityList,
  setCity,
  deleteMapCity,

  getMapPaintingFactionList,
  getMapCityFactionList,
  setMapCityFaction,
  deleteMapCityFaction,

  getArtistList,
  getMapCityArtistList,
  setMapCityArtist,
  deleteMapCityArtist,


  getMaterialList,
  deleteMaterial,
  getCustomerList
};
