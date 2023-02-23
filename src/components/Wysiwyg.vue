<template>
	<v-input :value="localValue" :rules="rules" @click="$emit('focus')">
		<div style="width: 100% !important">
			<field-label>{{ label }}</field-label>
			<tiptap-vuetify
				:key="key"
				v-model="localValue"
				:toolbar-attributes="toolbarProps"
				:extensions="extensions"
				:card-props="cardProps"
			/>
		</div>
	</v-input>
</template>

<script>
[object Promise]</script>
