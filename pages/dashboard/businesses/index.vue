<template>
	<div>
		<div class="flex justify-between">
			<h1 class="text-2xl font-bold">Business Management</h1>
			<BusinessCreate @success="refresh" />
		</div>
		<div>
			<Table>
				<TableCaption>A list of businesses.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead class="w-[100px]"> ID </TableHead>
						<TableHead> Name </TableHead>
						<TableHead>Email</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody v-if="data">
					<TableRow
						v-for="(business, index) in data.businesses"
						:key="index"
					>
						<TableCell class="font-medium">
							{{ business.id }}</TableCell
						>
						<TableCell>{{ business.name }}</TableCell>
						<TableCell>{{ business.email }}</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	</div>
</template>

<script lang="ts" setup>
interface Business {
	id: number;
	name: string;
	email: string;
}

interface ApiResponse {
	businesses: Business[];
	success: boolean;
}

const { data, status, refresh } = await useFetch<ApiResponse>(
	"/api/businesses",
	{
		method: "GET",
	}
);
console.log(data);
</script>

<style></style>
