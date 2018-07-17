import request from 'libs/js/request.js';

const getMaterialList = data => request.post('getMaterialList/v1', data);
const setMaterial = data => request.post('setMaterial/v1', data);
const deleteMaterial = data => request.post('deleteMaterial/v1', data);

export {getMaterialList, setMaterial, deleteMaterial};


