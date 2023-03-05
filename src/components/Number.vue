<template>
	<v-text-field v-model="localValue" v-bind="propsBus" v-on="$listeners" type="number">
		<template v-for="(slot, name) in $scopedSlots" #[name]="item">
			<slot :name="name" v-bind="item"></slot>
		</template>
	</v-text-field>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
