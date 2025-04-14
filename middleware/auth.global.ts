export default defineNuxtRouteMiddleware(async (to, from) => {
	// Client-side handling for dashboard routes
	if (import.meta.client && to.path.startsWith("/dashboard")) {
		const { userState } = useAuth();

		try {
			// Get profile with your custom response format {status, data}
			const getProfile = await $fetch("/api/auth/get-profile", {
				ignoreResponseError: true,
			});

			if (getProfile.status == 200 && getProfile.data) {
				userState.value = getProfile.data;
			} else {
				userState.value = null;
				return navigateTo("/login");
			}
		} catch (error) {
			// Handle network errors or other unexpected failures
			console.error("Failed to fetch profile:", error);
			userState.value = null;
			return navigateTo("/login");
		}
		return;
	}

	// Server-side checking of httpOnly cookie
	const sessionToken = useCookie("admin_token");

	// Redirect logged-in users away from login page
	if (to.path.startsWith("/login") && sessionToken.value) {
		return navigateTo("/dashboard");
	}

	// Prevent access to dashboard without a session token
	if (to.path.startsWith("/dashboard") && !sessionToken.value) {
		return navigateTo("/login");
	}
});
