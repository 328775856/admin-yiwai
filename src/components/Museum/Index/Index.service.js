import request from 'libs/js/request.js'

const getBwgMuseumList = data => request.post('getBwgMuseumList/v1', data)
const getBwgExhibitionList = data =>
  request.post('getBwgExhibitionList/v1', data)
const getBwgAntiqueList = data => request.post('getBwgAntiqueList/v1', data)

export { getBwgMuseumList, getBwgExhibitionList, getBwgAntiqueList }
