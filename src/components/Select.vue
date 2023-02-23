<template>
	<v-select v-model="localValue" v-bind="propsBus" v-on="$listeners"></v-select>
</template>
<script>
import field from "~/mixins/field";
export default {
	mixins: [field],
};
</script>
