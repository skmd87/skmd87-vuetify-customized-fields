<template>
	<v-autocomplete v-model="localValue" v-bind="propsBus" :search-input.sync="searchInput" v-on="$listeners">
		<template v-if="selectAll" #prepend-item>
			<v-list-item ripple @mousedown.prevent @click="toggle">
				<v-list-item-action>
					<v-icon :color="localValue.length > 0 ? 'primary' : ''">
						{{ icon }}
					</v-icon>
				</v-list-item-action>
				<v-list-item-content>
					<v-list-item-title> Select All </v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-divider class="mt-2"></v-divider>
		</template>
		<template v-for="(slot, name) in $scopedSlots" #[name]="item">
			<slot :name="name" v-bind="item"></slot>
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
