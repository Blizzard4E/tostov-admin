<template>
	<div>
		<Dialog v-model:open="isOpen">
			<DialogTrigger>
				<Button> Create </Button>
			</DialogTrigger>
			<DialogContent class="sm:max-w-md">
				<form @submit.prevent="handleCreate">
					<DialogHeader>
						<DialogTitle>Create a business</DialogTitle>
						<DialogDescription>
							Create a location
						</DialogDescription>
					</DialogHeader>
					<div class="grid items-center w-full gap-4">
						<div class="flex flex-col space-y-1.5">
							<Label for="businessId">BusinessId</Label>
							<Input
								v-model="businessId"
								id="businessId"
								placeholder="businessId"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="name">Name</Label>
							<Input
								v-model="name"
								id="name"
								placeholder="name"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="address">Address</Label>
							<Input
								v-model="address"
								id="address"
								placeholder="address"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="gmapLink">GmapLink</Label>
							<Input
								v-model="gmapLink"
								id="gmapLink"
								placeholder="gmapLink"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="description">Description</Label>
							<Textarea
								v-model="description"
								id="description"
								placeholder="description"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="images">Images</Label>
							<Input
								type="file"
								@change="handleImageUpload"
								accept="image/*"
								multiple
								id="images"
								placeholder="images"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="videos">Videos</Label>
							<Input
								type="file"
								@change="handleVideoUpload"
								accept="video/*"
								multiple
								id="videos"
								placeholder="videos"
							/>
						</div>
					</div>
					<DialogFooter class="sm:justify-start">
						<div class="flex justify-between w-full">
							<DialogClose as-child>
								<Button type="button" variant="secondary">
									Cancel
								</Button>
							</DialogClose>
							<Button type="submit">Create</Button>
						</div>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	</div>
</template>

<script lang="ts" setup>
import { Text } from "vue";

const isOpen = ref();
const name = ref("");
const address = ref("");
const gmapLink = ref("");
const description = ref("");
const businessId = ref("");
const emit = defineEmits(["success"]);
const selectedImages = ref<File[]>([]);
const selectedVideos = ref<File[]>([]);

const handleCreate = async () => {
	const formData = new FormData();
	formData.append("name", name.value);
	formData.append("address", address.value);
	formData.append("gmapLink", gmapLink.value);
	formData.append("description", description.value);
	formData.append("businessId", businessId.value);
	selectedImages.value.forEach((image) => {
		formData.append("images", image);
	});
	selectedVideos.value.forEach((video) => {
		formData.append("videos", video);
	});
	const response = await $fetch("/api/locations/create", {
		method: "POST",
		body: formData,
	});
	console.log(response);
	if ("success" in response) {
		const { success } = response;
		if (success) {
			emit("success");
			name.value = "";
			address.value = "";
			gmapLink.value = "";
			description.value = "";
			businessId.value = "";
			selectedImages.value = [];
			selectedVideos.value = [];
			isOpen.value = false;
		}
	}
};
function handleImageUpload(event: Event) {
	const files = (event.target as HTMLInputElement).files;
	if (!files) return;

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (file.type.startsWith("image/")) {
			selectedImages.value.push(file);
		}
	}
}

function handleVideoUpload(event: Event) {
	const files = (event.target as HTMLInputElement).files;
	if (!files) return;

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		if (file.type.startsWith("video/")) {
			selectedVideos.value.push(file);
		}
	}
}
</script>

<style></style>
