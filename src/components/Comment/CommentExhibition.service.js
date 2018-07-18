import request from 'libs/js/request.js'

const getExhibitionCommentPage = data =>
  request.post('getExhibitionCommentPage/v1', data)
const addExhibitionComment = data =>
  request.post('addExhibitionComment/v1', data)
const deleteExhibitionComment = data =>
  request.post('deleteExhibitionComment/v1', data)
const setExhibitionCommentLikeNum = data =>
  request.post('setExhibitionCommentLikeNum/v1', data)

export {
  getExhibitionCommentPage,
  addExhibitionComment,
  deleteExhibitionComment,
  setExhibitionCommentLikeNum
}
