<template>
	<div class="v-input--color">
		<div class="v-input--color__preview" :style="{ backgroundColor: localValue }"></div>
		<input type="color" v-model="localValue" v-bind="propsBus" v-on="$listeners" />
	</div>
</template>

<script>
export default {
	props: {
		value: {
			type: [String],
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
