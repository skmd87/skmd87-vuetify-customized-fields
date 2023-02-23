<template>
	<v-switch v-model="localValue" v-bind="propsBus">
		<template v-for="(slot, name) in $scopedSlots" #[name]="item">
			<slot :name="name" v-bind="item"></slot>
		</template>
	</v-switch>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
