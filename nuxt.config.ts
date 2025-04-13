import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	css: ["~/assets/css/tailwind.css", "~/assets/css/main.css"],

	vite: {
		plugins: [tailwindcss()],
	},

	modules: ["shadcn-nuxt", "@nuxtjs/color-mode", "@nuxt/fonts"],
	runtimeConfig: {
		// The private keys which are only available within server-side
		mysqlHost: "",
		mysqlPort: "",
		mysqlUser: "",
		mysqlPassword: "",
		mysqlDatabase: "",
		imagesLocation: "",
		videosLocation: "",
		// Keys within public, will be also exposed to the client-side
		public: {
			apiBase: "/api",
		},
	},
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: "",
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: "./components/ui",
	},
	colorMode: {
		classSuffix: "",
	},
	nitro: {
		preset: "node-server",
	},
});
