<template>
	<label class="field-label"><slot /></label>
</template>

<script>
import field from "~/mixins/field";
export default {
	mixins: [field],
};
</script>

<style lang="scss">
label.field-label {
	font-size: 12.5px;
	// transform: scale(0.75) translateX(-12px);
	@include mode("color", rgba(0, 0, 0, 0.45), rgba(255, 255, 255, 0.7));
	width: 100%;
}
</style>