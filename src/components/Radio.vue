<template>
	<v-radio-group v-model="localValue" v-bind="propsBus">
		<v-radio v-for="item in localItems" :key="item.value" :value="item.value" :label="item.text">
			<template v-for="(slot, name) in $scopedSlots" #[name]="item">
				<slot :name="name" v-bind="item"></slot>
			</template>
		</v-radio>
	</v-radio-group>
</template>

<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
