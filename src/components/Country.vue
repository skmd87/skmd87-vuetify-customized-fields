<template>
	<component
		v-bind="propsBus"
		v-model="localValue"
		:label="label || $t('common.country')"
		api="/v1/lookups/countries"
		v-on="$listeners"
		:is="`${options.prefix}-autocomplete`"
	>
		<template v-for="(slot, name) in $scopedSlots" #[name]="item">
			<slot :name="name" v-bind="item"></slot>
		</template>
	</component>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
