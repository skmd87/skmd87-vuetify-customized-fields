<template>
	<!-- eslint-disable -->
	<v-text-field v-model="localValue" v-bind="propsBus"></v-text-field>
</template>

<script>
/* eslint-disable */
export default {
	inheritAttrs: false,
	props: {
		value: {
			type: [String, Number],
			default: null,
		},
	},
	computed: {
		localValue: {
			get() {
				return this.value;
			},
			set(value) {
				return this.$emit("input", value);
			},
		},
	},
};
</script>

