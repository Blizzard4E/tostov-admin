<template>
	<div>
		<div class="flex justify-between">
			<h1 class="text-2xl font-bold">Category Management</h1>
			<CategoryCreate @success="refresh" />
		</div>
		<div>
			<Table>
				<TableCaption>A list of categories.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead class="w-[100px]"> ID </TableHead>
						<TableHead> Name </TableHead>
						<TableHead>Email</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody v-if="data && data.data">
					<TableRow
						v-for="(category, index) in data.data"
						:key="index"
					>
						<TableCell class="font-medium">
							{{ category.id }}</TableCell
						>
						<TableCell>{{ category.name }}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	</div>
</template>

<script lang="ts" setup>
interface Category {
	id: number;
	name: string;
	email: string;
}

interface ApiResponse {
	categories: Category[];
	success: boolean;
}

const { data, status, refresh } = await useFetch("/api/categories", {
	method: "GET",
});
console.log(data);
</script>

<style></style>
