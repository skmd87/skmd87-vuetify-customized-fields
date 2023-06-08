<template>
	<div :class="'password-' + _uid">
		<div class="vc-password-container">
			<v-text-field
				:id="'password-field-' + _uid"
				v-bind="propsBus"
				v-model="localPassword"
				:append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
				:type="showPassword ? 'text' : 'password'"
				:rules="calculatedRules"
				:label="label || 'Password'"
				counter
				ref="input"
				@click:append="showPassword = !showPassword"
				@focus="focusHandler"
				@blur="blurHandler"
			>
				<template v-for="(slot, name) in $slots" :slot="name">
					<slot :name="name"></slot>
				</template>
				<template v-for="(slot, name) in $scopedSlots" :slot="name" slot-scope="slotData">
					<slot :name="name" v-bind="slotData"></slot>
				</template>
				<template #append>
					<v-progress-circular size="24" v-show="showTooltip" :value="progress" :color="color" rounded class="me-2">
						<span class="text-caption">{{ progress }}%</span>
					</v-progress-circular>
					<v-icon v-if="showPassword" @click="showPassword = !showPassword">mdi-eye-off</v-icon>
					<v-icon v-else @click="showPassword = !showPassword">mdi-eye</v-icon>
				</template>
			</v-text-field>
			<!-- <v-sheet color="transparent" class="strength-bar" :style="{ right: trimSides, left: trimSides  }">
				<v-progress-linear height="2" v-show="showTooltip" :value="progress" :color="color" rounded></v-progress-linear>
			</v-sheet> -->
		</div>

		<v-tooltip top :value="showTooltip" :activator="'#password-field-' + _uid">
			<template v-if="!noStrength">
				<div>
					<v-icon v-if="hasLowerCase" left color="success">{{ mdiCheck }}</v-icon>
					<v-icon v-else left color="error">{{ mdiClose }}</v-icon>
					<span>{{ $t("vc.lowercase") }}</span>
				</div>
				<div>
					<v-icon v-if="hasUpperCase" left color="success">{{ mdiCheck }}</v-icon>
					<v-icon v-else left color="error">{{ mdiClose }}</v-icon>
					<span>{{ $t("vc.uppercase") }}</span>
				</div>
				<div>
					<v-icon v-if="hasNumber" left color="success">{{ mdiCheck }}</v-icon>
					<v-icon v-else left color="error">{{ mdiClose }}</v-icon>
					<span>{{ $t("vc.number") }}</span>
				</div>
				<div>
					<v-icon v-if="hasSpecial" left color="success">{{ mdiCheck }}</v-icon>
					<v-icon v-else left color="error">{{ mdiClose }}</v-icon>
					<span> {{ $t("vc.special-char") }}</span>
				</div>
				<div>
					<v-icon v-if="hasLength" left color="success">{{ mdiCheck }}</v-icon>
					<v-icon v-else left color="error">{{ mdiClose }}</v-icon>
					<span> {{ $t("vc.min-number-of-char", { minNumber: 8 }) }} </span>
				</div>
			</template>
		</v-tooltip>
	</div>
</template>

<script>
import field from "../mixins/field.js";
import { mdiEye, mdiEyeOff, mdiClose, mdiCheck } from "@mdi/js";
export default {
	name: "Password",
	mixins: [field],
	props: {
		value: {
			type: [String],
			default: null,
		},
		noStrength: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			showPassword: false,
			userInputs: ["1", "2", "3", "4", "5"],
			showTooltip: false,
			mdiEye,
			mdiEyeOff,
			mdiClose,
			mdiCheck,
			trimSides: 0,
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
			if (this.noStrength) return false;
			return (
				(this.hasLowerCase && this.hasUpperCase && this.hasNumber && this.hasSpecial && this.hasLength) ||
				"Please enter a valid password"
			);
		},
		color() {
			return ["error", "error", "warning", "warning", "success"][Math.floor(this.progress / 20) - 1];
		},
		calculatedRules() {
			const r = [...this.rules];
			if (!this.noStrength) {
				r.push(this.hasAnyError);
			}
			return r;
		},
	},
	created() {},
	mounted() {
		this.detectBorderRadius();
	},
	methods: {
		showFeedback({ suggestions, warning }) {
			console.log("🙏", suggestions);
			console.log("⚠", warning);
		},
		showScore(score) {
			console.log("💯", score);
		},
		focusHandler() {
			if (this.noStrength) return;

			this.showTooltip = true;
		},
		blurHandler() {
			if (this.noStrength) return;

			this.showTooltip = false;
		},

		detectBorderRadius() {
			setTimeout(() => {
				console.log(this.$refs.input);
				//get computed style
				const element = this.$refs.input.$el;
				const cssObj = window.getComputedStyle(element, null);
				console.log("🚀 ~ file: Password.vue:183 ~ setTimeout ~ cssObj:", cssObj);
				this.trimSides = cssObj.getPropertyValue("border-radius");
			}, 5000);
		},
	},
};
</script>

<style lang="scss" scoped>
.Password {
	max-width: 100% !important;
	margin: 0 auto;
}
.vc-password-container {
	position: relative;
	.strength-bar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 17px;
	}
	.rounded-lg {
		left: 8px;
		right: 8px;
	}

	.v-text-field.v-input--dense ~ .strength-bar {
		bottom: 13px;
	}
	.v-text-field.v-input--dense.v-text-field--outlined ~ .strength-bar {
		bottom: 30px;
	}
}
</style>
