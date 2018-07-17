import request from 'libs/js/request.js';

const login = data => request.post('login/v1', data);

export {login};

