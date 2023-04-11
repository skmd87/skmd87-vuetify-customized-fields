<template>
	<v-text-field v-model="localNumber" v-bind="propsBus" class="vc-phone" type="number" hideSpinButtons :placeholder="example">
		<template v-slot:prepend-inner>
			<v-autocomplete
				v-model="localCodeAndIso"
				dir="ltr"
				placeholder="Code"
				:items="countries"
				style="max-width: 130px"
				background-color="transparent"
				:search-input="searchModel"
				no-filter
				hide-details
				solo
				flat
				dense
				class="mt-0"
				ref="autocomplete"
				@keydown.enter.prevent="handleEnter"
			>
				<template #selection="{ item }">
					<span class="mx-1" size="25">
						<v-img width="30" height="20" :src="item.meta.flag" class="rounded" />
					</span>
					<span dir="ltr">+{{ item.value.code }}</span>
				</template>

				<template #prepend-item>
					<v-list-item>
						<v-text-field
							autofocus
							clearable
							dense
							solo
							v-model="searchModel"
							@input="highlightFirstItem"
							label="Search"
						></v-text-field>
					</v-list-item>
				</template>
				<template #item="{ item }">
					<v-list-item-icon>
						<v-img width="30" height="20" :src="item.meta.flag" class="rounded" />
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>
							{{ item.text }} <span dir="ltr">(+{{ item.value.code }})</span>
						</v-list-item-title>
					</v-list-item-content>
				</template>
			</v-autocomplete>
		</template>
	</v-text-field>
</template>

<script>
import field from "../mixins/field";
import { getCountries, getCountryCallingCode, isValidPhoneNumber, getExampleNumber } from "libphonenumber-js";
import examples from "libphonenumber-js/mobile/examples";
import { getName, registerLocale } from "i18n-iso-countries";
import path from "path";

export default {
	mixins: [field],
	data: () => ({
		searchModel: "",
		iso: null,
		code: null,
		number: null,
		isLoading: false,
		valueAsString: null,
	}),
	computed: {
		localCodeAndIso: {
			get() {
				return { code: this.localCode, iso: this.localIso };
			},
			set(v) {
				console.log(v);
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

		countriesISO() {
			return getCountries();
		},
		countries() {
			const countries = this.countriesISO
				.map((iso) => {
					const code = getCountryCallingCode(iso);

					return {
						text: getName(iso, this.$i18n.locale, { select: "official" }) || iso,
						value: {
							code,
							iso,
						},
						meta: {
							flag: iso ? require(`../images/flags/${iso.toLowerCase()}.svg`) : null,
						},

						//test: path.resolve(`~/src/images/flags/4x3/${iso.toLowerCase()}.svg`),
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

			if (this.searchModel) {
				const loweredSearchModel = this.searchModel.toLowerCase();
				return countries.filter(
					(c) => c.text.toLowerCase().includes(loweredSearchModel) || c.value.code.includes(loweredSearchModel)
				);
			} else {
				return countries;
			}
		},
		example() {
			return this.localIso
				? this.$t("rules.phone-example", { phone: getExampleNumber(this.localIso, examples)?.nationalNumber }) || null
				: null;
		},
	},
	watch: {
		localValue: {
			deep: true,
			immediate: true,
			handler(v) {
				//make sure data is synced
				if (!v) return;
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
		valueComparator(a, b) {
			console.log("a", a);
			console.log("b", b);
			return a.code === b.code && a.iso === b.iso;
		},
		handleEnter() {
			if (this.$refs.autocomplete && this.$refs.autocomplete.items.length > 0) {
				const highlightedIndex = this.$refs.autocomplete.highlightedIndex;
				if (highlightedIndex !== null && highlightedIndex >= 0) {
					this.selectedItem = this.$refs.autocomplete.items[highlightedIndex];
				} else {
					this.selectedItem = this.$refs.autocomplete.items[0];
				}
			}
		},
		highlightFirstItem() {
			if (this.$refs.autocomplete) {
				this.$nextTick(() => {
					// const menuItems = this.$refs.autocomplete.menuItems;
					// if (menuItems && menuItems.length > 0) {
					// 	this.$refs.autocomplete.activateMenu();
					// 	this.$refs.autocomplete.setMenuIndex(0);
					// }
					console.log(
						"test",
						this.$refs.autocomplete.$refs.menu.$children[0].$children[0].$children[0].$children[1].$attrs.tabindex
					);
					this.$refs.autocomplete.setMenuIndex(0);
				});
			}
		},
	},
};
</script>

<style lang="scss">
.vc-phone {
	&.v-text-field--full-width .v-input__prepend-outer,
	&.v-text-field--full-width .v-input__prepend-inner,
	&.v-text-field--full-width .v-input__append-inner,
	&.v-text-field--full-width .v-input__append-outer,
	&.v-text-field--enclosed .v-input__prepend-outer,
	&.v-text-field--enclosed .v-input__prepend-inner,
	&.v-text-field--enclosed .v-input__append-inner,
	&.v-text-field--enclosed .v-input__append-outer,
	&.v-text-field--enclosed.v-input--dense:not(.v-text-field--solo).v-text-field--outlined .v-input__prepend-inner {
		margin: auto 0;
	}
	// .v-input__prepend-inner {
	// 	position: relative;
	// 	width: 130px;
	// 	div {
	// 		position: absolute;
	// 		top: 50%;
	// 		left: 0;
	// 		right: 0;
	// 		transform: translate(0, -50%);
	// 		z-index: 1;
	// 	}
	// }
}
</style>