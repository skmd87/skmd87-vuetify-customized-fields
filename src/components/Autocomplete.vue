<template>
	<v-autocomplete v-model="localValue" v-bind="propsBus" :search-input.sync="searchInput" v-on="$listeners">
		
		<template v-for="(slot, name) in $slots" :slot="name">
			<slot :name="name"></slot>
		</template>
		<template v-for="(slot, name) in $scopedSlots" :slot="name" slot-scope="slotData">
			<slot :name="name" v-bind="slotData"></slot>		
		</template>
		</v-autocomplete>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
	props: {
		selectAll: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		isAllSelected() {
			return this.localItems.length === this.localValue.length;
		},
		isSomeSelected() {
			return this.localValue.length > 0 && !this.isAllSelected;
		},
		icon() {
			if (this.isAllSelected) return "mdi-checkbox-marked";
			if (this.isSomeSelected) return "mdi-minus-box";
			return "mdi-checkbox-blank-outline";
		},
	},
	methods: {
		toggle() {
			this.$nextTick(() => {
				if (this.isAllSelected) {
					this.localValue = [];
				} else {
					this.localValue = this.localItems.slice();
				}
			});
		},
	},

};
</script>
