const options = JSON.parse(`<%= JSON.stringify(options) %>`);
// import { Legend } from "../components";
export default {
	fetchOnServer: false,
	// components: {
	// 	fieldLegend:Legend,
	// }, not working
	props: {
		value: {
			type: [String, Number, Array, Object, Boolean],
			default: null,
		},
		items: {
			type: [Array],
			default: null,
		},
		api: {
			type: [String],
			default: null,
		},
		rules: {
			type: [Array],
			default: () => [],
		},
		label: {
			type: [String],
			default: null,
		},
		error: {
			type: [Boolean],
			default: false,
		},
		errorMessages: {
			type: [Array],
			default: () => [],
		},
		apiSearch: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			apiItems: [],
			searchInput: null,
			defaultStyle: {
				dense: options.style.dense,
				filled: options.style.filled,
				rounded: options.style.rounded,
				flat: options.style.flat,
				outlined: options.style.outlined,
			},
			options,
		};
	},
	async fetch() {
		if (this.api) {
			this.apiItems = await this.$axios.$getOnce(this.api, {
				params: this.apiParams,
			});
		}
	},
	watch: {
		searchInput() {
			this.$fetch();
		}
	},
	computed: {
		localValue: {
			get() {
				return this.value;
			},
			set(value) {
				this.$emit("input", value);
			},
		},
		localItems() {
			return this.apiItems?.length > 0 ? this.apiItems : this.items || [];
		},
		propsBus() {
			return {
				items: this.localItems,
				rules: this.rules,
				label: this.label,
				error: this.error,
				errorMessages: this.errorMessages,
				loading: this.$fetchState?.pending,
				...this.defaultStyle,
				...this.$attrs,
			};
		},
		apiParams() {
			const params = {};
			if (this.apiSearch) {
				params.search = this.searchInput;
			}

			return params;
		},
	},
};
