<template>
  <div id="user">
    <Button type="primary" icon="plus" class="mt10" @click="addUser">新增账号</Button>
    <Table class="mt10" border :loading="loading" :columns="columns" :data="userList"></Table>
    <SetUser :pIsShowModel="pIsShowModel" :pUserInfo="pUserInfo" :pIsAdd="pIsAdd" @updatepIsShowModel="val=>pIsShowModel=val"></SetUser>
  </div>
</template>

<script>
import { Table, Button } from 'iview';
import { getUserList, deleteUser } from './System.service';
import SetUser from './SetUser.vue';

export default {
  name: 'User',
  components: { Table, Button, SetUser },
  data() {
    return {
      loading: false,
      columns: [
        {
          title: "编号",
          key: "id",
          align: 'center',
          width: 100
        },
        {
          title: "账号",
          key: "userName",
          align: 'center'
        },
        {
          title: "创建时间",
          key: "gmtCreate",
          align: 'center'
        },
        {
          title: "操作",
          key: "",
          align: 'center',
          render: (h, params) => {
            const { row } = params;
            const isOperate = () => <div>
              <p><span class="edit" onClick={() => this.editUser(row)}>编辑</span><span class="edit" onClick={() => this.deleteUser(row)}>删除</span></p>
            </div>;
            return (
              <div class="operateWrp">
                {isOperate()}
              </div>
            );
          }
        }
      ],
      userList: [],
      pIsShowModel: false,
      pUserInfo: {},
      pIsAdd: true
    }
  },

  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      const postData = {
        pageNo: 1,
        pageSize: 100
      };
      this.loading = true;
      getUserList(postData).then(({ data: { userList, totalPages } }) => {
        this.loading = false;
        this.userList = userList;
      });
    },
    addUser() {
      this.pUserInfo = {
        id: 0,
        password: '',
        userName: '',
        userStatus: 1,
      };
      this.pIsAdd = true;
      this.pIsShowModel = true;
    },
    editUser(row) {
      this.pUserInfo = Object.assign({}, {
        id: 0,
        password: '',
        userName: '',
        userStatus: 1,
      }, { ...row });
      this.pIsAdd = false;
      this.pIsShowModel = true;
    },
    deleteUser(row) {
      const { id, userName } = row;
      this.$Modal.confirm({
        title: '系统提示',
        content: `<p>确定要删除账号 [ ${userName} ] 吗？</p>`,
        onOk: () => {
          deleteUser({ userId: id }).then(({ code }) => {
            if (code == '10000') {
              this.$Message.success('删除成功！');
              this.getUserList();
            }
          });
        },
        onCancel: () => {
        }
      });
    }
  }

}
</script>
<style lang="less">
@import "../../libs/css/common.less";

#user {
  .operateWrp a {
    margin-right: 8px;
    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
