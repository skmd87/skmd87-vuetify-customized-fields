<template>
	<v-input class="chips" :value="value" :rules="rules">
		<div>
			<field-label>{{ label }}</field-label>
			<v-chip-group v-model="localValue" v-bind="propsBus" v-on="$listeners">
				<v-chip
					v-for="item in parsedItems"
					:key="item.value"
					:value="item.value"
					:input-value="$attrs.multiple ? value.includes(item.value) : value === item.value"
					filter
					outlined
					:color="item.color"
				>
					{{ item.text }}
				</v-chip>
			</v-chip-group>
		</div>
	</v-input>
</template>

<script>
import field from "~/mixins/field";
export default {
	mixins: [field],
	computed: {
		parsedItems() {
			return this.localItems
				.filter((item) => item.selectable !== false)
				.map((item) => ({ value: item.value, text: item.text || this.$t(item.key), color: item.color }));
		},
	},
};
</script>

<style scoped>
/* stylelint-disable-next-line */
.chips .v-chip-group .v-slide-group__content {
	padding: 0 !important;
}
</style>