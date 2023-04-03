<template>
	<label class="v-label ma-1 text--primary" style="font-size: 16px; font-weight: 400; min-height: 27px">{{ label }}</label>
</template>

<script>
export default {
	props: {
		label: {
			type: String,
			default: null,
		},
	},
};
</script>

