import request from 'libs/js/request.js'

const setHomePage = data => request.post('setHomePage/v1', data)
const getHomePageList = data => request.post('getHomePageList/v1', data)
const deleteHomePage = data => request.post('deleteHomePage/v1', data)
// const getYiWaiPublic = data => request.post("getYiWaiPublic/v1", data);
// const addPublic = data => request.post("setYiWaiPublic/v1", data);
// const addExhibition = data => request.post("setYiwaiExhibition/v1", data);
// const getYiwaiExhibition = data => request.post("getYiwaiExhibition/v1", data);
// const getReadList = data => request.post("readExpert/v1", data);
// const deletePageRelease = data => request.post("deletePageRelease/v1", data);
// const setReadExpert = data => request.post("setReadExpert/v1",data);

export { getHomePageList, setHomePage, deleteHomePage }
