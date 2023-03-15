<template>
	<!-- eslint-disable -->
	<v-text-field v-model="localValue" v-bind="propsBus">
	<template v-for="(slot, name) in $slots" :slot="name">
			<slot :name="name"></slot>
		</template>
		<template v-for="(slot, name) in $scopedSlots" :slot="name" slot-scope="slotData">
			<slot :name="name" v-bind="slotData"></slot>		
		</template>
	</v-text-field>
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

