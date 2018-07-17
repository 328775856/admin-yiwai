<template>
    <div class="eyQuill">
        <quill-editor ref="myTextEditor" v-model="content" style="height:300px" :options="editorOption" @change="onEditorChange($event)"></quill-editor>
    </div>
</template>

<script>
import axios from 'axios';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import { quillEditor } from 'vue-quill-editor';
import util from 'libs/js/util.js';
import config from 'libs/js/config.js';

export default {
    name: 'EyQuill',
    components: { quillEditor },
    props: {
        editContent:String,
        length:{
            type:Number,
            default:3000
        }
    },
    data() {
        return {
            token: '',
            editorOption: {
                theme: 'snow',
                boundary: document.body,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline'],
                        ['image'],
                        // ['blockquote', 'code-block'],
                        // [{ 'header': 1 }, { 'header': 2 }],
                        // [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        // [{ 'script': 'sub' }, { 'script': 'super' }],
                        // [{ 'indent': '-1' }, { 'indent': '+1' }],
                        // [{ 'direction': 'rtl' }],
                        // [{ 'size': ['small', false, 'large', 'huge'] }],
                        // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        // [{ 'color': [] }, { 'background': [] }],
                        // [{ 'font': [] }],
                        [{ 'align': [] }],
                        // ['clean'],
                        // ['link', 'image', 'video']
                    ]
                },
                placeholder: '输入艺术家介绍，不超过3000个字符',
                readOnly: false
            },
            content: ''
        }
    },
    mounted() {
        if(this.editContent) {
            this.content = this.editContent;
        }
        this.getQNToken();
    },
    methods: {
        async getQNToken() {
            this.token = await util.getQNToken();
        },
        onEditorBlur(editor) {
            this.artDescription = '';
        },
        onEditorChange({ html,text }) {
            //将富文本base64转化成七牛云地址
            var c = this.content
            if (/src="data:/.test(c)) {
                const t = util.base64List(c);
                let blob = util.dataURItoBlob(t)
                const pngReg = new RegExp(/png[\'\"]?([^\'\"]*)[\'\"]?/i);
                let type = blob.type.slice(6);
                let format = `.${type}`;
                var form = new FormData();
                form.append('file', blob);
                form.append('token', this.token);
                form.append('key', `eyadmin/${util._guid()}${format.slice(format.lastIndexOf('.'))}`);
                axios({
                    method: 'post',
                    url: 'https://up-z2.qbox.me',
                    data: form
                }).then((res) => {
                    const d = `${config.imgHost}${res.data.key}`;
                    const srcReg = /src="data[\'\"]?([^\'\"]*)[\'\"]?/gi;
                    this.content = c.replace(c.match(srcReg)[0], `src=${d}`);
                })
            }
            this.$emit('content-change', { content: this.content });//将content传给父组件
            if(text.length>this.length){
                this.$Message.error(`字数不可超过${this.length}`)
            }
        },
    }
}
</script>

<style lang="less">
@import "../../../libs/css/constant.less";
</style>
