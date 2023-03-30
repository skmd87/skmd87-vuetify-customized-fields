module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		parser: "@babel/eslint-parser",
		requireConfigFile: false,
	},
	extends: ["@nuxtjs", "plugin:nuxt/recommended", "prettier"],
	plugins: [],
	// add your custom rules here
	rules: {
		"vue/no-v-html": "off",
		"nuxt/no-cjs-in-config": "off",
		camelcase: [
			"error",
			{
				properties: "never",
			},
		],
		"no-console": "off",
		"vue/multi-word-component-names": "off",
		"vue/valid-v-slot": ["error", { allowModifiers: true }],
	},
};
