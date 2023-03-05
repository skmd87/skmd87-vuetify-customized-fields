<template>
	<div class="d-flex">
		<component
			v-model="localCountry"
			v-bind="propsBus"
			v-on="$listeners"
			:is="`${options.prefix}-autocomplete`"
			:api="options.api.countries + `?include=${localCountry || 0}`"
			api-search
			@input="reloadProvinces"
		></component>
		<component
			v-model="localProvince"
			v-bind="propsBus"
			v-on="$listeners"
			:is="`${options.prefix}-autocomplete`"
			ref="provinces"
			:api="options.api.provinces + `?country_id=${localCountry || 0}&include=${localProvince}`"
			:disabled="!localCountry"
		></component>
	</div>
</template>

<script>
import field from "../mixins/field";
export default {
	mixins: [field],
	props: {
		value: {
			type: Object,
			default: () => {
				return { country_id: null, province_id: null };
			},
		},
	},
	computed: {
		localValue: {
			get() {
				return this.value;
			},
			set(value) {
				return this.$emit("input", value || { country_id: null, province_id: null });
			},
		},
		localCountry: {
			get() {
				return this.value?.country_id;
			},
			set(value) {
				//this.localValue = { country_id: value, province_id: null };
			},
		},
		localProvince: {
			get() {
				return this.value?.province_id;
			},
			set(value) {
				//this.localValue = { country_id: this.localCountry, province_id: value };
			},
		},
	},
	methods: {
		reloadProvinces() {
			this.$refs.provinces.$fetch();
		},
	},
};
</script>
