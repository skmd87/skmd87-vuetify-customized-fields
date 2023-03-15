<template>
	<v-input :value="localValue" :rules="rules" @click="$emit('focus')">
		<div style="width: 100% !important">
			<field-label>{{ label }}</field-label>
			<client-only>
				<!-- <tiptap v-model="localValue" /> -->
			</client-only>
		</div>
	</v-input>
</template>

<script>
import colors from "vuetify/es5/util/colors";
// import the component and the necessary extensions


import field from "../mixins/field";
export default {
	// specify TiptapVuetify component in "components"
	
	mixins: [field],
	
};
</script>
