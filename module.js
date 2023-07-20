// module.js
const { resolve, join } = require("path");
const { readdirSync } = require("fs");
import chalk from "chalk";
import axios from "axios";
import { mdiUpload, mdiDeleteOutline, mdiPlus } from "@mdi/js";
const defaultOptions = {
	prefix: "vc",
	style: {
		dense: true,
		filled: false,
		rounded: false,
		flat: false,
		outlined: false,
	},
	icons: {
		upload: mdiUpload,
		delete: mdiDeleteOutline,
		add: mdiPlus,
	},
	api: {
		countries: "/v1/lookups/countries",
		currencies: "/v1/lookups/currencies",
		provinces: "/v1/lookups/provinces",
	},
};
//https://unpkg.com/vuetify-customized-fields@1.0.5/package.json
export default function (moduleOptions) {
	const { nuxt } = this;

	this.nuxt.hook("listen", async function (/*server, { port }*/) {
		const latestVersion = await axios.get("https://unpkg.com/vuetify-customized-fields/package.json").then((response) => {
			return response.data.version;
		});
		// get the version from the package.json
		const packageJson = require("./package.json");
		const version = packageJson.version;
		// compare the versions
		if (version !== latestVersion) {
			//message to the console red background and white text using chalk package
			nuxt.options.cli.badgeMessages.push("vuetify-customized-fields: " + chalk.red("new version available"));
			nuxt.options.cli.badgeMessages.push(
				"Current version: " + chalk.red(version) + " Latest version: " + chalk.green(latestVersion)
			);
		} else {
			//message to the console green background and white text using chalk package
			nuxt.options.cli.badgeMessages.push(chalk.white("vuetify-customized-fields") + chalk.green(" up to date"));
			nuxt.options.cli.badgeMessages.push("Current version: " + chalk.green(version));
		}
	});

	this.options.build.transpile.push("vuetify-datetime-picker");

	// get all options for the module
	const options = {
		...defaultOptions,
		...moduleOptions,
		...this.options.vuetifyCustomFields,
	};
	// expose the namespace / set a default
	if (!options.namespace) options.namespace = "vuetifyCustomFields";
	const { namespace } = options;
	// add all of the initial plugins
	const pluginsToSync = [
		"src/components/index.js",
		"src/plugins/index.js",
		"src/debug.js",
		"src/plugins/tiptap.client.js",
		"src/plugins/datetime.js",
	];
	for (const pathString of pluginsToSync) {
		this.addPlugin({
			src: resolve(__dirname, pathString),
			fileName: join(namespace, pathString),
			options,
		});
	}
	// sync all of the files and folders to revelant places in the nuxt build dir (.nuxt/)
	const foldersToSync = ["src/plugins", "src/components", "src/mixins", "src/images/flags"];
	for (const pathString of foldersToSync) {
		const path = resolve(__dirname, pathString);
		for (const file of readdirSync(path)) {
			this.addTemplate({
				src: resolve(path, file),
				fileName: join(namespace, pathString, file),
				options,
			});
		}
	}
}

module.exports.meta = require("./package.json");
