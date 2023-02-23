<template>
	<v-text-field v-model="localValue" v-bind="propsBus" v-on="$listeners"></v-text-field>
</template>
<script>
import field from "~/mixins/field";
export default {
	mixins: [field],
};
</script>
