/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./**/*.{js,jsx,ts,tsx}", "./*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			keyframes: {
				rotate_ac: {
					"0%": { transform: "rotate(360deg)" },
					"100%": { transform: "rotate(0deg)" },
				},
			},
			animation: {
				"spin-ac": "rotate_ac 2s linear infinite",
			},
		},
	},
	plugins: [],
};
