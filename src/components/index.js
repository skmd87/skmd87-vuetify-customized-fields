// // import all components in this folder
// import Autocomplete from "./Autocomplete.vue";
// import Checkbox from "./Checkbox.vue";
// import CheckMark from "./CheckMark.vue";
// import Chips from "./Chips.vue";
// import Country from "./Country.vue";
// import Date from "./Date.vue";
// import DateTime from "./DateTime.vue";
// import File from "./File.vue";
// import Input from "./Input.vue";
// import Label from "./Label.vue";
// import Password from "./Password.vue";
// import Radio from "./Radio.vue";
// import Select from "./Select.vue";
// import Textarea from "./Textarea.vue";
// import TextField from "./TextField.vue";
// import Upload from "./Upload.vue";
// import Users from "./Users.vue";
// import Wysiwyg from "./Wysiwyg.vue";
// import Youtube from "./Youtube.vue";
// import Legend from "./Legend.vue";
// import Phone from "./Phone.vue";
// import Number from "./Number.vue";

// export default {
// 	Autocomplete,
// 	Checkbox,
// 	CheckMark,
// 	Chips,
// 	Country,
// 	Date,
// 	DateTime,
// 	File,
// 	Input,
// 	Label,
// 	Password,
// 	Radio,
// 	Select,
// 	Textarea,
// 	TextField,
// 	Upload,
// 	Users,
// 	Wysiwyg,
// 	Youtube,
// 	Legend,
// 	Phone,
// 	Number,
// };
// dynamic export default all .vue files in this folder
const requireComponent = require.context(
	// The relative path of the components folder
	".",
	// Whether or not to look in subfolders
	false,
	// The regular expression used to match base component filenames
	/\.vue$/
);

const components = {};

requireComponent.keys().forEach((fileName) => {
	// Get component config
	const componentConfig = requireComponent(fileName);

	// Get PascalCase name of component
	const componentName = fileName
		.replace(/^\.\//, "")
		.replace(/\.\w+$/, "")
		.replace(/-/g, "");

	// Register component globally
	components[componentName] = componentConfig.default || componentConfig;
}
);


export default components;