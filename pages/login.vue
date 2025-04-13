<template>
	<div class="grid place-items-center h-screen">
		<form @submit.prevent="handleLogin">
			<Card class="w-[350px]">
				<CardHeader>
					<CardTitle>Login</CardTitle>
					<CardDescription>Login to admin dashboard</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="grid items-center w-full gap-4">
						<div class="flex flex-col space-y-1.5">
							<Label for="name">Email</Label>
							<Input
								v-model="email"
								id="email"
								placeholder="email@example.com"
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="name">Password</Label>
							<Input
								v-model="password"
								type="password"
								id="password"
								placeholder="password"
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter class="flex justify-end px-6 pb-6">
					<Button>Login</Button>
				</CardFooter>
			</Card>
		</form>
	</div>
</template>
<script setup lang="ts">
const email = ref("panhasuper@tostov.com");
const password = ref("tospanhatovna");

const handleLogin = async () => {
	console.log({
		email: email.value,
		password: password.value,
	});
	const response = await $fetch("/api/login", {
		method: "POST",
		body: {
			email: email.value,
			password: password.value,
		},
	});
	if ("admin" in response && "success" in response) {
		const { admin, success } = response;
		if (success) {
			navigateTo("/dashboard");
		}
	}
};
</script>
