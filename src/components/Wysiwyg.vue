<template>
	<v-input :value="localValue" :rules="rules" @click="$emit('focus')">
		<div style="width: 100% !important">
			<custom-label :label="label" />

			<ClientOnly>
				<!-- Use the component in the right place of the template -->
				<tiptap-vuetify
					:key="key"
					dir="rtl"
					v-model="localValue"
					:toolbar-attributes="toolbarProps"
					:extensions="extensions"
					:card-props="cardProps"
					ref="tiptap"
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
import TextDirection from "tiptap-text-direction";
import field from "../mixins/field";
export default {
	components: { TiptapVuetify },
	mixins: [field],
	props: {
		dir: {
			type: String,
			default: "ltr",
		},
		minHeight: {
			type: [Number, String],
			default: undefined,
		},
		maxHeight: {
			type: [Number, String],
			default: undefined,
		},
	},
	data() {
		// declare extensions you want to use
		return {
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
				// TextDirection.configure({
				// 	types: ["heading", "paragraph"],
				// }),
			],
		};
	},
	computed: {
		cardProps() {
			return {
				flat: true,
				outlined: true,
				elevation: 0,
				minHeight: this.minHeight,
				maxHeight: this.maxHeight,
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
	watch: {
		dir: {
			immediately: true,
			handler() {
				this.$nextTick(() => {
					//	this.$refs.tiptap.$refs.editor.commands.setTextDirection(this.dir);
				});
			},
		},
	},
};
</script>
