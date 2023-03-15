<template>
	<v-text-field v-model="localValue" v-bind="propsBus" v-on="$listeners">
		<template v-for="(slot, name) in $slots" :slot="name">
			<slot :name="name"></slot>
		</template>
		<template v-for="(slot, name) in $scopedSlots" :slot="name" slot-scope="slotData">
			<slot :name="name" v-bind="slotData"></slot>		
		</template>
	</v-text-field>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
