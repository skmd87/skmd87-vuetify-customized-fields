<template>
	<client-only>
		<v-input :value="localValue" class="vc-wysiwyg text-start rich-editor" :rules="rules">
			<v-card min-height="200" outlined class="flex-grow-1 d-flex flex-column" color="t">
				<v-toolbar v-if="editor" flat height="auto" color="rgb(240, 240, 240)" class="toolbar flex-grow-0">
					<template v-for="(btn, i) in toolbar">
						<v-btn
							v-if="btn.type === 'button'"
							:key="'toolbar-item-' + i"
							:title="btn.title"
							icon
							small
							:input-value="editor.isActive(btn.activeStateName, btn.commandParam)"
							@click="editor.chain()[btn.command](btn.commandParam).focus().run()"
						>
							<v-icon>{{ btn.icon }}</v-icon>
						</v-btn>
						<v-btn
							v-if="btn.type === 'link'"
							:key="'toolbar-item-' + i"
							:title="btn.title"
							icon
							small
							:input-value="editor.isActive(btn.activeStateName, btn.commandParam)"
							@click="showModal"
						>
							<v-icon>{{ btn.icon }}</v-icon>
						</v-btn>
						<v-divider v-else-if="btn.type === 'divider'" :key="'toolbar-item-' + i" vertical inset class="mx-3"></v-divider>
					</template>
					<v-divider inset vertical class="mx-3" />
					<v-btn title="Clear Format" icon small @click="editor.chain().focus().clearNodes().unsetAllMarks().run()">
						<v-icon>{{ mdiFormatClear }}</v-icon>
					</v-btn>
					<v-spacer />
				</v-toolbar>

				<editor-content v-if="isMounted" v-model="localValue" :editor="editor" class="flex-grow-1 d-flex flex-column" />
			</v-card>
			<v-dialog v-model="linkModal" max-width="400">
				<v-card>
					<v-card-title>{{ $t("common.link") }} </v-card-title>
					<v-card-text>
						<v-form v-model="isLinkFormValid"
							><v-text-field
								v-model="linkText"
								:rules="[$rules.required($t('common.url')), $rules.isValidURL($t('common.url'))]"
								:label="$t('common.url')"
						/></v-form>
					</v-card-text>
					<v-card-actions>
						<v-btn text @click="linkModal = false">{{ $t("common.cancel") }}</v-btn>
						<v-spacer />

						<v-btn text color="error" @click="removeLink">{{ $t("common.remove") }}</v-btn>
						<v-btn text :disabled="!isLinkFormValid" @click="setLink">{{ $t("common.ok") }}</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-input>
	</client-only>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import TextAlign from "@tiptap/extension-text-align";
// import TextDirection from "tiptap-text-direction-extension";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import field from "../mixins/field";
import { Extension } from "@tiptap/core";
import {
	mdiFormatBold,
	mdiFormatItalic,
	mdiFormatStrikethrough,
	mdiFormatAlignLeft,
	mdiFormatAlignCenter,
	mdiFormatAlignRight,
	mdiFormatListBulleted,
	mdiFormatListNumbered,
	mdiFormatPilcrowArrowRight,
	mdiFormatPilcrowArrowLeft,
	mdiFormatHeader2,
	mdiFormatHeader3,
	mdiFormatHeader4,
	mdiLink,
	mdiCodeJson,
	mdiFormatClear,
} from "@mdi/js";
const TextDirection = Extension.create({
	name: "textDirection",
	addOptions() {
		return {
			types: ["heading", "paragraph"],
			directions: ["ltr", "rtl", "auto"],
			defaultDirection: "auto",
		};
	},
	addGlobalAttributes() {
		return [
			{
				types: this.options.types,
				attributes: {
					dir: {
						default: this.options.defaultDirection,
						parseHTML: (element) => {
							if (element.attributes.dir && this.options.directions.includes(element.attributes.dir)) {
								return element.attributes.dir.value;
							} else {
								return this.options.defaultDirection;
							}
						},
						renderHTML: (attributes) => {
							return { dir: attributes.dir };
						},
					},
				},
			},
		];
	},
	addCommands() {
		return {
			setTextDirection:
				(direction) =>
				({ commands }) => {
					if (!this.options.directions.includes(direction)) {
						return false;
					}
					return this.options.types.every((type) => commands.updateAttributes(type, { dir: direction }));
				},
			unsetTextDirection:
				() =>
				({ commands }) => {
					return this.options.types.every((type) => commands.resetAttributes(type, "dir"));
				},
		};
	},
});
export default {
	components: {
		EditorContent,
	},
	mixins: [field],
	props: {
		value: {
			type: String,
			default: null,
		},
		rules: {
			type: Array,
			default: () => [],
		},
		showSuccess: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			mdiFormatClear,
			linkModal: false,
			isLinkFormValid: false,
			linkText: "",
			editor: null,
			isMounted: false,
			toolbar: [
				{
					icon: mdiFormatBold,
					title: "Bold",
					command: "toggleBold",
					activeStateName: "bold",
					type: "button",
				},
				{
					icon: mdiFormatItalic,
					title: "Italic",
					command: "toggleItalic",
					activeStateName: "italic",
					type: "button",
				},
				{
					icon: mdiFormatStrikethrough,
					title: "Strike",
					command: "toggleStrike",
					activeStateName: "strike",
					type: "button",
				},
				{
					type: "divider",
				},
				{
					icon: mdiFormatAlignLeft,
					title: "Align Left",
					command: "setTextAlign",
					commandParam: "left",
					activeStateName: {
						textAlign: "left",
					},
					type: "button",
				},
				{
					icon: mdiFormatAlignCenter,
					title: "Align Center",
					command: "setTextAlign",
					commandParam: "center",
					activeStateName: {
						textAlign: "center",
					},
					type: "button",
				},
				{
					icon: mdiFormatAlignRight,
					title: "Align Right",
					command: "setTextAlign",
					commandParam: "right",
					activeStateName: {
						textAlign: "right",
					},
					type: "button",
				},
				{
					type: "divider",
				},
				{
					icon: mdiFormatListBulleted,
					title: "Bullet List",
					command: "toggleBulletList",
					activeStateName: "bulletList",
					type: "button",
				},
				{
					icon: mdiFormatListNumbered,
					title: "Ordered List",
					command: "toggleOrderedList",
					activeStateName: "orderedList",
					type: "button",
				},
				{
					type: "divider",
				},
				{
					icon: mdiFormatPilcrowArrowRight,
					title: "Left to right",
					command: "setTextDirection",
					commandParam: "ltr",
					activeStateName: {
						text_direction: "ltr",
					},
					type: "button",
				},
				{
					icon: mdiFormatPilcrowArrowLeft,
					title: "Right to left",
					command: "setTextDirection",
					commandParam: "rtl",
					activeStateName: {
						text_direction: "rtl",
					},
					type: "button",
				},
				{
					type: "divider",
				},
				{
					icon: mdiFormatHeader2,
					title: "Heading 2",
					command: "toggleHeading",
					commandParam: {
						level: 2,
					},
					activeStateName: "heading",

					type: "button",
				},
				{
					icon: mdiFormatHeader3,
					title: "Heading 3",
					command: "toggleHeading",
					commandParam: {
						level: 3,
					},
					activeStateName: "heading",

					type: "button",
				},
				{
					icon: mdiFormatHeader4,
					title: "Heading 4",
					command: "toggleHeading",
					commandParam: {
						level: 4,
					},
					activeStateName: "heading",

					type: "button",
				},

				{
					type: "divider",
				},
				{
					icon: mdiLink,
					title: "Link",
					command: "toggleLink",
					activeStateName: "link",
					type: "link",
				},

				{
					icon: mdiCodeJson,
					title: "Code",
					command: "toggleCode",
					activeStateName: "code",
					type: "button",
				},
			],
		};
	},

	computed: {},
	watch: {
		value(value) {
			if (this.localValue !== value) {
				if (this.editor) this.editor.commands?.setContent(value);
			}
		},
	},
	mounted() {
		const self = this;
		this.editor = new Editor({
			extensions: [
				TextDirection.configure({
					types: ["heading", "paragraph", "bulletList", "orderedList"],
				}),
				StarterKit,
				TextAlign.configure({
					types: ["heading", "paragraph"],
				}),
				Link.configure({
					openOnClick: false,
				}),
			],
			content: self.localValue,
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				self.localValue = !html || html === "<p></p>" ? null : html;
			},
		});
		this.isMounted = true;
	},

	beforeDestroy() {
		this.editor.destroy();
	},
	methods: {
		showModal() {
			const previousUrl = this.editor.getAttributes("link").href;
			this.linkText = previousUrl;
			this.linkModal = true;
		},
		setLink() {
			// cancelled
			if (this.linkText === null) {
				return;
			}

			// empty
			if (this.linkText === "") {
				this.editor.chain().focus().extendMarkRange("link").unsetLink().run();

				return;
			}

			// update link
			this.editor.chain().focus().extendMarkRange("link").setLink({ href: this.linkText }).run();
			this.linkModal = false;
		},
		removeLink() {
			this.editor.chain().focus().extendMarkRange("link").unsetLink().run();
			this.linkModal = false;
		},
	},
};
</script>
<style>
.ProseMirror {
	flex-grow: 1;
	padding: 8px;
}
.ProseMirror p[dir="rtl"],
.ProseMirror h1[dir="rtl"],
.ProseMirror h2[dir="rtl"],
.ProseMirror h3[dir="rtl"],
.ProseMirror h4[dir="rtl"],
.ProseMirror h5[dir="rtl"],
.ProseMirror h6[dir="rtl"] {
	text-align: right;
}

.ProseMirror p[dir="ltr"],
.ProseMirror h1[dir="ltr"],
.ProseMirror h2[dir="ltr"],
.ProseMirror h3[dir="ltr"],
.ProseMirror h4[dir="ltr"],
.ProseMirror h5[dir="ltr"],
.ProseMirror h6[dir="ltr"] {
	text-align: left;
}
.ProseMirror-focused {
	outline: none;
}
.vc-wysiwyg .toolbar {
	min-height: 44px;
}
.vc-wysiwyg .toolbar .v-btn ~ .v-btn {
	margin-inline-end: 4px;
}
.vc-wysiwyg .toolbar .v-toolbar__content {
	flex-wrap: wrap;
	padding: 8px;
}
.vc-wysiwyg .toolbar .v-toolbar__content > .v-btn:first-child {
	margin: 0;
}
.ProseMirror ul,
.ProseMirror ol {
	padding: 0 24px !important;
}
</style>
