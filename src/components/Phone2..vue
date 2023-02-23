<template>
	<v-input
		ref="mainInput"
		:value="{ code, number, iso }"
		:rules="rules"
		class="phone-number-container 2 has-icon d-flex align-start fill-width"
		dir="ltr"
	>
		<v-text-field
			class="code-field"
			style="max-width: 100px"
			:label="' ' + $t('fields.phoneNumber.key')"
			readonly
			hide-details
			dir="ltr"
			single-line
			:value="'+' + code"
			height="36"
			outlined
			dense
		>
			<template #append>
				<v-img class="flag" position="left center" width="30" :aspect-ratio="16 / 10" :src="localCode && localCode.flag"></v-img>
			</template>
		</v-text-field>
		<v-text-field
			ref="number"
			v-model="localNumber"
			class="number-field text-left"
			type="tel"
			style="min-width: 55%"
			:label="label"
			:hint="selectCountryFirst"
			hide-details
			:error-messages="errorMessages"
			:single-line="singleLine"
			dense
			outlined
			:prepend-inner-icon="$vuetify.icons.values.phone"
			@keypress="onlyNumberKey"
			@input="pasteHandler"
			@paste="pasteHandler"
		></v-text-field>
	</v-input>
</template>

<script>
// import countryCodes from "country-data";
// import { getName, registerLocale } from "i18n-iso-countries";

const validator = () => import("libphonenumber-js");
// const i18nCountries = { getName, registerLocale };
// import rules from "~/mixins/rules";
export default {
	props: {
		code: {
			type: [String, Number],
			default: null,
		},
		number: {
			type: [String, Number],
			default: null,
		},
		iso: {
			type: [String],
			default: null,
		},
		label: {
			type: String,
			default() {
				return "Phone";
			},
		},
		numberRules: {
			type: Array,
			default() {
				return [
					// this.$rules.required(this.$t("fields.phoneNumber.number")),
				];
			},
		},
		rules: {
			type: Array,
			default() {
				return [
					// (v) => {
					//     return this.$rules.required(this.$t("fields.phoneNumber.keyAlt"))(v.code);
					// },
					(v) => {
						if (this.required) {
							return this.$rules.required(this.$t("fields.phoneNumber.number"))(v.number);
						} else {
							return true;
						}
					},

					(v) => {
						if (!this.lib || !this.lib.isValidPhoneNumber) {
							return true;
						}
						if (v.number) {
							// console.log("validating:", "+" + v.code + v.number, v.iso);
							return (
								this.lib.isValidPhoneNumber("+" + v.code + v.number, v.iso) || this.$t("errors.number-not-matching-country")
							);
						} else {
							return true;
						}
					},
					...this.numberRules,
				];
			},
		},

		errorMessages: {
			type: [String, Array],
			default: null,
		},
		extendRules: {
			type: Array,
			default: () => [],
		},
		currentCountryOnly: {
			type: Boolean,
			default: null,
		},
		singleLine: {
			type: Boolean,
			default: false,
		},
		required: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			isLoading: false,
			lib: null,
		};
	},
	computed: {
		localCode: {
			get() {
				// console.log(this.countryCallingCode);
				const object = this.countryCallingCode.find((c) => {
					// console.log(c.iso);
					// console.log(this.iso);

					return c.iso === this.iso;
				});

				return object;
			},
			set(v) {
				this.$emit("update:code", v ? v.code : null);
				this.$emit("update:iso", v ? v.iso : null);
				this.$emit("update:id", v ? v.id : null);
			},
		},
		localNumber: {
			get() {
				return this.number;
			},
			set(v) {
				if (v && v[0] === "0") {
					v = v.substr(1);
				}
				this.$emit("update:number", v);
			},
		},
		countryCallingCode() {
			const countries = [];
			if (this.isLoading) return countries;
			// for (const key in this.$store.state.initial.countries) {
			// 	const v = this.$store.state.initial.countries[key];
			// 	countries.push({
			// 		// name: i18nCountries.getName(v.alpha2, this.locale) || v.name,
			// 		...v,
			// 		text: v.dialingCode + " " + v.label[this.locale],
			// 		// (i18nCountries.getName(v.alpha2, this.locale) || v.name) +
			// 		// ` ${v.countryCallingCodes[0]} `, // for search purpose
			// 		code: v.dialingCode,
			// 		// flag: this.flag(v.alpha3),
			// 		// value: i, // must be unique, country calling codes are not unique
			// 		iso: v.iso_a2,
			// 	});
			// }
			return countries;
			// (
			//     this.$store.state.initial.allCountries
			//         // .filter((v) => {
			//         //     return Array.isArray(v.countryCallingCodes) && v.countryCallingCodes.length;
			//         // })
			//         .map((v, i) => {
			//             return {
			//                 // name: i18nCountries.getName(v.alpha2, this.locale) || v.name,
			//                 ...v,
			//                 text: v.dialingCode + " " + v.label[this.locale],
			//                 // (i18nCountries.getName(v.alpha2, this.locale) || v.name) +
			//                 // ` ${v.countryCallingCodes[0]} `, // for search purpose
			//                 code: v.dialingCode,
			//                 // flag: this.flag(v.alpha3),
			//                 // value: i, // must be unique, country calling codes are not unique
			//                 iso: v.iso_a2,
			//             };
			//         })
			// );
			// .sort((a, b) => (a.text > b.text ? 1 : b.text > a.text ? -1 : 0))
		},
		selectCountryFirst() {
			if (!this.code) {
				return this.$t("errors.selectCountryFirst");
			} else {
				return null;
			}
		},
		// currentCountryItem() {
		//     const country = this.$lodash.cloneDeep(this.$store.state.initial.current.country);
		//     country.text = country.dialingCode + " " + country.label[this.locale];
		//     country.code = country.dialingCode;
		//     country.iso = country.iso_a2;
		//     return country;
		// },
	},

	watch: {
		iso: {
			immediate: true,
			handler(k, before) {
				// if (!this.code && this.localCode) {
				this.$emit("update:code", this.localCode?.code);
				// }
			},
		},
		// locale: {
		//     // immediate: true,
		//     handler(lang) {
		//         // i18nCountries.registerLocale(require(`i18n-iso-countries/langs/${lang}.json`));
		//     },
		// },
	},
	// beforeCreate() {
	//     if (process.browser) console.log(this.$i18n);
	//     this.$i18n.locales.forEach((locale) => {
	//         // i18nCountries.registerLocale(require(`i18n-iso-countries/langs/${locale.code}.json`));
	//     });
	// },
	mounted() {
		// if (this.currentCountryOnly) {
		//     this.localCode = this.currentCountryItem;
		// }
		validator().then((lib) => {
			this.lib = lib;
		});
	},
	methods: {
		codeCleared() {
			this.localCode = null;
			this.localNumber = null;
		},

		onlyNumberKey(evt) {
			// Only ASCII character in that range allowed
			const ASCIICode = evt.which ? evt.which : evt.keyCode;
			if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
				evt.preventDefault();
				return false;
			}
			return true;
		},
		pasteHandler(data, event) {
			// console.log(data, event);
			if (data && data.toString() && data.toString().match(/[^\d]/)) {
				// event.preventDefault();
				return false;
			}
		},
		switchToNumber() {
			if (this.localCode) {
				this.$refs.number.$refs.input.focus();
			}
		},
		ifEnter(e) {
			if (e.keyCode === 13) {
				this.switchToNumber();
			}
		},
	},
};
</script>
<style lang="scss">
@import "@/assets/phoneNumber.scss";
</style>
