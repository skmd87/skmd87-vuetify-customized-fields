import Vue from "vue";
import * as vuetifyCustomizedFields from "../components/index.js";
// register all components
// for (const key in vuetifyCustomizedFields) {
// 	console.log(key, vuetifyCustomizedFields[key]);
// 	Vue.component(key, vuetifyCustomizedFields[key]);
// }
const options = JSON.parse(`<%= JSON.stringify(options) %>`);

console.log("🚀 ~ file: index.js:10 ~ options:", options);
Object.entries(vuetifyCustomizedFields.default).forEach(([name, component]) => {
	console.log(name, component);
	Vue.component(options.prefix + name, component);
});
