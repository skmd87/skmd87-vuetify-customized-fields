<template>
	<component
		v-bind="propsBus"
		v-model="localValue"
		:label="label || $t('common.country')"
		api="/v1/lookups/countries"
		v-on="$listeners"
		:is="`${options.prefix}-autocomplete`"
	>
		<template v-for="(slot, name) in $slots" :slot="name">
			<slot :name="name"></slot>
		</template>
		<template v-for="(slot, name) in $scopedSlots" :slot="name" slot-scope="slotData">
			<slot :name="name" v-bind="slotData"></slot>		
		</template>
	</component>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
