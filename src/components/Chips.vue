<template>
	<v-input class="chips" :value="value" :rules="rules">
		<div>
			<field-label>{{ label }}</field-label>
			<v-chip-group
				v-model="localValue"
				v-bind="propsBus"
				v-on="$listeners"
			>
				<v-chip
					v-for="item in parsedItems"
					:key="item.value"
					:value="item.value"
					:input-value="
						$attrs.multiple
							? value.includes(item.value)
							: value === item.value
					"
					filter
					outlined
					:color="item.color"
				>
					{{ item.text }}
				</v-chip>
			</v-chip-group>
		</div>
	</v-input>
</template>

<script>
[object Promise]</script>

<style scoped>
/* stylelint-disable-next-line */
.chips .v-chip-group .v-slide-group__content {
	padding: 0 !important;
}
</style>