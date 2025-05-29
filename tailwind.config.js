/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
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
			inherit: colors.inherit,
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
		require("@tailwindcss/forms"),
		require("@headlessui/tailwindcss"),
		createThemes({
			csgo: {
				primary: {
					300: colors.blue[300],
					400: colors.blue[400],
					500: colors.blue[500],
					600: colors.blue[600],
					700: colors.blue[700],
				},
			},
			streamers: {
				primary: {
					300: colors.violet[300],
					400: colors.violet[400],
					500: colors.violet[500],
					600: colors.violet[600],
					700: colors.violet[700],
				},
			},
			pubg: {
				primary: {
					300: colors.orange[300],
					400: colors.orange[400],
					500: colors.orange[500],
					600: colors.orange[600],
					700: colors.orange[700],
				},
			},
			skgaming: {
				primary: {
					300: colors.purple[300],
					400: colors.purple[400],
					500: colors.purple[500],
					600: colors.purple[600],
					700: colors.purple[700],
				},
			},
			kingsleague: {
				primary: {
					300: colors.amber[300],
					400: colors.amber[400],
					500: colors.amber[500],
					600: colors.amber[600],
					700: colors.amber[700],
				},
			},
			hiroquest: {
				primary: {
					300: colors.emerald[300],
					400: colors.emerald[400],
					500: colors.emerald[500],
					600: colors.emerald[600],
					700: colors.emerald[700],
				},
			},
			csc: {
				primary: {
					300: colors.red[300],
					400: colors.red[400],
					500: colors.red[500],
					600: colors.red[600],
					700: colors.red[700],
				},
			},
			hro: {
				primary: {
					300: colors.green[300],
					400: colors.green[400],
					500: colors.green[500],
					600: colors.green[600],
					700: colors.green[700],
				},
			},
		}),
		plugin(function ({ addVariant }) {
			addVariant("hocus", ["&:hover", "&:focus"]);
		}),
	],
};
