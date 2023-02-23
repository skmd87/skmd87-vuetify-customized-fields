<template>
	<v-autocomplete v-model="localValue" v-bind="propsBus" v-on="$listeners">
		<template v-if="selectAll" #prepend-item>
			<v-list-item ripple @mousedown.prevent @click="toggle">
				<v-list-item-action>
					<v-icon :color="localValue.length > 0 ? 'primary' : ''">
						{{ icon }}
					</v-icon>
				</v-list-item-action>
				<v-list-item-content>
					<v-list-item-title> Select All </v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-divider class="mt-2"></v-divider>
		</template>
	</v-autocomplete>
</template>
<script>
[object Promise]</script>
