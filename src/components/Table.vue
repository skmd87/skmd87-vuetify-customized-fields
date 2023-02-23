<template>
	<div>
		<v-toolbar flat>
			<v-spacer></v-spacer>
			<v-btn v-if="configs.actionsEditButton" color="primary" @click="$refs.crud.new({})">{{ configs.addNewButton }}</v-btn>
		</v-toolbar>
		<v-data-table :headers="parsedColumns" :items="items">
			<template #item.actions="{ item }">
				<v-btn icon @click="$refs.crud.edit(item.id)"><v-icon>mdi-pencil</v-icon></v-btn>
				<v-btn icon @click="$refs.crud.delete(item.id)"><v-icon>mdi-close</v-icon></v-btn>
			</template>
		</v-data-table>
		<crud ref="crud" item-name="item" :api="configs.addNewApiUrl" @updated="$refs.dataTable.refresh()">
			<kyc-form :url="configs.addNewApiUrl" />
		</crud>
	</div>
</template>

<script>
export default {
	props: {
		configs: {
			type: Object,
			default: () => ({}),
		},
		items: {
			type: Array,
			default: () => [],
		},
		columns: {
			type: Array,
			default: () => [],
		},
	},
	computed: {
		parsedColumns() {
			return [...this.columns, { text: "", value: "actions" }];
		},
	},
};
</script>

