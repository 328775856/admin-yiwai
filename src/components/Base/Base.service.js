import request from 'libs/js/request.js';

const getArtistStatisticsList = data => request.post('getArtistStatisticsList/v1', data);
const setArtist = data => request.post('setArtist/v1', data);
const deleteArtist = data => request.post('deleteArtist/v1', data);

const getArticleList = data => request.post('getArticleList/v1', data);
const setProduct = data => request.post('setProduct/v1', data);

//关联文章
const getArtistArticleList = data => request.post('getArtistArticleList/v1',data);
const deleteArtistArticle = data => request.post('deleteArtistArticle/v1',data);
const setArtistArticle = data => request.post('setArtistArticle/v1',data);

//关联商品
const deleteArtistMerchandise = data => request.post('deleteArtistMerchandise/v1',data);
const setArtistMerchandise = data => request.post('setArtistMerchandise/v1',data);
const getArtistMerchandisetList = data => request.post('getArtistMerchandisetList/v1',data);

//关联艺术家
const getArtistArtistList = data => request.post("getArtistArtistList/v1",data);
const setArtistArtist = data => request.post("setArtistArtist/v1",data);
const deleteArtistArtist = data => request.post("deleteArtistArtist/v1",data);

//艺术品媒体
const getProductMediaList = data => request.post("getProductMediaList/v1",data);
const setProductMedia = data => request.post("setProductMedia/v1",data);
const deleteProductMedia = data => request.post("deleteProductMedia/v1",data);

export {
  getArtistStatisticsList, setArtist, deleteArtist,
  setProduct,getArtistArticleList,getArticleList,
  deleteArtistArticle,setArtistArticle,deleteArtistMerchandise,setArtistMerchandise,getArtistMerchandisetList,
  getArtistArtistList,
  deleteArtistArtist,
  setArtistArtist,
  getProductMediaList,
  setProductMedia,
  deleteProductMedia
 };
