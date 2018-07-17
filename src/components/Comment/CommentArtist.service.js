import request from 'libs/js/request.js';

const getArtistCommentList = data => request.post('getArtistCommentPage/v1', data);
const getArtistReplyList = data => request.post('getArtistReplyList/v1', data);
const addArtistComment = data => request.post('addArtistComment/v1', data);
const addArtistReply = data => request.post('addArtistReply/v1', data);
const deleteArtistComment = data => request.post('deleteArtistComment/v1', data);
const deleteArtistReply = data => request.post('deleteArtistReply/v1', data);
const setArtistCommentLikeNum = data => request.post('setArtistCommentLikeNum/v1', data);
const setArtistCommentHot = data => request.post('setArtistCommentHot/v1', data);

export { getArtistCommentList,getArtistReplyList,addArtistComment,addArtistReply,deleteArtistComment,deleteArtistReply,setArtistCommentLikeNum,setArtistCommentHot};
