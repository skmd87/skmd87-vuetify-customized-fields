import Vue from 'vue'
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'

export default ({ app,$vuetify }) => {
  Vue.use(TiptapVuetifyPlugin, {
    vuetify: app.vuetify,
    iconsGroup: 'mdiSvg'
  })
}
