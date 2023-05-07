<template>
	<v-checkbox v-if="!items" v-model="localValue" v-bind="propsBus" :true-value="true" :false-value="false" v-on="$listeners"></v-checkbox>
	<v-input v-model="localValue" v-bind="propsBus" :label="null" v-else class="v-input--checkbox-group">
		<div class="fill-width">
			<component :is="`${options.prefix}-legend`" v-if="label">{{ label }}</component>
			<div class="d-flex flex-wrap">
				<v-checkbox
					v-for="item in items"
					:key="item.value"
					v-model="localValue"
					:value="item.value"
					:label="item.text"
					:true-value="true"
					:false-value="false"
					class="me-4 mt-2"
				>
					<template v-for="(slot, name) in $slots" :slot="name">
						<slot :name="name"></slot>
					</template>
					<template v-for="(slot, name) in $scopedSlots" :slot="name" slot-scope="slotData">
						<slot :name="name" v-bind="slotData"></slot>
					</template>
				</v-checkbox>
			</div>
		</div>
	</v-input>
</template>

<script>
import field from "../mixins/field";
export default {
	mixins: [field],
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
	mounted() {
		console.log(this);
	},
};
</script>
<style scoped>
.v-input--checkbox-group legend.v-label {
	cursor: text;
	font-size: 14px;
	height: auto;
}
</style>