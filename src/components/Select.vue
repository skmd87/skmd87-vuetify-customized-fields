<template>
	<div class="d-flex" :class="{ 'flex-column': labelColumn, 'flex-row align-baseline': labelRow }">
		<custom-label v-if="customLabelPosition" :label="label" />
		<v-select v-model="localValue" v-bind="propsBus" v-on="$listeners">
			<template v-for="(slot, name) in $slots" :slot="name">
				<slot :name="name"></slot>
			</template>
			<template v-for="(slot, name) in $scopedSlots" :slot="name" slot-scope="slotData">
				<slot :name="name" v-bind="slotData"></slot>
			</template>
		</v-select>
	</div>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
	mounted() {
		console.log("scoped select", this.$scopedSlots, this.$slots);
	},
};
</script>
