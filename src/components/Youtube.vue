<template>
	<span>
		<v-text-field
			v-bind="$attrs"
			ref="input"
			v-model="localValue"
			dense
			:label="$t('common.youtube-link')"
			:rules="[$rules.minLength($t('common.youtube-link'), 11), $rules.maxLength($t('common.youtube-link'), 11), ...rules]"
			placeholder="XXXXXXXXXX"
			:prefix="prefix"
			v-on="$listeners"
			@focus="onFocus"
			@blur="onBlur"
		>
			<template #append-outer>
				<v-btn plain height="28" :disabled="$refs.input && $refs.input.hasError" @click="showPreview">
					<v-icon left> mdi-youtube</v-icon>
					{{ $t("common.preview") }}
				</v-btn>
			</template>
		</v-text-field>
		<v-bottom-sheet v-model="previewModel" inset>
			<v-responsive :aspect-ratio="16 / 9"> <youtube-video :src="localValue" /> </v-responsive>
		</v-bottom-sheet>
	</span>
</template>

<script>
import field from "~/mixins/field";
export default {
	mixins: [field],
	data() {
		return {
			isFocused: false,
			previewModel: false,
		};
	},
	computed: {
		prefix() {
			return this.isFocused || this.localValue ? "https://www.youtube.com/watch?v=" : "";
		},
	},
	methods: {
		onFocus() {
			this.isFocused = true;
		},
		onBlur() {
			this.isFocused = false;
		},
		showPreview() {
			this.previewModel = true;
		},
	},
};
</script>

