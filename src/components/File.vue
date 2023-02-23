<template>
	<v-file-input v-model="localValue" v-bind="propsBus">
		<template v-for="(slot, name) in $scopedSlots" #[name]="item">
			<slot :name="name" v-bind="item"></slot>
		</template>
	</v-file-input>
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

