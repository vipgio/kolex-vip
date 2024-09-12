/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");
const { createThemes } = require("tw-colors");
module.exports = {
	content: ["./pages/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./HOC/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			keyframes: {
				fadeIn: {
					from: {
						opacity: 0,
						transform: "scale(.80)",
					},
				},
				fadeOut: {
					to: {
						opacity: 0,
						transform: "scale(.80)",
					},
				},
				rotate_ac: {
					"0%": { transform: "rotate(360deg)" },
					"100%": { transform: "rotate(0deg)" },
				},
			},
			animation: {
				"spin-ac": "rotate_ac 2s linear infinite",
				fadeIn: "fadeIn 0.1s ease-out",
				fadeOut: "fadeOut 0.15s ease-out forwards",
			},
		},
		screens: {
			xs: "420px",
			...defaultTheme.screens,
		},
		fontFamily: {
			comic: ['"Comic Sans MS"', '"Comic Sans"', "cursive"],
		},
	},
	plugins: [
		require("@headlessui/tailwindcss"),
		createThemes({
			csgo: {
				"primary-300": "#93c5fd",
				"primary-400": "#60a5fa",
				"primary-500": "#3b82f6",
				"primary-600": "#2563eb",
				"primary-700": "#1d4ed8",
			},
			streamers: {
				"primary-300": "#d8b4fe",
				"primary-400": "#a78bfa",
				"primary-500": "#8b5cf6",
				"primary-600": "#7c3aed",
				"primary-700": "#6d28d9",
			},
			pubg: {
				"primary-300": "#fdba74",
				"primary-400": "#fb923c",
				"primary-500": "#f97316",
				"primary-600": "#ea580c",
				"primary-700": "#c2410c",
			},
			skgaming: {
				"primary-300": "#d8b4fe",
				"primary-400": "#c084fc",
				"primary-500": "#a855f7",
				"primary-600": "#9333ea",
				"primary-700": "#7e22ce",
			},
			kingsleague: {
				"primary-300": "#67e8f9",
				"primary-400": "#22d3ee",
				"primary-500": "#06b6d4",
				"primary-600": "#0891b2",
				"primary-700": "#0e7490",
			},
			hiroquest: {
				"primary-300": "#6ee7b7",
				"primary-400": "#34d399",
				"primary-500": "#10b981",
				"primary-600": "#059669",
				"primary-700": "#047857",
			},
			csc: {
				"primary-300": "#fca5a5",
				"primary-400": "#f87171",
				"primary-500": "#ef4444",
				"primary-600": "#dc2626",
				"primary-700": "#b91c1c",
			},
		}),
	],
};
