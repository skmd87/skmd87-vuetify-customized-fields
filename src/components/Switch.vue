<template>
	<v-switch v-model="localValue" v-bind="propsBus"></v-switch>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
