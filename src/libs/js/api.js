import request from './request.js';
/* 公用接口 */
const getProductStatisticsList = data => request.post('getProductStatisticsList/v1', data);//获取艺术品列表
const getProductTypeList = data => request.post('getProductTypeList/v1', data);//获取作品类型
const getDictionaryList = data => request.post('getDictionaryList/v1', data);//获取数据字典

export { getProductTypeList, getProductStatisticsList, getDictionaryList};

