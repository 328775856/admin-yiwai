import request from 'libs/js/request.js';

const getCommentList = data => request.post('getCommentPage/v1', data);
const getReplyList = data => request.post('getReplyList/v1', data);
const addComment = data => request.post('addComment/v1', data);
const addReply = data => request.post('addReply/v1', data);
const deleteComment = data => request.post('deleteComment/v1', data);
const deleteReply = data => request.post('deleteReply/v1', data);
const setCommentLikeNum = data => request.post('setCommentLikeNum/v1', data);
const setCommentHot = data => request.post('setCommentHot/v1', data);

export { getCommentList,getReplyList,addComment,addReply,deleteComment,deleteReply,setCommentLikeNum,setCommentHot};
