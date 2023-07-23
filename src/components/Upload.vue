<template>
	<v-input
		ref="thisComp"
		:rules="rules"
		:label="label"
		class="upload-file"
		:hint="allowedFilesText"
		persistent-hint
		:value="internalValue"
		v-on="$listeners"
	>
		<div class="upload-images mb-4">
			<input
				ref="fileInput"
				type="file"
				:accept="types ? allowedFilesMime.join(', ') : undefined"
				class="d-none"
				multiple
				tabindex="-1"
				@change="onFileChanged"
			/>

			<transition-group name="list" tag="div" class="row">
				<template v-for="file in files">
					<v-col :key="'image-' + file.name" class="flex-grow-0">
						<v-hover>
							<template #default="{ hover }">
								<v-responsive :aspect-ratio="aspectRatio" :width="width">
									<v-card outlined width="100%" height="100%">
										<v-img v-if="file.preview" :src="file.preview" :aspect-ratio="aspectRatio" :width="width">
											<div
												class="w-100 fill-height d-flex align-center justify-center"
												:class="{ 'is-uploading': file.uploading }"
											>
												<v-scale-transition appear mode="out-in">
													<v-progress-circular
														v-if="file.uploading"
														:value="file.uploading"
														:size="70"
														color="rgb(255 255 255 / 70%)"
														width="5"
													>
														<div class="text-h6 font-weight-bold">{{ file.uploading }}%</div>
													</v-progress-circular>
												</v-scale-transition>
											</div>
										</v-img>
										<v-sheet v-else color="transparent" :width="100" :height="(100 * 3) / 4" class="pa-2">
											<div class="fi" :class="{ ['fi-' + file.ext]: true }">
												<div class="fi-content">{{ file.ext }}</div>
											</div>
										</v-sheet>
										<div v-tooltip="file.name" class="text-center text-caption line-clamp-1">{{ file.shortName }}</div>

										<v-fade-transition>
											<v-overlay v-if="hover" absolute opacity="0.8">
												<div class="d-flex text-center justify-space-around">
													<div class="text-caption">
														<v-btn
															v-tooltip="$t('common.delete')"
															:aria-label="$t('common.delete')"
															icon
															small
															class="px-2"
															color="white"
															@click="del(file.name)"
														>
															<v-icon>{{ options.icons.delete }}</v-icon>
														</v-btn>
													</div>
												</div>
											</v-overlay>
										</v-fade-transition>
									</v-card>
								</v-responsive>
							</template>
						</v-hover>
					</v-col>
				</template>
				<v-col v-if="remainingAllowed" key="add-file">
					<v-card light :color="color" flat class="d-flex justify-center align-center" :width="width" :height="width">
						<v-btn width="100%" height="100%" plain @click="upload">
							<div class="d-flex flex-column justify-center align-center">
								<v-icon x-large>{{ options.icons.add }}</v-icon>
								<div class="my-1">{{ $t("common.upload") }}</div>
							</div>
						</v-btn>
					</v-card>
				</v-col>
			</transition-group>
		</div>
	</v-input>
</template>

<script>
import mime from "mime-type/with-db";
require("css-file-icons/build/css-file-icons.css");
import field from "../mixins/field";
export default {
	mixins: [field],
	props: {
		value: {
			type: [String, Array],
			default: null,
		},
		max: {
			type: Number,
			default: 1,
		},
		types: {
			type: [Array, Boolean],
			default: false,
		},
		rules: {
			type: Array,
			default: () => [],
		},
		label: {
			type: String,
			default: null,
		},
		width: {
			type: [String, Number],
			default: 200,
		},
		aspectRatio: {
			type: [Number],
			default: 1,
		},
		color: {
			type: String,
			default: "rgb(240 240 240)",
		},
	},
	data() {
		return {
			category: false,
			imageUploader: null,
			minimumImageSize: 400,
			files: {},
		};
	},
	computed: {
		internalValue: {
			get() {
				return this.value;
			},
			set(v) {
				// console.trace("set");
				// alert("set");
				this.$emit("input", v);
			},
		},

		remainingAllowed() {
			if (Array.isArray(this.internalValue)) {
				return this.max - this.internalValue.length;
			} else if (typeof this.internalValue === "string") {
				return 0;
			} else {
				return 1;
			}
		},

		allowedFilesText() {
			if (!this.types) {
				return null; // return all files if no types are specified
			}
			// return string after the "/"
			// only {files} types are allowed
			return this.$t("hint.allowed-file-types", { files: this.types.join(", ") });
		},
		allowedFilesMime() {
			if (!this.types) {
				return [];
			}
			return this.types.map((item) => mime.contentType(item));
		},
		isMultiple() {
			return this.max > 1;
		},
	},
	watch: {
		value: {
			handler(now, before) {
				this.sync();
				if (Array.isArray(now) && Array.isArray(before)) {
					// get the deleted items
					const deleted = before.filter((item) => !now.includes(item));
					// delete the deleted items
					deleted.forEach((item) => {
						this.$delete(this.files, item);
					});
				} else if (now !== before) {
					this.$delete(this.files, before);
				}
			},
			immediate: true,
			deep: true,
		},
	},
	mounted() {
		//	this.sync();
	},
	methods: {
		upload() {
			this.$refs.fileInput.click();
		},
		onFileChanged(e) {
			for (let i = 0; e.target.files.length > i; i++) {
				if (e.target.files[i] instanceof File) {
					const ext = e.target.files[i].name.split(".").pop();
					if (this.remainingAllowed) {
						if (!this.types || this.types.includes(ext)) {
							const file = e.target.files[i];

							this.add(file);

							this.files[file.name].uploading = true;
							const formData = new FormData();
							formData.append("file", file);
							this.$axios
								.$post("/v1/upload-media", formData, {
									onUploadProgress: (progressEvent) => {
										const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

										this.files[file.name].uploading = percentCompleted;
									},
								})
								.then((resp) => {
									this.files[file.name].uploading = false;
									this.changeFileName(file.name, resp.file);
								})
								.catch((e) => {
									this.del(file.name);
									this.files[file.name].uploading = false;
									this.genericErrorHandler(e);
								});
						}
					}
				}
			}
			this.loading = false;

			this.$refs.fileInput.value = "";
		},
		changeFileName(oldKey, newKey) {
			if (this.isMultiple) {
				this.internalValue = this.internalValue.map((item) => {
					if (item === oldKey) {
						return newKey;
					}
					return item;
				});
			} else {
				this.internalValue = newKey;
			}
			this.$set(this.files, newKey, this.$cloneDeep(this.files[oldKey]));
			this.files[newKey].name = newKey;
			this.$delete(this.files, oldKey);
		},
		getImageDimensions(file) {
			return new Promise(function (resolve) {
				const i = new Image();
				i.onload = function () {
					resolve({ width: i.width, height: i.height });
				};
				i.src = file;
			});
		},
		del(file) {
			this.$confirm(this.$t("messages.confirm-delete-text"), { title: this.$t("messages.confirm-delete-title") }).then(
				(isAccepted) => {
					if (isAccepted) {
						if (this.isMultiple) {
							this.internalValue = this.internalValue.filter((item) => item !== file);
						} else {
							this.internalValue = null;
						}
						console.log("del", file, this.files);
						this.$delete(this.files, file);
					}
				}
			);
		},
		add(param) {
			let name;
			if (typeof param === "string") {
				name = param;
			} else {
				name = param.name;
			}

			if (this.files[name]) {
				return;
			}

			if (this.isMultiple) {
				if (!Array.isArray(this.internalValue)) {
					this.internalValue = [];
				}
				this.internalValue.push(name);
			} else {
				this.internalValue = name;
			}
			this.createFileObject(param);
		},

		toBase64(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});
		},
		sync() {
			// create files object based on internal value
			if (this.internalValue) {
				if (this.isMultiple) {
					this.internalValue.forEach((file) => {
						this.add(file);
					});
				} else if (typeof this.internalValue === "string") {
					this.add(this.internalValue);
				}
			}
		},
		createFileObject(param) {
			const file = {};
			let isAlreadyUploaded = false;
			const previewTypes = ["jpg", "jpeg", "png", "gif", "svg", "webp"];

			if (typeof param === "string") {
				// extract the filename from url
				isAlreadyUploaded = true;

				file.name = param;
				file.shortName = param.split("/").pop();
			} else {
				file.name = param.name;
				file.shortName = param.name;
			}

			file.ext = file.name.split(".").pop();
			if (previewTypes.includes(file.ext.toLowerCase())) {
				if (isAlreadyUploaded) {
					file.preview = param;
				} else {
					file.preview = URL.createObjectURL(param);
				}
			}

			file.uploading = 0;

			this.$set(this.files, file.name, file);
		},
	},
};
</script>
<style lang="scss">
.upload-images {
	border: 1px solid transparent;
	padding: 8px;
}
.v-input--has-state.error--text .upload-images {
	border: 1px solid #dd2c00;
}
.upload-file {
	padding-top: 12px;
	.v-label {
		position: absolute !important;
		transform: translateY(-24px);
		top: 8px;
		font-size: 14px;
		@include dir("transform-origin", top left, top right);
		@include dir("left", 0 !important, auto !important);
		@include dir("right", auto !important, 0!important);
	}
	.is-uploading {
		background-color: rgba(0, 0, 0, 0.5);
	}
}
.fi.large {
	width: 69px;
	height: 75px;
	padding: 33.5px 0.3em 0;
	.fi-content {
		padding-top: 42px;
		font-size: 18px;
	}
}
</style>
