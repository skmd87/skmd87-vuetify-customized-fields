
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