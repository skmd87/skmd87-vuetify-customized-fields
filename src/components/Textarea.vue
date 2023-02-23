<template>
	<v-textarea v-model="localValue" v-bind="propsBus" v-on="$listeners">
		<template v-for="(slot, name) in $scopedSlots" #[name]="item">
			<slot :name="name" v-bind="item"></slot>
		</template>
	</v-textarea>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
