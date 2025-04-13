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
							Create a business
						</DialogDescription>
					</DialogHeader>
					<div class="grid items-center w-full gap-4">
						<div class="flex flex-col space-y-1.5">
							<Label for="name">Name</Label>
							<Input
								v-model="name"
								id="name"
								placeholder="name"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="email">Email</Label>
							<Input
								v-model="email"
								id="email"
								placeholder="email@gmail.com"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="password">Password</Label>
							<Input
								v-model="password"
								id="password"
								placeholder="password"
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
const isOpen = ref();
const name = ref("");
const email = ref("");
const password = ref("");
const emit = defineEmits(["success"]);

const handleCreate = async () => {
	const response = await $fetch("/api/businesses/create", {
		method: "POST",
		body: {
			name: name.value,
			email: email.value,
			password: password.value,
		},
	});
	console.log(response);
	if ("success" in response) {
		const { success } = response;
		if (success) {
			emit("success");
			isOpen.value = false;
		}
	}
};
</script>

<style></style>
