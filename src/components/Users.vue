<template>
	<v-autocomplete
		v-model="localValue"
		:label="label"
		:search-input.sync="searchModel"
		:loading="$fetchState.pending"
		v-bind="$attrs"
		:items="localItems"
		clearable
		chips
		deletable-chips
		:hide-no-data="!searchModel"
		hide-selected
		:rules="rules"
		v-on="$listeners"
		@update:search-input="search"
	>
		<template #selection="data">
			<v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select" @click:close="remove(data.item)">
				<v-avatar left>
					<v-img :src="data.item.item.profile_pic"></v-img>
				</v-avatar>
				{{ data.item.text }}
			</v-chip>
		</template>
		<template #item="{ item, attrs, on }">
			<v-list-item v-bind="attrs" v-on="on">
				<!-- <v-list-item-avatar>
					<v-img :src="item.avatar" contain></v-img>
				</v-list-item-avatar> -->
				<avatar :src="item.profile_pic" class="me-2"></avatar>
				<v-list-item-content>
					<v-list-item-title v-html="item.text"></v-list-item-title>
					<v-list-item-subtitle v-text="item.meta.email"></v-list-item-subtitle>
				</v-list-item-content>
			</v-list-item>
		</template>
	</v-autocomplete>
</template>

<script>
import field from "../mixins/field";
export default {
	mixins: [field],
	props: {
		type: {
			type: String,
			default: undefined,
		},
	},
	data() {
		return {
			searchModel: null,
			timeout: null,
		};
	},
	async fetch() {
		// if (!this.searchModel) {
		// 	this.apiItems = [];
		// 	return;
		// }

		await this.$axios
			.$get(`/v2/lookups/users`, {
				params: {
					search: this.searchModel || undefined,
					ids: this.localValue?.length ? this.localValue.join() : undefined,
					type: this.type,
				},
			})
			.then((items) => {
				this.apiItems = items;
			});
	},
	computed: {
		localItems() {
			return this.apiItems;
		},
	},
	methods: {
		search(value) {
			// delay the fetch by 500 ms
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.$fetch();
			}, 500);
		},
		remove(item) {
			const index = this.friends.indexOf(item.name);
			if (index >= 0) this.friends.splice(index, 1);
		},
	},
};
</script>

