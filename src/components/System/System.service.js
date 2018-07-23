import request from 'libs/js/request.js';

const setDictionary = data => request.post('setDictionary/v1', data);
const setProductType = data => request.post('setProductType/v1', data);

const getUserList = data => request.post('getUserList/v1', data);
const setUser = data => request.post('setUser/v1', data);
const deleteUser = data => request.post('deleteUser/v1', data);
const deleteProductType = data => request.post('deleteProductType/v1', data);


export { setDictionary, setProductType, getUserList, setUser, deleteUser, deleteProductType };
