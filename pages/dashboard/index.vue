<template>
	<div>
		<h1 class="text-2xl font-bold mb-4">Dashboord</h1>
		<div class="grid gap-4">
			<NuxtLink to="/dashboard/businesses">
				<Button>Businesses</Button>
			</NuxtLink>
			<NuxtLink to="/dashboard/locations">
				<Button>Locations</Button>
			</NuxtLink>
		</div>
	</div>
</template>

<script lang="ts" setup></script>

<style></style>
