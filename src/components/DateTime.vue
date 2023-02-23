<template>
	<!-- <v-menu v-model="menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
		<template #activator="{ on, attrs }">
			<v-text-field v-model="localValue" :label="label" readonly v-bind="{ ...$attrs, ...attrs }" v-on="on"></v-text-field>
		</template>
		<v-date-picker v-model="localValue" :max="localMax" @input="menu = false"></v-date-picker>
	</v-menu> -->
	<v-datetime-picker
		v-model="localValue"
		filled
		rounded
		dense
		flat
		v-bind="calculatedProps"
		:ok-text="$t('common.ok')"
		:clear-text="$t('common.clear')"
	>
		<template #dateIcon>
			<v-icon>mdi-calendar</v-icon>
		</template>
		<template #timeIcon>
			<v-icon>mdi-clock</v-icon>
		</template>
	</v-datetime-picker>
</template>

<script>
import field from "~/mixins/field";
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
		timeFormat: {
			type: String,
			default: "hh:mm a",
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
				if (!this.value) return null;
				return new Date(this.value);
			},
			set(val) {
				this.$emit("input", val.toISOString());
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
		calculatedProps() {
			if (typeof this.$attrs !== "object") {
				console.log("this.$attrs", this.$attrs);
				return {};
			}

			return {
				...this.$attrs,
				timeFormat: this.timeFormat,
				label: this.label,
				rules: this.rules,
				textFieldProps: {
					...this.$attrs?.textFieldProps,
					label: this.label,
					appendIcon: "mdi-calendar",
					filled: true,
					rounded: true,
					dense: true,
					flat: true,
				},
				datePickerProps: {
					...this.$attrs?.datePickerProps,
					max: this.localMax,
				},
				timePickerProps: {
					...this.$attrs?.timePickerProps,
					allowedHours: this.hours ? undefined : (hour) => hour < 12,
				},
			};
		},
	},
};
</script>
