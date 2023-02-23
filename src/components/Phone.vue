<template>
	<v-input
		class="phone-number-container d-flex align-start fill-width"
		dir="ltr"
		:value="{ code, number, iso }"
		:class="{ 'is-focused': ($refs.number && $refs.number.isFocused) || ($refs.code && $refs.code.isFocused) }"
		:rules="[isValid]"
	>
		<v-autocomplete
			ref="code"
			v-model="localCode"
			dir="rtl"
			class="code-field flex-grow-0 primary--text"
			:label="label"
			style="width: auto; max-width: 130px"
			:class="{ 'v-input--is-focused': $refs.number && $refs.number.isFocused }"
			:items="countryCallingCode"
			return-object
			:auto-select-first="true"
			:menu-props="{ dense: true }"
			:loading="isLoading"
			:outlined="outlined"
			:dense="dense"
			hide-details
			:error="$refs.number && $refs.number.hasError && $refs.number.hasState"
			filled
			rounded
			flat
			@click:clear="codeCleared"
			@change="switchToNumber"
			@keyup="ifEnter"
		>
			<template #selection="{ item }">
				<span class="rounded mx-1" size="25">
					<v-img width="30" height="20" :src="'/flag-icons/flags/4x3/' + item.iso.toLowerCase() + '.svg'" class="rounded" />
				</span>
				<span dir="ltr">+{{ item.code }}</span>
			</template>
			<template #item="{ item }">
				<v-list-item-icon>
					<v-img width="30" height="20" :src="'/flag-icons/flags/4x3/' + item.iso.toLowerCase() + '.svg'" class="rounded" />
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>
						{{ item.name }} <span dir="ltr">(+{{ item.code }})</span>
					</v-list-item-title>
				</v-list-item-content>
			</template>
		</v-autocomplete>
		<v-text-field
			ref="number"
			v-model="localNumber"
			class="number-field text-left"
			dir="rtl"
			type="tel"
			style="min-width: 55%"
			:class="{ 'v-input--is-focused': $refs.code && $refs.code.isFocused }"
			:hint="selectCountryFirst"
			hide-details
			:outlined="outlined"
			:dense="dense"
			:placeholder="example"
			:error-messages="errorMessages"
			:prepend-inner-icon="$vuetify.icons.values.phone"
			filled
			rounded
			flat
			@keypress="onlyNumberKey"
			@input="pasteHandler"
			@paste="pasteHandler"
		></v-text-field>
	</v-input>
</template>

<script>
// import countryCodes from "country-data";
import { getCountries, getCountryCallingCode, isValidPhoneNumber, getExampleNumber } from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import { getName, registerLocale } from "i18n-iso-countries";

registerLocale(require("i18n-iso-countries/langs/en.json"));
registerLocale(require("i18n-iso-countries/langs/ar.json"));

export default {
	// mixins: [settings],
	props: {
		code: {
			type: [String],
			default: null,
		},
		number: {
			type: [String],
			default: null,
		},
		iso: {
			type: [String],
			default: null,
		},
		label: {
			type: String,
			default() {
				return this.$t("fields.phoneNumber.number");
			},
		},
		keyRules: {
			type: Array,
			default() {
				return [this.$rules.required(this.$t("fields.phoneNumber.keyAlt"))];
			},
		},
		numberRules: {
			type: Array,
			default() {
				return [
					this.$rules.required(this.$t("fields.phoneNumber.number")),
					this.$rules.minLength(this.$t("fields.phoneNumber.number"), 7),
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
		outlined: {
			type: Boolean,
			default: false,
		},
		dense: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			isLoading: false,
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
		countries() {
			return getCountries();
		},

		countryCallingCode() {
			return this.countries
				.map((iso) => {
					// const v = countryCodes[key];
					// console.log(v);
					const code = getCountryCallingCode(iso);
					return {
						name: getName(iso, this.$i18n.locale, { select: "official" }) || iso,
						// ...v,
						text: code + " " + getName(iso, "en", { select: "official" }) || iso,
						// (i18nCountries.getName(v.alpha2, this.locale) || v.name) +
						// ` ${v.countryCallingCodes[0]} `, // for search purpose
						code,
						// flag: this.flag(v.alpha3),
						// value: i, // must be unique, country calling codes are not unique
						iso,
					};
				})
				.sort(function (a, b) {
					if (a.text < b.text) {
						return -1;
					}
					if (a.text > b.text) {
						return 1;
					}
					return 0;
				});

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
		isValid() {
			console.log("validating:", "+" + this.code + this.number, this.iso);
			if (this.number) {
				// console.log("validating:", "+" + v.code + v.number, v.iso);
				return isValidPhoneNumber("+" + this.code + this.number, this.iso) || this.$t("errors.number-not-matching-country");
			} else {
				return true;
			}
		},
		example() {
			return this.iso ? "Example: " + getExampleNumber(this.iso, examples)?.nationalNumber || null : null;
		},
	},

	watch: {
		iso: {
			immediate: true,
			handler(k, before) {
				if (!this.code && this.localCode) {
					this.$emit("update:code", this.localCode.code);
				}
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
		// if (this.$store.state.initial.allCountries.length) {
		// 	return;
		// }
		// this.isLoading = true;
		// this.$axios
		// 	.$get("countries?classified=0")
		// 	.then((resp) => {
		// 		this.$store.commit("initial/setAllCountries", resp.responseData);
		// 	})
		// 	.finally(() => {
		// 		this.isLoading = false;
		// 	});
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
