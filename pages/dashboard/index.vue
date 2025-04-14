<template>
	<div>
		<div class="grid gap-4">
			<ClientOnly>
				<h1>Welcome, {{ userState?.name }}</h1></ClientOnly
			>
		</div>
	</div>
</template>

<script lang="ts" setup>
const { userState } = useAuth();
</script>

<style></style>
