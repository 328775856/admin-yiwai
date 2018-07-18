import request from 'libs/js/request.js';

const getResourceList = data => request.post('getResourceInfoPage/v1', data);
const setResourceInfo = data => request.post('setResourceInfo/v1', data);
const deleteResourceInfo = data => request.post('deleteResourceInfo/v1', data);

export {getResourceList, setResourceInfo, deleteResourceInfo};


