import { TiptapVuetifyPlugin } from "tiptap-vuetify";
import Vue from "vue";
export default ({ app }) => {
	Vue.use(TiptapVuetifyPlugin, {
		vuetify: app.vuetify,
		iconsGroup: "mdi",
	});
};
