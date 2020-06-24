<template>
  <div>
    <textarea class="my_editor" id="Editor" v-model="editorContent"></textarea>
  </div>
</template>
<script>
import Tinymce from 'tinymce'
import { ApiuploadingPictures } from '@/api'
const env = process.env.NODE_ENV === 'development'
console.log(env ? '开发环境' : '生产环境')
export default {
  props: {
    txt: {
      type: String,
      value: ''
    }
  },
  data () {
    return {
      editorContent: ''
    }
  },
  watch: {
    txt (curr, old) {
      if (curr && curr !== '') {
        this.editorContent = curr
      }
    }
    // editorContent (cuur, old) {
    //   if (cuur) {
    //     this.editorContent = cuur
    //   }
    // }
  },
  mounted () {
    if (this.txt && this.txt !== '') {
      this.editorContent = this.txt
    }
    this.tinymceInit()
  },
  beforeDestroy () {
    // 这个必须要加，不然初始化的时候会有问题，销毁富文本编辑器
    Tinymce.remove()
  },
  methods: {
    getContent () {
      return Tinymce.get('Editor').getContent()
    },
    // 初始化富文本编辑器
    tinymceInit () {
      let _this = this // 这一句代码是重点不写会报错theme.js:1 Uncaught SyntaxError: Unexpected token <
      // Tinymce.baseURL = "/web/mall-admin/static/tinymce";
      Tinymce.baseURL = env
        ? '/static/tinymce'
        : '/web/mall-admin/static/tinymce'

      Tinymce.init({
        min_height: 600,
        selector: '#Editor',
        // language_url: "/web/mall-admin/static/tinymce/zh_CN.js", // 设置中文
        language_url: env
          ? '/static/tinymce/zh_CN.js'
          : '/web/mall-admin/static/tinymce/zh_CN.js', // 设置中文
        language: 'zh_CN',
        plugins: [
          // 配置插件：可自己随意选择，但如果是上传本地图片image和imagetools是必要的
          'autosave advlist autolink link image lists charmap  preview hr anchor pagebreak '
        ], // 工具框，也可自己随意配置
        toolbar:
          ' newnote print preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media',
        image_advtab: true,
        table_default_styles: {
          width: '100%',
          borderCollapse: 'collapse'
        },
        autosave_interval: '20s',
        image_title: false, // 是否开启图片标题设置的选择，这里设置否
        automatic_uploads: true, // 图片异步上传处理函数
        convert_urls: true,
        relative_urls: false,
        remove_script_host: false,
        images_upload_handler: async function (blobInfo, success, failure) {
          var data = new FormData()
          data.append('image', blobInfo.blob(), blobInfo.filename())
          setTimeout(async () => {
            let res = await ApiuploadingPictures(data)
            console.log(res)
            if (res.errorCode === 1 && res.imgUrl !== '') {
              success(res.imgUrl)
            // _this.$emit('tinymceChange', Tinymce)
            } else {
              failure('上传失败')
            }
          }, 100)
        },
        init_instance_callback: function (editor) {
          editor.on('keyup', () => {
            // 获取富文本编辑器里面的内容
            _this.editorContent = editor.getContent()
            // _this.$emit('tinymceChange', Tinymce)
          })
        }

      })
        .then(resolve => {
        // 初始化富文本编辑器里面的内容
          resolve[0].setContent(_this.editorContent)
        })
    }
  }
}
</script>
