import request from "libs/js/request.js";

const setBanner = data => request.post("setBanner/v1", data);
const getBannerList = data => request.post("getBannerList/v1", data);
const deleteBanner = data => request.post("deleteBanner/v1", data);
const getYiWaiPublic = data => request.post("getYiWaiPublic/v1", data);
const addPublic = data => request.post("setYiWaiPublic/v1", data);
const addExhibition = data => request.post("setYiwaiExhibition/v1", data);
const getYiwaiExhibition = data => request.post("getYiwaiExhibition/v1", data);
const getReadList = data => request.post("readExpert/v1", data);
const deletePageRelease = data => request.post("deletePageRelease/v1", data);
const setReadExpert = data => request.post("setReadExpert/v1",data);

export {
  getBannerList,
  setBanner,
  deleteBanner,
  addPublic,
  addExhibition,
  deletePageRelease,
  getReadList,
  getYiWaiPublic,
  setReadExpert,
  getYiwaiExhibition
};
