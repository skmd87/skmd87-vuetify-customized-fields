<template>
	<v-file-input v-model="localValue" v-bind="$attrs"></v-file-input>
</template>

<script>
export default {
	props: {
		value: {
			type: [Boolean],
			default: false,
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

