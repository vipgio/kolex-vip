/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
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
			screens: {
				xs: "420px",
			},
			fontFamily: {
				comic: ['"Comic Sans MS"', '"Comic Sans"', "cursive"],
				sans: ["Helvetica", "Arial", "sans-serif"],
			},
		},
		colors: {
			transparent: "transparent",
			current: "currentColor",
			black: colors.black,
			white: colors.white,
			gray: colors.slate,
			slate: colors.slate,
			green: colors.green,
			yellow: colors.yellow,
			red: colors.red,
			blue: colors.blue,
			amber: colors.amber,
			orange: colors.orange,
		},
	},
	plugins: [
		require("@headlessui/tailwindcss"),
		createThemes({
			csgo: {
				//blue
				"primary-300": "hsl(212, 96%, 78%)",
				"primary-400": "hsl(213, 94%, 68%)",
				"primary-500": "hsl(217, 91%, 60%)",
				"primary-600": "hsl(221, 83%, 53%)",
				"primary-700": "hsl(224, 76%, 48%)",
			},
			streamers: {
				//violet
				"primary-300": "hsl(252, 95%, 85%)",
				"primary-400": "hsl(255, 92%, 76%)",
				"primary-500": "hsl(258, 90%, 66%)",
				"primary-600": "hsl(262, 83%, 58%)",
				"primary-700": "hsl(263, 70%, 50%)",
			},
			pubg: {
				//orange
				"primary-300": "hsl(31, 97%, 72%)",
				"primary-400": "hsl(27, 96%, 61%)",
				"primary-500": "hsl(25, 95%, 53%)",
				"primary-600": "hsl(21, 90%, 48%)",
				"primary-700": "hsl(17, 88%, 40%)",
			},
			skgaming: {
				//purple
				"primary-300": "hsl(269, 97%, 85%)",
				"primary-400": "hsl(270, 95%, 75%)",
				"primary-500": "hsl(271, 91%, 65%)",
				"primary-600": "hsl(271, 81%, 56%)",
				"primary-700": "hsl(272, 72%, 47%)",
			},
			kingsleague: {
				//cyan
				"primary-300": "hsl(187, 92%, 69%)",
				"primary-400": "hsl(188, 86%, 53%)",
				"primary-500": "hsl(189, 94%, 43%)",
				"primary-600": "hsl(192, 91%, 36%)",
				"primary-700": "hsl(193, 82%, 31%)",
			},
			hiroquest: {
				//emerald
				"primary-300": "hsl(156, 72%, 67%)",
				"primary-400": "hsl(158, 64%, 52%)",
				"primary-500": "hsl(160, 84%, 39%)",
				"primary-600": "hsl(161, 94%, 30%)",
				"primary-700": "hsl(163, 94%, 24%)",
			},
			csc: {
				//red
				"primary-300": "hsl(0, 94%, 82%)",
				"primary-400": "hsl(0, 91%, 71%)",
				"primary-500": "hsl(0, 84%, 60%)",
				"primary-600": "hsl(0, 72%, 51%)",
				"primary-700": "hsl(0, 74%, 42%)",
			},
		}),
	],
};
