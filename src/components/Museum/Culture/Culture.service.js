import request from 'libs/js/request.js';

const getAntiqueStatisticsList = data => request.post('getAntiqueStatisticsList/v1', data);
const setHometownAntique = data => request.post('setHometownAntique/v1', data);
const deleteHometownAntique = data => request.post('deleteHometownAntique/v1', data);
const setAntiqueAntique = data => request.post('setAntiqueAntique/v1', data);  //新增文物相关
const deleteAntiqueAntique = data => request.post('deleteAntiqueAntique/v1', data);  //取消文物相关
const getAntiqueAntiqueList = data => request.post('getAntiqueAntiqueList/v1', data);  //获取文物相关相关列表
const setAntiqueLikeNum = data => request.post('setAntiqueLikeNum/v1', data);  //设置文物点赞数
const setAntiqueVoteNum = data => request.post('setAntiqueVoteNum/v1', data);  //设置文物点赞数
const getAntiqueList = data => request.post('getAntiqueList/v1',data);
export {
  setHometownAntique,
  getAntiqueStatisticsList,
  deleteHometownAntique,
  setAntiqueAntique,
  getAntiqueAntiqueList,
  deleteAntiqueAntique,
  setAntiqueLikeNum,
  setAntiqueVoteNum,
  getAntiqueList
};


