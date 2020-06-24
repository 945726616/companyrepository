<template>
  <div class="upload">
    <!-- 图片上传 -->
    <template v-if="!drag">
      <el-upload
        accept="image/png, image/jpeg, image/gif, image/bmp"
        class="avatar-uploader"
        name="image"
        action
        :show-file-list="false"
        :on-change="uploadChange"
      >
        <!--  :on-success="uploadSucces" -->
        <!--  action="https://jsonplaceholder.typicode.com/posts/" -->
        <template v-if="avatar">
          <img v-if="img" :src="img" class="avatar" :style="{width:width+'px',height:height+'px'}" />
          <i
            v-else
            class="el-icon-plus avatar-uploader-icon"
            :style="{width:width+'px',height:height+'px',lineHeight:height+'px'}"
          ></i>
        </template>
        <template v-if="!avatar">
          <i
            class="el-icon-plus avatar-uploader-icon"
            :style="{width:width+'px',height:height+'px',lineHeight:height+'px'}"
          ></i>
        </template>
      </el-upload>
    </template>
    <template v-else>
      <el-upload
        name="image"
        ref="upload"
        accept="image/png, image/jpeg, image/gif, image/bmp"
        drag
        action
        :on-change="uploadChange"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </template>

    <!--图片上传  -->
    <!-- vueCropper 剪裁图片实现-->
    <el-dialog title="图片剪裁" close="dialog" :visible.sync="dialogVisible" append-to-body>
      <div class="cropper-content">
        <vue-cropper
          class="cropper"
          ref="cropper"
          :aspect-ratio=" x / y"
          :src="option.img"
          preview=".preview"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cropImage" :loading="loading">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import VueCropper from 'vue-cropperjs'
import { ApiuploadingPictures } from '@/api'
import 'cropperjs/dist/cropper.css'
export default {
  props: {
    x: {
      type: Number,
      value: 16
    },
    y: {
      type: Number,
      value: 9
    },
    drag: {
      type: Boolean,
      value: false
    },
    avatar: {
      type: Boolean,
      value: true
    },
    index: {
      type: Number,
      value: 0
    },
    default: {
      type: String,
      value: ''
    },
    type: {
      type: Number,
      value: 0
    },
    width: {
      type: Number,
      value: 178
    },
    height: {
      type: Number,
      value: 178
    }
  },
  components: { VueCropper },
  data () {
    return {
      img: '',
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: 'png', // 裁剪生成图片的格式
        canScale: true, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 300, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 5], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      // 防止重复提交
      loading: false
    }
  },
  mounted () {
    console.log('tupian ===============================')
    console.log(this.avatar, this.default, this.type)
    if (this.avatar) {
      if (this.default && this.default !== '') {
        this.img = this.default
      }
    }
  },
  methods: {
    // 点击裁剪，这一步是可以拿到处理后的地址
    async cropImage () {
      // get image data for post processing, e.g. upload or setting image src
      let cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL()
      // console.log(cropImg);
      let file = this.utils.dataURLtoFile(cropImg, new Date().getTime())
      console.log(file)
      if (file.size / 1024 / 1024 > 2) {
        this.$message({
          type: 'info',
          message: '上传图片超过2MB'
        })
        return false
      }
      // console.log(file)
      let data = new FormData()
      data.append('image', file)
      data.append('imgType', 'shop')
      this.loading = true
      let res = await ApiuploadingPictures(data)
      console.log(res)
      if (res.errorCode === 1 && res.imgUrl !== '') {
        this.dialogVisible = false
        this.loading = false
        this.img = res.imgUrl
        if (this.drag) {
          this.$emit('callback', {
            img: this.img
          })
        } else {
          this.$emit('callback', {
            img: this.img,
            index: this.index,
            type: this.type
          })
        }
      }
    },
    uploadChange (file, fileList) {
      console.log('图片选择')
      console.log(file)
      this.utils.getBase64(file.raw).then(res => {
        if (this.option.img !== '') {
          this.option.img = res
          this.$refs.cropper.replace(res)
          this.dialogVisible = true
        } else {
          this.option.img = res
          this.dialogVisible = true
        }
      })
    },
    uploadSucces (res, file) {
      console.log('图片上传成功', res)
      this.img =
        'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1692403763,707267564&fm=26&gp=0.jpg'

      this.$emit('callback', {
        img: this.img,
        index: this.index,
        type: this.type
      })
    }
  },
  watch: {
    default (curr, old) {
      console.log(curr)
      // if (curr && curr !== '') {
      this.img = curr
      // }
    }
  }
}
</script>
<style lang="scss">
.upload {
  display: inline-block;
  // text-align: center;
  .avatar-uploader {
    display: inline-block;
  }
  .avatar-uploader .el-upload {
    box-sizing: border-box;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #ed3f14;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  .avatar {
    display: inline-block;
    float: left;
  }
}
.dialog {
  height: 420px;
  width: 500px;
}
// 截图
.cropper-content {
  .cropper {
    width: 100%;
    height: 300px;
  }
}
</style>
