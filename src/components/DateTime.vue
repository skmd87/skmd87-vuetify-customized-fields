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
[object Promise]</script>
