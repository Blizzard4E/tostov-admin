<template>
	<div>
		<div class="flex justify-between items-center mb-6">
			<h1 class="text-2xl font-bold">Locations Management</h1>
			<LocationsCreate @success="refresh" />
		</div>
		<div>
			<Table>
				<TableCaption>A list of business locations.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead class="w-[80px]">ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Address</TableHead>
						<TableHead>Business</TableHead>
						<TableHead>Description</TableHead>
						<TableHead class="w-[120px]">Images</TableHead>
						<TableHead class="w-[120px]">Videos</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody v-if="data">
					<TableRow
						v-for="(location, index) in data.locations"
						:key="index"
					>
						<TableCell class="font-medium">
							{{ location.id }}
						</TableCell>
						<TableCell>{{ location.name }}</TableCell>
						<TableCell>{{ location.address }}</TableCell>
						<TableCell>{{ location.businessId }}</TableCell>
						<TableCell>{{ location.description }}</TableCell>
						<TableCell>
							<div class="flex flex-col items-center">
								<h3
									v-for="image in location.images"
									class="truncate text-ellipsis max-w-[200px]"
								>
									{{ image.url }}
								</h3>
							</div>
						</TableCell>
						<TableCell>
							<div class="flex items-center">
								<h3
									v-for="video in location.videos"
									class="truncate text-ellipsis max-w-[200px]"
								>
									{{ video.url }}
								</h3>
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
				<TableBody v-else>
					<TableRow>
						<TableCell colspan="7" class="text-center py-10">
							<div
								v-if="status === 'pending'"
								class="flex justify-center"
							>
								<Loader2Icon
									class="h-6 w-6 animate-spin text-primary"
								/>
							</div>
							<div v-else class="text-muted-foreground">
								No locations found
							</div>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { EyeIcon, PencilIcon, TrashIcon, Loader2Icon } from "lucide-vue-next";

interface Location {
	id: number;
	name: string;
	address: string;
	gmapLink: string;
	description: string;
	businessId: number;
	createdAt: string;
	updatedAt: string;
	images?: {
		id: number;
		url: string;
		locationId: number;
		createdAt: string;
	}[];
	videos?: {
		id: number;
		url: string;
		locationId: number;
		createdAt: string;
	}[];
}

interface ApiResponse {
	locations: Location[];
}

const { data, status, refresh } = await useFetch<ApiResponse>(
	"/api/locations",
	{
		method: "GET",
	}
);
</script>
