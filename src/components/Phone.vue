<template>
	<v-input
		class="phone-number-container d-flex align-start fill-width"
		dir="ltr"
		:value="valueAsString"
		:class="{ 'is-focused': ($refs.number && $refs.number.isFocused) || ($refs.code && $refs.code.isFocused) }"
		:rules="[...rules, isValid]"
		:label="label"
	>
		<v-autocomplete
			ref="code"
			v-model="localCodeAndIso"
			dir="rtl"
			class="code-field flex-grow-0 primary--text"
			:label="$t('common.phone-code')"
			style="width: auto; max-width: 130px"
			:class="{ 'v-input--is-focused': $refs.number && $refs.number.isFocused }"
			:items="countryCallingCode"
			item-value="iso"
			return-object
			:auto-select-first="true"
			:menu-props="{ dense: true }"
			:loading="isLoading"
			v-bind="keyPropsBus"
			hide-details
			single-line
			@click:clear="codeCleared"
			@change="switchToNumber"
			@keyup="ifEnter"
		>
			<!-- :error="$refs.number && $refs.number.hasError && $refs.number.hasState" -->
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
			single-line
			:prepend-inner-icon="$vuetify.icons.values.phone"
			v-bind="{ ...propsBus, rules: [], label: example || $t('common.please-select-country') }"
			:disabled="!localCode"
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
import field from "../mixins/field";
export default {
	mixins: [field],
	data() {
		return {
			iso: null,
			code: null,
			number: null,
			isLoading: false,
			valueAsString: null,
		};
	},
	props: {
		keyRules: {
			type: Array,
			default() {
				return [
					/*this.$rules.required(this.$t("fields.phoneNumber.keyAlt"))*/
				];
			},
		},
		numberRules: {
			type: Array,
			default() {
				return [
					/*this.$rules.required(this.$t("fields.phoneNumber.number")), this.$rules.minLength(this.$t("fields.phoneNumber.number"), 7)*/
				];
			},
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
		returnObject: {
			type: Boolean,
			default: true,
		},
	},

	computed: {
		localCodeAndIso: {
			get() {
				return { code: this.localCode, iso: this.localIso };
			},
			set(v) {
				this.localCode = v ? v.code : null;
				this.localIso = v ? v.iso : null;
			},
		},
		localCode: {
			get() {
				return this.code;
			},
			set(code) {
				this.$emit("update:code", code);

				this.localValue = { ...this.localValueObject, code };
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
				this.localValue = { ...this.localValueObject, number: v };
			},
		},
		localIso: {
			get() {
				return this.iso;
			},
			set(iso) {
				this.$emit("update:iso", iso);
				this.localValue = { ...this.localValueObject, iso };
			},
		},

		localValueObject: {
			get() {
				return { code: this.localCode, number: this.localNumber, iso: this.localIso };
			},
			set(v) {
				this.localValue = v;
			},
		},

		localValue: {
			get() {
				return this.value;
			},
			set(v) {
				const { code, number, iso } = v;
				this.iso = iso;
				this.code = code;
				this.number = number;
				this.$emit("input", v);

				this.valueAsString = this.formatString(v);
			},
		},

		countries() {
			return getCountries();
		},

		countryCallingCode() {
			return this.countries
				.map((iso) => {
					const code = getCountryCallingCode(iso);
					return {
						name: getName(iso, this.$i18n.locale, { select: "official" }) || iso,

						text: code + " " + getName(iso, "en", { select: "official" }) || iso,

						code,

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
		},
		selectCountryFirst() {
			if (!this.localCode) {
				return this.$t("errors.selectCountryFirst");
			} else {
				return null;
			}
		},
		isValid() {
			console.log("validating:", "+" + this.localCode + this.localNumber, this.localIso);
			if (this.localNumber) {
				// console.log("validating:", "+" + v.code + v.number, v.iso);
				return isValidPhoneNumber("+" + this.localCode + this.localNumber, this.localIso) || this.$t("errors.number-not-matching-country");
			} else {
				return true;
			}
		},
		example() {
			return this.localIso ? "Example: " + getExampleNumber(this.localIso, examples)?.nationalNumber || null : null;
		},
		keyPropsBus() {
			//filter label key out from the returned object
			const { label, ...rest } = this.propsBus;
			return rest;
		},
	},
	watch: {
		localValue: {
			deep: true,
			immediate: true,
			handler(v) {
				//make sure data is synced
				if (this.iso !== v.iso) this.iso = v.iso;
				if (this.code !== v.code) this.code = v.code;
				if (this.number !== v.number) this.number = v.number;

				this.valueAsString = this.formatString(v);
			},
		},
		valueAsString(v) {
			this.$emit("input-string", v);
		},
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
		formatString({ code, number, iso }) {
			return `+${code ? code : ""}${number ? number : ""}`;
		},
	},
};
</script>
<style lang="scss">
.phone-number-container {
	direction: ltr;
	margin-bottom: 8px;
	position: relative;
	& > .v-input__control {
		& > .v-input__slot {
			& > .v-label {
				left: -14px !important;
				right: auto !important;
				position: absolute !important;
				z-index: 1;
				//&.v-text-field .v-label--active {
				max-width: 133%;
				transform: translateY(-18px) scale(0.75);
				pointer-events: auto;
				//}
			}
		}
	}
	&.is-focused {
		label {
			color: var(--v-primary-base);
		}
	}
	.v-select__selections {
		flex-wrap: nowrap;
		direction: ltr;
	}
	.v-autocomplete.v-select input {
		min-width: 0;
	}
	&:hover > .v-input__control > .v-input__slot .v-input:not(.v-input--is-focused) .v-input__slot {
		fieldset {
			color: rgba(0, 0, 0, 0.86) !important;
		}
	}
	.code-field .v-input__slot {
		border-top-right-radius: 0 !important;
		border-bottom-right-radius: 0 !important;
		// background-color: #fff !important;
		fieldset {
			// background-color: #fafafa;
		}
	}
	.number-field {
		direction: rtl;
		position: unset !important;
		.v-input__slot {
			border-top-left-radius: 0 !important;
			border-bottom-left-radius: 0 !important;
			// background-color: #fff !important;
			padding: 0 !important;
			fieldset {
				border-left-width: 0 !important;

				legend {
					margin-right: 24px; //icon width
					margin-left: auto; //for firefox
				}
			}
			input {
				// text-align: left;
				direction: ltr;
			}
			label {
				right: -4px !important;
			}
		}
	}
}
.v-application--is-ltr .phone-number-container {
	.code-field .v-input__slot {
		fieldset {
			// background-color: #fafafa;
			border-right-width: 0 !important;
		}
	}
	.number-field {
		direction: ltr;
		.v-input__slot {
			border-top-left-radius: 0 !important;
			border-bottom-left-radius: 0 !important;
			// background-color: #fff !important;
			fieldset {
				border-left-width: 0 !important;

				legend {
					margin-left: 24px; //icon width
					margin-right: auto; //for firefox
				}
			}
		}

		label {
			left: 0 !important;
		}
	}
}
.v-application--is-rtl .phone-number-container {
	.code-field .v-input__slot {
		fieldset {
			// background-color: #fafafa;
			border-right-width: 0 !important;
		}
	}
	.number-field {
		.v-input__slot {
			fieldset {
				legend {
				}
			}
		}

		label {
		}
	}
}
</style>
