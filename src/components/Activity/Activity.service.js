import request from 'libs/js/request.js'

const setPeachNum = data => request.post('setPeachNum/v1', data)
const addYouthProduct = data => request.post('addYouthProduct/v1', data)
const getYouthProductList = data => request.post('getYouthProductList/v1', data)
const deleteYouthProduct = data => request.post('deleteYouthProduct/v1', data)
const batchSetResourceInfo = data =>
  request.post('batchSetResourceInfo/v1', data)

const getResourceInfoPage = data => request.post('getResourceInfoPage/v1', data)

export {
  setPeachNum,
  addYouthProduct,
  getYouthProductList,
  deleteYouthProduct,
  batchSetResourceInfo,
  getResourceInfoPage
}
