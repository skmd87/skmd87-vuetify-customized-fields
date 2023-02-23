<template>
	<v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
		<template #activator="{ on, attrs }">
			<v-text-field v-model="localValue" readonly v-bind="{ ...propsBus, ...attrs }" v-on="on"></v-text-field>
		</template>
		<v-date-picker v-model="localValue" :max="localMax" @input="menu = false"></v-date-picker>
	</v-menu>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: "Date",
		},
		noFuture: {
			type: Boolean,
			default: false,
		},
		value: {
			type: String,
			default: "",
		},
		hours: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			menu: false,
		};
	},
	computed: {
		localValue: {
			get() {
				return this.value;
			},
			set(val) {
				this.$emit("input", val);
			},
		},
		localMax() {
			if (this.max) {
				return this.max;
			}

			if (this.noFuture) {
				return new Date().toISOString();
			}

			return undefined;
		},
	},
};
</script>
