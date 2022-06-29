/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			keyframes: {
				rotate_ac: {
					"0%": { transform: "rotate(360deg)" },
					"100%": { transform: "rotate(0deg)" },
				},
			},
			animation: {
				"spin-ac": "rotate_ac 1.5s linear infinite",
			},
		},
	},
	plugins: [],
};
