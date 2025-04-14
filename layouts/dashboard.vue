<template>
	<div class="p-4">
		<nav class="flex justify-between w-full gap-4">
			<NuxtLink to="/dashboard" class="text-2xl font-bold"
				>TosTov Dashboard</NuxtLink
			>
			<div class="flex gap-4">
				<NuxtLink to="/dashboard/businesses">
					<Button>Businesses</Button>
				</NuxtLink>
				<NuxtLink to="/dashboard/locations">
					<Button>Locations</Button>
				</NuxtLink>
				<NuxtLink to="/dashboard/categories">
					<Button>Categories</Button>
				</NuxtLink>
			</div>
		</nav>
		<div class="pt-4"><slot /></div>
	</div>
</template>

<script lang="ts" setup></script>

<style></style>
