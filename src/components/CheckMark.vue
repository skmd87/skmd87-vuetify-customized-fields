<template>
	<span>
		<v-icon v-if="localValue" color="success">{{ $icons.check }}</v-icon>
		<v-icon v-else color="error">{{ $icons.close }}</v-icon>
	</span>
</template>

<script>
import field from "../mixins/field";
export default {
	mixins: [field],
};
</script>
