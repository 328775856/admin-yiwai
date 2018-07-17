import request from 'libs/js/request.js';

const getCustomerList = data => request.post('getCustomerStatisticsList/v1', data);
const getCustomerInfo = data => request.post('getCustomerInfo/v1', data);
const setCustomer = data => request.post('setCustomer/v1', data);
const setVip = data => request.post('setVip/v1', data);
const deleteCustomer = data => request.post('deleteCustomer/v1', data);

export {getCustomerList, getCustomerInfo, setCustomer, setVip, deleteCustomer};


