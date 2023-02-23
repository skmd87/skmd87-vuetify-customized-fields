<template>
	<v-checkbox v-if="!items" v-model="localValue" v-bind="propsBus" :true-value="true" :false-value="false" v-on="$listeners"></v-checkbox>
	<div v-else class="d-flex">
		<v-checkbox
			v-for="item in items"
			v-bind="propsBus"
			:key="item.value"
			v-model="localValue"
			:value="item.value"
			:label="item.text"
			:true-value="true"
			:false-value="false"
		>
		<template v-for="(slot, name) in $scopedSlots" #[name]="item">
			<slot :name="name" v-bind="item"></slot>
		</template>
		</v-checkbox>
	</div>
</template>

<script>
export default {
	inheritAttrs: false,
	props: {
		value: {
			type: [Boolean],
			default: false,
		},
		items: {
			type: [Array],
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
