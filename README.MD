#Vuetify Customized Fields
This is an extended version of vuetify form fields


##Setup
 ```
 npm i vuetify-customized-fields
 ```

 Open nuxt.config.js and add the following :
 ```
modules: [
    ...,
    vuetify-customized-fields
],

vuetifyCustomFields: {
    // options
},
 ```


##Default Options
```
{
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
		add: mdiPlus
	}
}
```
## Components List
https://github.com/skmd87/skmd87-vuetify-customized-fields/tree/main/src/components


## Extra Props
```api:[String]```