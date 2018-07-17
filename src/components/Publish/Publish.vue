<template>
  <div id="page">
    <Breadcrumb separator=">" class="breadCrumb">
      <BreadcrumbItem>首页</BreadcrumbItem>
      <BreadcrumbItem>页面发布</BreadcrumbItem>
      <BreadcrumbItem>小程序首页</BreadcrumbItem>
    </Breadcrumb>
    <Tabs type="card" @on-click="getName" class="tab">
      <!-- tab-1 开始 -->
      <TabPane :label="labelList[0]">
        <div class="table">
          <Row type="flex" justify="space-between" align="middle">
            <Col span="4"><h1>Banner</h1></Col>
            <Col span="3" style="text-align:right"><Button type="primary" icon="plus" class="add" @click="showModal">添加</Button></Col>
          </Row>
          <Table :columns="bannerColumns" :loading="tableBannerLoading" :data="bannerList" border></Table>
        </div>
        <div class="table">
            <div class="flex">
                <div class="flex-item"><h1>解读达人</h1></div>
                <div>
                <Form :label-width="80" inline>
                <Form-item prop="newCustomerId" label="用户编号:">
                 <Input v-model="newCustomerId"  :maxlength="15" placeholder="用户编号"></Input>
                </Form-item>
                <Form-item label="排序值:">
                  <Select v-model="newCustomerNo" placeholder="选择排序值">
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                    <Option value="3">3</Option>
                  </Select>
                </Form-item>
                <Form-item>
                   <Button type="primary" icon="plus"  @click="addExpert(newCustomerId,newCustomerNo,true)"  v-bind:disabled="!expertBtnIsActive">添加</Button>
                </Form-item>
              </Form>
              </div>
            </div>

          <Table :columns="readExpertColumns" :loading="tableExpertLoading" :data="readList" border></Table>
        </div>

        <div class="table">
            <div class="flex">
              <div class="flex-item"><h1>推荐展览</h1></div>
              <div>
                 <Form :label-width="80" inline>
                  <Form-item prop="newexhibitionId" label="展览编号:">
                  <Input v-model="newexhibitionId" :maxlength="15" placeholder="展览编号"></Input>
                  </Form-item>
                  <Form-item label="排序值:">
                    <InputNumber :min="0"  v-model="exhibitionSortNo" placeholder="排序值" style="width: 100px;"></InputNumber>
                  </Form-item>
                  <Form-item>
                      <Button type="primary" icon="plus"  @click="addExhibition(newexhibitionId,exhibitionSortNo)"  v-bind:disabled="!exhibitionBtnIsActive">添加</Button>
                  </Form-item>
                  </Form>
              </div>
            </div>

          <Table :columns="exhibitionColumns" :loading="tableExhibitionLoading" :data="ExhibitionList" border></Table>
        </div>

        <div class="table">
          <div class="flex">
            <div class="flex-item"><h1>独家发布</h1></div>
            <div >
              <Form :label-width="80" inline>
                <Form-item prop="newpublicId" label="卡片编号:">
                 <Input v-model="newpublicId" :maxlength="15" placeholder="卡片编号"></Input>
                </Form-item>
                <Form-item label="排序值:">
                  <Select v-model="publicSortNo"  placeholder="选择排序值">
                   <Option v-for="option in options" v-bind:value="option.value" :key="option.id">
                  {{option.text}}
                </Option>
                </Select>
                </Form-item>
                <Form-item>
                  <Button type="primary" icon="plus"  @click="addPublic(newpublicId,publicSortNo,true)"  v-bind:disabled="!publicBtnIsActive">添加</Button>
                </Form-item>
              </Form>
            </div>
          </div>
          <Table  :columns="publishColumns" :loading="tablePublicLoading" :data="publicList" border></Table>
        </div>

      </TabPane>
    </Tabs>

    <Modal
        v-model="bannerModal"
        :loading="loading"
        >
        <p slot="header" style="text-align:center;"><span>添加banner</span></p>
        <p slot="close"><Icon type="ios-close-empty"></Icon></p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
          <Form-item label="banner图片:" prop="image">
                <EyUpload @upload-ok="getLitImgUrl" @upload-error="uploadError"  @upload-exceeded-size="uploadExceededSize" imgSizeText="图片规格：高400px,宽325px，不超过200K" :maxSize="200"  accept="image/gif,image/jpeg,image/jpg,image/png"/>
                <p v-show="isLitUploadOk">
                    <span class="headImg" v-show="formValidate.image">
                        <Icon type="close-circled" size="18" class="closeIcon" @click.native="resetImg"></Icon>
                        <img :src="formValidate.image+'?imageView2/1/w/135/h/165/q/50'"  class="img">
                    </span>
                </p>
                <!-- <div style="color:#ed3f14;padding-top:6px; line-height:1;position:absolute;top:100%;left:0;" v-show="!formValidate.image">图片不能为空</div> -->
          </Form-item>
        <Form-item label="链接地址:" prop="linkUrl">
            <Input v-model.trim="formValidate.linkUrl"  placeholder="输入banner链接地址"></Input>
        </Form-item>

        <Form-item label="排序值:" prop="sortNo">
            <Select v-model="formValidate.sortNo" v-bind:placeholder="sortPlaceholder">
                <Option v-for="(option,index) in options" v-bind:value="option.value" :key="index">
                  {{option.text}}
                </Option>
            </Select>
        </Form-item>
          <Form-item label="备注:" prop="remark">
            <Input v-model="formValidate.remark" :maxlength="30" placeholder="输入备注"></Input>
        </Form-item>
        </Form>

        <div  slot="footer">
          <Button type="text" @click="()=>this.bannerModal=false">取消</Button>
          <Button type="primary" @click="validateForm">确定</Button>
        </div>
    </Modal>
    <!-- tab-1 结束 -->
  </div>
</template>

<script>
import util from 'libs/js/util.js';
import EyUpload from '../Common/EyUpload/EyUpload';
import {
	getBannerList,
	setBanner,
	deleteBanner,
	addPublic,
	addExhibition,
	getReadList,
	deletePageRelease,
	getYiWaiPublic,
	setReadExpert,
	getYiwaiExhibition
} from "./Publish.service";
import {
	Breadcrumb,
	BreadcrumbItem,
	Tabs,
	TabPane,
	Button,
	Input,
	Row,
	Col,
  Modal,
	Form,
	Option,
	FormItem,
	Select,
	Icon,
  Table,
  InputNumber
} from "iview";
import expandRow from "./tableExpand";

export default {
	name: "Publish",
	components: {
		Breadcrumb,
		BreadcrumbItem,
		Tabs,
		TabPane,
		Button,
		Input,
		Row,
		Col,
		Icon,
		Select,
		Form,
		FormItem,
		Modal,
		Table,
		Option,
		EyUpload,
    expandRow,
    InputNumber
	},
	data() {
		let _this = this;
		return {
			labelList: ["小程序首页"],
			bannerList: [],
      sortPlaceholder:"请选择排序值",
			publicList: [],
			readList: [],
			ExhibitionList: [],
			newpublicId: "",
			publicSortNo: "",
			isLitUploadOk: false,
			newexhibitionId: "",
			exhibitionSortNo: 0,
			newCustomerId: "",
      newCustomerNo: "",
      options:[
          { text: '1', value: '1' },
          { text: '2', value: '2' },
          { text: '3', value: '3' },
          { text: '4', value: '4' },
          { text: '5', value: '5' }
      ],
			formValidate: {
				id: 0,
				image: "",
				linkUrl: "",
				sortNo: '',
				remark: ""
			},
			ruleValidate: {
				image: [{ required: true, message: "图片不能为空", trigger: "blur" }],
				linkUrl: [
					{ required: false, message: "banner链接地址不能为空", trigger: "blur" }
				],
				sortNo: [
					{ required: true, message: "排序不能为空", trigger: "change" }
				],
				remark: [{ required: true, message: "备注不能为空", trigger: "blur" }]
			},
			bannerModal: false,
			loading: true,
      tableBannerLoading:true,
      tablePublicLoading:true,
      tableExhibitionLoading:true,
      tableExpertLoading:true,
			bannerColumns: [
				{
					title: "链接地址",
					align: "center",
          render(h,params){
            const {linkUrl} = params.row;
            return(
              <p class="ellipsisLn">{linkUrl}</p>
            )
          }
				},
				{
					title: "图片",
					align: "center",
					key: "image",
					render(h, params) {
						const imageUrl = params.row.image;
						return (
							<div
								class="headImg"
								style={`background:url(${imageUrl}) no-repeat center;background-size: contain;`}
							/>
						);
					}
				},
				{
					title: "备注",
					key: "remark",
					align: "center"
				},
				{
					title: "排序",
					width: 100,
					key: "sortNo",
					align: "center"
				},
				{
					title: "发布时间",
					key: "gmtCreate",
					align: "center"
				},
				{
					title: "操作",
					key: "action",
					align: "center",
					render(h, params) {
						const data = params.row;
						return (
							<div>
								<span onClick={() => _this.editBanner(data)} class="edit">
									编辑
								</span>
								<span class="edit" onClick={() => _this.deleteBannerModal(data.id)}>
									删除
								</span>
							</div>
						);
					}
				}
			],
			publishColumns: [
        {
          title:"卡片编号",
          key:"cardId",
          align:"center"
        },
				{
					title: "标题",
					key: "productDto",
					align: "center",
					render(h, params) {
						let { itemType } = params.row;
						let tempTitle;
						if (itemType == 1) {
							tempTitle =
								params.row.productDto.proQuestion !== undefined
									? params.row.productDto.proQuestion
									: params.row.productDto.name;
						} else if (itemType == 2) {
							tempTitle = params.row.commentDto.content;
						} else if (itemType == 3) {
							tempTitle = params.row.goodsRecommendDto.title;
						}
						return <p class="ellipsisLn">{tempTitle}</p>;
					}
				},
				{
					title: "关联作品",
					key: "productDto",
					align: "center",
					render(h, params) {
						let { itemType } = params.row;
						let linkPro;
						if (itemType == 1) {
							linkPro = params.row.productDto.name;
						} else if (itemType == 2) {
							linkPro = params.row.productDto.name;
						} else if (itemType == 3) {
							linkPro = '--';
						}

						return <p>{linkPro}</p>;
					}
				},
				{
					title: "排序",
					key: "sortNo",
					align: "center",
					render(h, params) {
						let { cardId, sortNo } = params.row;
						let oldValue = parseInt(sortNo);
						return (
							<div>
								<input
									class="input"
									min="1"
                  type="number"
									value={sortNo}
									onInput={e => {
                    sortNo = parseInt(e.target.value);
                  }}
                  onKeydown={e=>{
                    if(e.keyCode == "13" && oldValue !=sortNo){
                      _this.addPublic(cardId, sortNo,false);
                    }
                  }}
								/>
							</div>
						);
					}
				},
				{
					title: "发布时间",
					key: "gmtCreate",
					align: "center"
				},
				{
					title: "链接地址",
					key: "action",
					align: "center",
					render(h, params) {
						let copyData, publicId;
						publicId = parseInt(params.row.id);
						let { itemType } = params.row;
						if (itemType == 1) {
							copyData = "pages/Picture/Detail?id=" + params.row.productDto.id;
						} else if (itemType == 2) {
							copyData =
								"pages/reply/reply?id=" + params.row.commentDto.id;
						} else if (itemType == 3) {
							copyData = params.row.goodsRecommendDto.linkUrl;
						}
						return (
							<div>
								<a
									href="javascript:void(0)"
									class="edit"
									v-clipboard={copyData}
									onSuccess={e => _this.$Message.success("复制成功")}
								>
									复制链接
								</a>
								<span class="edit" onClick={() => _this.deleteOK(publicId, 1)}>
									删除
								</span>
							</div>
						);
					}
				}
			],
			exhibitionColumns: [
				{
					title: "展览标题",
					key: "exhibitionName",
					align: "center",
					render(h, params) {
						let { exhibitionName } = params.row.exhibitionDto;
						return <p>{exhibitionName}</p>;
					}
				},
				{
					title: "策展人",
					key: "linkUrl",
					align: "center",
					render(h, params) {
						let { curator = "无" } = params.row.exhibitionDto;
						return <p>{curator}</p>;
					}
				},
				{
					title: "展期",
					key: "exhibitionStartTime",
					align: "center",
					render(h, params) {
						let {
							exhibitionStartTime,
							exhibitionEndTime
						} = params.row.exhibitionDto;
						return (
							<p>
								{exhibitionStartTime}--{exhibitionEndTime}
							</p>
						);
					}
				},
				{
					title: "排序",
					key: "sortNo",
          align: "center",
          render(h, params) {
						let { itemId, sortNo } = params.row;
						let oldValue = parseInt(sortNo);
						return (
						   <div>
								<input
									class="input"
									type="number"
                  min="1"
									value={sortNo}
									onInput={e => {
                    sortNo = parseInt(e.target.value);
                  }}
                  onKeydown={e=>{
                    if(e.keyCode == "13" && oldValue !=sortNo){
                      _this.addExhibition(itemId, sortNo);
                    }
                  }}
								/>
							</div>
						);
					}
				},
				{
					title: "发布时间",
					key: "gmtCreate",
					align: "center"
				},
				{
					title: "操作",
					key: "action",
					align: "center",
					render(h, params) {
            let { exhibitionName} = params.row.exhibitionDto;
            let {id} = params.row;

						let copyData;
						if (exhibitionName == "VR国宝馆") {
							copyData =
								"pages/exhibition/exhibition?linkUrl=https://vr.yiwaiart.com/exhibition/1/index.html";
						} else {
							copyData = "pages/artShow/artShow?id=" + id;
						}
						return (
							<div>
								<a
									href="javascript:void(0)"
									class="edit"
									v-clipboard={copyData}
									onSuccess={e => _this.$Message.success("复制成功")}
								>
									复制链接
								</a>
								<span class="edit" onClick={() => _this.deleteOK(id, 2)}>
									删除
								</span>
							</div>
						);
					}
				}
			],
			readExpertColumns: [
				{
					title: "用户信息",
					key: "nickName",
					align: "center",
					render(h, params) {
						let { nickName, avatarUrl } = params.row.readExpertDto.customer;
						return (
							<div style="padding:5px 0;">
                <div style="margin-bottom:5px;">{nickName}</div>
                <img style="width:60px;height:60px;" src={avatarUrl} />
							</div>
						);
					}
        },
				{
					title: "被崇拜次数",
					key: "harvestLikeNum",
					align: "center",
					render(h, params) {
						let { harvestLikeNum } = params.row.readExpertDto.customer;
						return <span>{harvestLikeNum}</span>;
					}
				},
				{
					title: "用户评论",
					key: "exhibitionStartTime",
					align: "center",
					type: "expand",
					render(h, params) {
						return h(expandRow, {
							props: {
								commentList: params.row.readExpertDto.commentList
							}
						});
					}
				},
				{
					title: "排序",
					key: "sortNo",
					align: "center",
          render(h, params) {
						let { itemId, sortNo } = params.row;
						let oldValue = parseInt(sortNo);
						return (
							<div>
								<input
									class="input"
									type="number"
                  min="1"
									value={sortNo}
									onInput={e => {
                    sortNo = parseInt(e.target.value);
                  }}
                  onKeydown={e=>{
                    if(e.keyCode == "13" && oldValue !=sortNo){
                      _this.addExpert(itemId, sortNo,false);
                    }
                  }}
								/>
							</div>
						);
					}
				},
				{
					title: "发布时间",
					key: "gmtCreate",
					align: "center",
					render(h, params) {
						let { gmtCreate } = params.row;
						return <span>{gmtCreate}</span>;
					}
				},
				{
					title: "操作",
					key: "action",
					align: "center",
					render(h, params) {
						let { id } = params.row;
						return (
							<div>
								<span class="edit" onClick={() => _this.deleteOK(id, 3)}>
									删除
								</span>
							</div>
						);
					}
				}
			]
		};
  },
	computed: {
		publicBtnIsActive: function() {
			if (this.newpublicId && this.publicSortNo) {
				return true;
			} else {
				return false;
			}
		},
		exhibitionBtnIsActive: function() {
			if (this.newexhibitionId && this.exhibitionSortNo) {
				return true;
			} else {
				return false;
			}
		},
		expertBtnIsActive: function() {
			if (this.newCustomerId && this.newCustomerNo) {
				return true;
			} else {
				return false;
			}
		}
	},
	mounted() {
		this.getBannerList();
		this.getYiWaiPublic();
		this.getYiwaiExhibition();
		this.getReadList();
	},
	methods: {
		getName(name) {
			this.index = name;
		},
		showModal() {
      this.formValidate={
        id: 0,
				image: "",
				linkUrl: "",
				sortNo: '',
				remark: ""
      }
      this.$refs['formValidate'].resetFields();
			this.bannerModal = true;
    },

		getImageUrl(file) {
			this.isArtImgUploadOk = true;
			this.formValidate.image = file.url;
		},
		getLitImgUrl(file) {
			this.isLitUploadOk = true;
			this.formValidate.image = file.url;
		},
		uploadExceededSize() {
			this.$Message.error("文件超出大小限制!");
		},
		uploadError(error) {
			this.isUploadOk = false;

		},
		resetImg() {
			this.isUploadOk = false;
			this.formValidate.image = "";
		},
		uploadOk() {
			this.isUploadOk = true;
		},
    deleteBannerModal(bannerId){
      	let _this = this;
			this.$Modal.confirm({
        title: "系统提示",
        content:'确定删除？',
				onOk: function() {
					_this.deleteBanner(bannerId);
				}
			});
    },
		deleteOK(pageReleaseId, id) {
			let _this = this;
			this.$Modal.confirm({
        title: "系统提示",
        content:'确定删除？',
				onOk: function() {
					_this.deletePageRelease(pageReleaseId, id);
				}
			});
		},
		editBanner(item) {
      this.$refs['formValidate'].resetFields();
      this.isLitUploadOk = true;
      this.sortPlaceholder= item.sortNo.toString();
			this.formValidate = {
				id: item.id,
				image: item.image,
				linkUrl: item.linkUrl !== undefined ? item.linkUrl : "",
				sortNo: '',
				remark: item.remark
			};
      this.bannerModal = true;
		},


		//获取banner列表
		async getBannerList() {
			const { code, msg, data } = await getBannerList({});
			if (code == 10000) {
				this.bannerList = data.bannerList;
        this.tableBannerLoading = false;
			} else {
				this.$Message.error(msg);
        this.tableBannerLoading = false;
			}
		},
		//获取意外发布列表
		async getYiWaiPublic() {
			const { code, msg, data } = await getYiWaiPublic({});

			if (code == 10000) {
				this.publicList = data.yiWaiPublic;
				this.tablePublicLoading = false;
			} else {
				this.$Message.error(msg);
        this.tablePublicLoading = false;
			}
		},
		//获取展览列表
		async getYiwaiExhibition() {
      const { code, msg, data } = await getYiwaiExhibition({});
			if (code == 10000) {
				this.ExhibitionList = data.yiwaiExhibition;
        this.tableExhibitionLoading = false;
			} else {
				this.$Message.error(msg);
         this.tableExhibitionLoading = false;
			}
		},
		//获取解读达人列表
		async getReadList() {

			const { code, msg, data } = await getReadList({});
			console.log(data);
			if (code === 10000) {
				this.readList = data.readExpert;
        this.tableExpertLoading = false;
			} else {
				this.$Message.error(msg);
        this.tableExpertLoading = false;
			}
		},
		async deleteBanner(bannerId) {
			const { code, msg } = await deleteBanner({
				bannerId: bannerId
			});
			if (code === 10000 || code === "10000") {
				this.getBannerList();
			} else {
				this.$Message.error(msg);
			}
		},

		async deletePageRelease(pageReleaseId, type) {
			const { code, msg } = await deletePageRelease({
				pageReleaseId: pageReleaseId
			});
			if (code === 10000 || code === "10000") {
				if (type == 1) {
					this.getYiWaiPublic();
				} else if (type == 2) {
					this.getYiwaiExhibition();
				} else if (type == 3) {
					this.getReadList();
				}
			} else {
				this.$Message.error(msg);
			}
		},

		//添加意外发布
		async addPublic(publicId, publicSortNo,isAdd) {
      if(isAdd){
      if(this.publicList.length<5){
            const { code, msg } = await addPublic({
              cardId: parseInt(publicId),
              sortNo: parseInt(publicSortNo)
            });
            if (code === 10000) {
              this.$Message.success(msg);
              this.getYiWaiPublic();
            } else {
              this.$Message.error(msg);
            }
          }else{
            this.$Message.warning("最多只能添加5项");
          }
      }else{
           const { code, msg } = await addPublic({
              cardId: parseInt(publicId),
              sortNo: parseInt(publicSortNo)
            });
            if (code === 10000) {
              this.$Message.success(msg);
              this.getYiWaiPublic();
            } else {
              this.$Message.error(msg);
            }
      }


		},

		// 添加意外展览
		async addExhibition(exhibitionId,exhibitionSortNo) {
			const { code, msg } = await addExhibition({
				exhibitionId: parseInt(exhibitionId),
				sortNo: parseInt(exhibitionSortNo)
			});
			if (code === 10000) {
				this.$Message.success(msg);
				this.getYiwaiExhibition();
			} else {
				this.$Message.error(msg);
			}
		},

		//添加解读达人
		async addExpert(CustomerId,CustomerNo,idAdd) {
      if(idAdd){
        if(this.readList.length<3){
            const { code, msg } = await setReadExpert({
            customerId: parseInt(CustomerId),
            sortNo: parseInt(CustomerNo)
            });
            if (code === 10000) {
              this.$Message.success(msg);
              this.getReadList();
            } else {
              this.$Message.error(msg);
            }
          }else{
            this.$Message.warning("最多只能添加3项");
          }
      }else{
          const { code, msg } = await setReadExpert({
            customerId: parseInt(CustomerId),
            sortNo: parseInt(CustomerNo)
            });
            if (code === 10000) {
              this.$Message.success(msg);
              this.getReadList();
            } else {
              this.$Message.error(msg);
            }
      }
		},
    validateForm(){
      this.$refs["formValidate"].validate((valid) => {
          if(valid){
            if(this.formValidate.id==0){
              if(this.bannerList.length<5){
                this.setBanner();
              }else{
                this.$Message.warning("最多只能添加5项");
              }
            }else{
              this.setBanner()
            }
          }else{
            this.loading = false;
          }
        })
    },
		async setBanner() {
        const { code,msg} = await setBanner({
              bannerInfo: JSON.stringify(this.formValidate)
            });

            if (code === 10000) {
              this.getBannerList();
              this.bannerModal = false;
              this.$Message.success(msg);
            } else {
              this.$Message.error(msg);
            }
		}
	}
};
</script>

<style lang="less">
@import "../../libs/css/constant.less";
@import "../../libs/css/common.less";

#page {
	.tab {
		.table {
			padding: 50px;
			border-bottom: 1px dotted #ccc;
			// p {
			// 	padding-bottom: 20px;
			// }
		}
	}
	.ellipsisLn {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
	}
  .input{
    display: inline-block;
    width: 100%;
    height: 32px;
    line-height: 1.5;
    text-align: center;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid transparent;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    &:focus{
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45,140,240,.2);
    }
    &.normal{
      border-color: #dddee1;
      text-align: left;
      &:focus{
      border-color: #57a3f3;
      outline: 0;
      box-shadow: 0 0 0 2px rgba(45,140,240,.2);
      }
    }
  }
	.headImg {
		height: 60px;
  }
  .flex{
    display: flex;
    .flex-item{
      flex: 1;
      p{
        padding-top: 10px;
      }
    }
  }
}
</style>
