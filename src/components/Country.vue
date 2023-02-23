<template>
	<field-autocomplete
		v-bind="propsBus"
		v-model="localValue"
		:label="label || $t('common.country')"
		api="/v1/lookups/countries"
		v-on="$listeners"
	>
		<template v-for="(slot, name) in $scopedSlots" #[name]="item">
			<slot :name="name" v-bind="item"></slot>
		</template>
	</field-autocomplete>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
