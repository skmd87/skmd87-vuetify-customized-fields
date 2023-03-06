<template>
	<v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
		<template #activator="{ on, attrs }">
			<v-text-field v-model="localValue" readonly v-bind="{ ...propsBus, ...attrs }" v-on="on">
				<template v-for="(slot, name) in $scopedSlots" :slot="name">
					<slot :name="name" v-bind="item"></slot>
				</template>
			</v-text-field>
		</template>
		<v-date-picker v-model="localValue" :max="localMax" @input="menu = false">
			<template v-for="(slot, name) in $scopedSlots" :slot="name">
				<slot :name="name" v-bind="item"></slot>
			</template>
		</v-date-picker>
	</v-menu>
</template>

<script>
import field from "../mixins/field";
export default {
	mixins: [field],
	props: {
		noFuture: {
			type: Boolean,
			default: false,
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
