<template>
	<v-input :value="localValue" :rules="rules" @click="$emit('focus')">
		<div style="width: 100% !important">
			<field-label>{{ label }}</field-label>

			<ClientOnly>
				<!-- Use the component in the right place of the template -->
				<tiptap-vuetify
					:key="key"
					v-model="localValue"
					:toolbar-attributes="toolbarProps"
					:extensions="extensions"
					:card-props="cardProps"
				/>
			</ClientOnly>
		</div>
	</v-input>
</template>

<script>
import colors from "vuetify/es5/util/colors";
// import the component and the necessary extensions
import {
	TiptapVuetify,
	Heading,
	Bold,
	Italic,
	Strike,
	Underline,
	Code,
	Paragraph,
	BulletList,
	OrderedList,
	ListItem,
	Link,
	Blockquote,
	HardBreak,
	HorizontalRule,
	History,
} from "tiptap-vuetify";
import field from "../mixins/field";
export default {
	components: { TiptapVuetify },
	mixins: [field],
	data: () => ({
		// declare extensions you want to use
		extensions: [
			History,
			Blockquote,
			Link,
			Underline,
			Strike,
			Italic,
			ListItem,
			BulletList,
			OrderedList,
			[
				Heading,
				{
					options: {
						levels: [2, 3],
					},
				},
			],
			Bold,
			Code,
			HorizontalRule,
			Paragraph,
			HardBreak,
		],
	}),
	computed: {
		cardProps() {
			return {
				flat: true,
				outlined: true,
				elevation: 0,
			};
		},
		toolbarProps() {
			return {
				color: !this.isThemeDark ? colors.grey.lighten5 : colors.grey.darken2,
			};
		},
		key() {
			return `${this.theme}`;
		},
	},
};
</script>
