<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- /面包屑 -->
      </div>
      <el-form
        ref="publish-form"
        :model="article"
        :rules="formRules"
        label-width="60px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <!-- <el-input type="textarea" v-model.lazy="article.content"></el-input> -->
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            height="400px"
            placeholder="请输入文章内容"
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面 -->
          <!-- <template v-if="article.cover.type > 0">
            <upload-cover
              v-for="(cover, index) of article.cover.type"
              :key="cover"
              :cover-image="article.cover.images[index]"
              @update-cover="onUpdateCover(index, $event)"
            /> -->
          <!-- v-model 相当于 :value="xxx" 和 @input="xxx" -->
          <template v-if="article.cover.type > 0">
            <upload-cover
              v-for="(cover, index) of article.cover.type"
              :key="cover"
              v-model="article.cover.images[index]"
            />
          </template>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              v-for="channel of channels"
              :key="channel.id"
              :label="channel.name"
              :value="channel.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import UploadCover from './components/upload-cover.vue'
import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle
} from '@/api/article'
import { uploadImage } from '@/api/image'
import {
  ElementTiptap,
  ElementTiptapPlugin,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  TableHeader,
  TableCell,
  TableRow,
  Table,
  Image,
  CodeBlock,
  TextColor
} from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
import Vue from 'vue'
Vue.use(ElementTiptapPlugin, { lang: 'zh' })

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap,
    'upload-cover': UploadCover
  },
  props: {},
  data () {
    return {
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 4 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Image({
          // 默认会把图片生成 base64
          // 自定义图片上传
          uploadRequest (file) {
            const fd = new FormData()
            fd.append('image', file)
            return uploadImage(fd).then(res => {
              // console.log(res)
              return res.data.data.url
            })
            // return 'https://www.baidu.com/img/flexible/logo/pc/result.png'
          }
        }),
        new TextColor(),
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new CodeBlock(),
        new HorizontalRule(), // 分割线
        new TableHeader(),
        new TableCell(),
        new TableRow(),
        new Table(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new Fullscreen(),
        new Preview()
      ],
      article: {
        title: '', // 文章标题
        content: '', // 文章内容
        cover: { // 文章封面
          type: 1, // 类型 -1自动，0无图，1,3
          images: [] // 图片地址
        },
        channel_id: null // 频道
      },
      channels: null, // 文章频道
      formRules: {
        title: [
          {
            required: true,
            message: '请输入文章标题',
            trigger: 'blur'
          },
          {
            min: 5,
            max: 30,
            message: '长度在5~30个字符',
            trigger: 'blur'
          }
        ],
        content: [
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证成功
                callback()
              }
            }
          },
          {
            required: true,
            message: '请输入文章内容',
            trigger: 'blur'
          }
        ],
        channel_id: [
          {
            required: true,
            message: '请选择文章频道'
          }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    // 是否为修改文章
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    // 发布文章
    onPublish (draft = false) {
      // 验证表单
      this.$refs['publish-form'].validate(valid => {
        // 验证失败
        if (!valid) {
          return
        }
        // 验证成功
        // 是否为修改还是发布文章
        const articleId = this.$route.query.id
        if (articleId) {
          // 执行修改
          updateArticle(articleId, this.article, draft).then(res => {
            console.log(res)
            this.$message.success(`${draft ? '存入草稿' : '发布'}成功`)
          })
        } else {
          // 执行发布
          addArticle(this.article, draft).then(res => {
            console.log(res)
            this.$message.success(`${draft ? '存入草稿' : '发布'}成功`)
          })
        }
      })
    },
    // 获取频道
    loadChannels () {
      getArticleChannels().then(({ data: { data } }) => {
        this.channels = data.channels
      })
    },
    // 修改文章：加载文章内容
    loadArticle () {
      getArticle(this.$route.query.id.toString()).then(res => {
        // 展示
        this.article = res.data.data
      })
    }
    // 子组件传封面
    // onUpdateCover (index, url) {
    //   // console.log(index, url)
    //   this.article.cover.images[index] = url
    // }
  }
}
</script>

<style scoped lang="less">

</style>
