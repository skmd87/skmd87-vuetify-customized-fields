<template>
	<v-select v-model="localValue" v-bind="propsBus" v-on="$listeners">
		<template v-for="(slot, name) in $scopedSlots" :slot="name">
			<slot :name="name" v-bind="data"></slot>
		</template>
	</v-select>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
