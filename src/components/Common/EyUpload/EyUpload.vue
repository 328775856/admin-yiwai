<template>
    <div class="eyUpload">
        <Upload action="https://up-z2.qbox.me" class="upload" :max-size="maxSize" :before-upload="beforeUpload" :on-success="onSuccess" :on-error="onError" :on-exceeded-size="onExceededSize" :data="data" :show-upload-list="false" :accept="accept">
            <Button type="ghost" icon="plus">{{text}}</Button>
        </Upload>
        <span>{{imgSizeText}}</span>
    </div>
</template>

<script>

import { Button, Upload } from 'iview';
import util from 'libs/js/util.js';
import config from 'libs/js/config.js';

export default {
    name: 'EyUpload',
    components: { Button, Upload },
    props: {
        imgSizeText: String,
        maxSize: {
            type: Number
        },
        accept: { //允许的上传类型
            type: String,
            default: 'image/gif,image/jpeg,image/jpg,image/png,video/mp4'
        },
        text:{
            type:String,
            default:'点击上传'
        }
    },
    data() {
        return {
            token: '',
            data: {
                file: 'file',
                token: '',
                key: ''
            },
            prdfix: 'eyadmin',
            imgHost: config.imgHost,
        }
    },
    mounted() {
        this.getQNToken();
    },
    methods: {
        beforeUpload(file) {
            if (file) {
                this.data.key = `${this.prdfix}/${util._guid()}${file.name.slice(file.name.lastIndexOf('.'))}`;
            }
            this.$emit('before-upload', file);
        },
        async getQNToken() {
            this.data.token = await util.getQNToken();
        },
        onSuccess(res, file, fileList) {
            this.$emit('upload-ok', { url: `${config.imgHost}${res.key}`, name: file.name });
        },
        onError(error, file, fileList) {
            this.$emit('upload-error', error);
        },
        onExceededSize(file, fileList) {
            this.$emit('upload-exceeded-size');
        },
    }
}
</script>

<style lang="less">
.eyUpload {
  .upload {
    background-color: #fff;
    width: 100px;
    display: inline-block;
  }
}
</style>
