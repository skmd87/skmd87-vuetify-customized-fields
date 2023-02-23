<template>
	<field-autocomplete
		v-bind="propsBus"
		v-model="localValue"
		:label="label || $t('common.country')"
		api="/v1/lookups/countries"
		v-on="$listeners"
	>
	</field-autocomplete>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
