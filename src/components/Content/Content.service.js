import request from 'libs/js/request.js'
const getArticleList = data => request.post('getArticleList/v1', data)
const setArticle = data => request.post('setArticle/v1', data)
const deleteArticle = data => request.post('deleteArticle/v1', data)

const getHomePageStatisticsList = data =>
  request.post('getHomePageStatisticsList/v1', data)
const deleteHomePageChoiceness = data =>
  request.post('deleteHomePageChoiceness/v1', data)
const setHomePageChoiceness = data =>
  request.post('setHomePageChoiceness/v1', data)
const getCommentInfo = data => request.post('getCommentInfo/v1', data)

const setExhibition = data => request.post('setExhibition/v1', data)
const deleteExhibition = data => request.post('deleteExhibition/v1', data)
const getExhibitionList = data => request.post('getExhibitionList/v1', data)

const setExhibits = data => request.post('setExhibits/v1', data)
const findByExhibitionId = data => request.post('findByExhibitionId/v1', data)
const deleteExhibits = data => request.post('deleteExhibits/v1', data)
const getProductStatisticsList = data =>
  request.post('getProductStatisticsList/v1', data)

const batchSetExhibits = data => request.post('batchSetExhibits/v1', data)
export {
  getArticleList,
  setArticle,
  deleteArticle,
  getHomePageStatisticsList,
  deleteHomePageChoiceness,
  setHomePageChoiceness,
  getCommentInfo,
  setExhibition,
  deleteExhibition,
  getExhibitionList,
  setExhibits,
  findByExhibitionId,
  deleteExhibits,
  getProductStatisticsList,
  batchSetExhibits
}
