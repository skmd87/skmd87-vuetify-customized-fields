<template>
	<div class="mb-5" :class="'password-' + _uid">
		<v-tooltip right :value="showTooltip">
			<template #activator="{ on }">
				<v-text-field
					v-bind="propsBus"
					v-model="localPassword"
					:dummy="on"
					:append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
					:type="showPassword ? 'text' : 'password'"
					:rules="[$rules.required('password'), hasAnyError]"
					:label="label || 'Password'"
					counter
					@click:append="showPassword = !showPassword"
					@focus="focusHandler"
					@blur="blurHandler"
				>
					<template v-for="(slot, name) in $scopedSlots" #[name]="item">
						<slot :name="name" v-bind="item"></slot>
					</template>
				</v-text-field>
				<v-sheet height="4">
					<v-progress-linear v-show="showTooltip" :value="progress" :color="color" rounded></v-progress-linear>
				</v-sheet>
			</template>
			<div>
				<v-icon v-if="hasLowerCase" left color="success">mdi-check</v-icon>
				<v-icon v-else left color="error">mdi-close</v-icon>
				<span>Lowercase</span>
			</div>
			<div>
				<v-icon v-if="hasUpperCase" left color="success">mdi-check</v-icon>
				<v-icon v-else left color="error">mdi-close</v-icon>
				<span>Uppercase</span>
			</div>
			<div>
				<v-icon v-if="hasNumber" left color="success">mdi-check</v-icon>
				<v-icon v-else left color="error">mdi-close</v-icon>
				<span> Number (0-9)</span>
			</div>
			<div>
				<v-icon v-if="hasSpecial" left color="success">mdi-check</v-icon>
				<v-icon v-else left color="error">mdi-close</v-icon>
				<span> Special Character (!@#$%^&*)</span>
			</div>
			<div>
				<v-icon v-if="hasLength" left color="success">mdi-check</v-icon>
				<v-icon v-else left color="error">mdi-close</v-icon>
				<span> At least 8 Character</span>
			</div>
		</v-tooltip>
	</div>
</template>

<script>
import field from "../mixins/field.js";
export default {
	name: "Password",
	mixins: [field],
	props: {
		value: {
			type: [String],
			default: null,
		},
	},
	data() {
		return {
			showPassword: false,
			userInputs: ["1", "2", "3", "4", "5"],
			showTooltip: false,
		};
	},
	computed: {
		localPassword: {
			get() {
				return this.value;
			},
			set(v) {
				this.$emit("input", v);
			},
		},
		hasLowerCase() {
			return this.localPassword && this.localPassword.match(/([a-z].*)|(.*[a-z])/);
		},
		hasUpperCase() {
			return this.localPassword && this.localPassword.match(/(.*[A-Z])|([A-Z].*)/);
		},
		hasNumber() {
			return this.localPassword && this.localPassword.match(/\d/);
		},
		hasSpecial() {
			return this.localPassword && this.localPassword.match(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/);
		},
		hasLength() {
			return this.localPassword && this.localPassword.length > 7;
		},
		progress() {
			// return Math.min(100, this.value?.length * 10) || 0;
			let strength = 0;

			if (this.hasLowerCase) {
				strength += 20;
			}
			if (this.hasUpperCase) {
				strength += 20;
			}
			if (this.hasNumber) {
				strength += 20;
			}
			if (this.hasSpecial) {
				strength += 20;
			}
			if (this.hasLength) {
				strength += 20;
			}
			return strength;
		},
		hasAnyError() {
			return (this.hasLowerCase && this.hasUpperCase && this.hasNumber && this.hasSpecial && this.hasLength) || "Please enter a valid password";
		},
		color() {
			return ["error", "error", "warning", "warning", "success"][Math.floor(this.progress / 20) - 1];
		},
	},
	created() {},
	methods: {
		showFeedback({ suggestions, warning }) {
			console.log("🙏", suggestions);
			console.log("⚠", warning);
		},
		showScore(score) {
			console.log("💯", score);
		},
		focusHandler() {
			this.showTooltip = true;
		},
		blurHandler() {
			this.showTooltip = false;
		},
	},
};
</script>

<style lang="scss" scoped>
.Password {
	max-width: 100% !important;
	margin: 0 auto;
}
</style>
