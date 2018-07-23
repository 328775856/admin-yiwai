import request from 'libs/js/request.js'

const getArtistStatisticsList = data =>
  request.post('getArtistStatisticsList/v1', data)
const setArtist = data => request.post('setArtist/v1', data)
const deleteArtist = data => request.post('deleteArtist/v1', data)

const getArticleList = data => request.post('getArticleList/v1', data)
const setProduct = data => request.post('setProduct/v1', data)

//关联文章
const getArtistArticleList = data =>
  request.post('getArtistArticleList/v1', data)
const deleteArtistArticle = data => request.post('deleteArtistArticle/v1', data)
const setArtistArticle = data => request.post('setArtistArticle/v1', data)

//关联商品
const deleteArtistMerchandise = data =>
  request.post('deleteArtistMerchandise/v1', data)
const setArtistMerchandise = data =>
  request.post('setArtistMerchandise/v1', data)
const getArtistMerchandisetList = data =>
  request.post('getArtistMerchandisetList/v1', data)

//关联艺术家

const getArtistArtistList = data => request.post('getArtistArtistList/v1', data)
const setArtistArtist = data => request.post('setArtistArtist/v1', data)
const deleteArtistArtist = data => request.post('deleteArtistArtist/v1', data)

// 机构

const getOrganStatisticsList = data =>
  request.post('getOrganStatisticsList/v1', data)
const deleteOrgan = data => request.post('deleteOrgan/v1', data)

const setOrgan = data => request.post('setOrgan/v1', data)

//机构关联艺术家

const setOrganArtist = data => request.post('setOrganArtist/v1', data)
const deleteOrganArtist = data => request.post('deleteOrganArtist/v1', data)
const getOrganArtistList = data => request.post('getOrganArtistList/v1', data)

//机构关联馆藏

const setOrganProduct = data => request.post('setOrganProduct/v1', data)
const deleteOrganProduct = data => request.post('deleteOrganProduct/v1', data)
const getOrganProductList = data => request.post('getOrganProductList/v1', data)

//关联展览
const getExhibitionList = data => request.post('getExhibitionList/v1', data)
const deleteOrganExhibition = data =>
  request.post('deleteOrganExhibition/v1', data)
const getOrganExhibitionList = data =>
  request.post('getOrganExhibitionList/v1', data)
const setOrganExhibition = data => request.post('setOrganExhibition/v1', data)
const getProductStatisticsList = data =>
  request.post('getProductStatisticsList/v1', data)

//艺术家关联展览

const getArtistExhibitionList = data =>
  request.post('getArtistExhibitionList/v1', data)
const setArtistExhibition = data => request.post('setArtistExhibition/v1', data)
const deleteArtistExhibition = data =>
  request.post('deleteArtistExhibition/v1', data)

//艺术品媒体
const getProductMediaList = data => request.post('getProductMediaList/v1', data)
const setProductMedia = data => request.post('setProductMedia/v1', data)
const deleteProductMedia = data => request.post('deleteProductMedia/v1', data)

export {
  getArtistStatisticsList,
  setArtist,
  deleteArtist,
  setProduct,
  getArtistArticleList,
  getArticleList,
  deleteArtistArticle,
  setArtistArticle,
  deleteArtistMerchandise,
  setArtistMerchandise,
  getArtistMerchandisetList,
  getArtistArtistList,
  deleteArtistArtist,
  setArtistArtist,
  getOrganStatisticsList,
  deleteOrgan,
  setOrgan,
  setOrganArtist,
  deleteOrganArtist,
  getOrganArtistList,
  getOrganProductList,
  deleteOrganProduct,
  setOrganProduct,
  getExhibitionList,
  getProductStatisticsList,
  getOrganExhibitionList,
  deleteOrganExhibition,
  setOrganExhibition,
  getArtistExhibitionList,
  deleteArtistExhibition,
  setArtistExhibition,
  getProductMediaList,
  setProductMedia,
  deleteProductMedia
}
