<template>
	<v-radio-group v-model="localValue" v-bind="propsBus">
		<v-radio
			v-for="item in localItems"
			:key="item.value"
			:value="item.value"
			:label="item.text"
		></v-radio>
	</v-radio-group>
</template>

<script>
[object Promise]</script>
