<template>
	<v-textarea v-model="localValue" v-bind="propsBus" v-on="$listeners"></v-textarea>
</template>
<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
