module.exports = {
	experimental: {
		images: {
			allowFutureImage: true,
		},
	},
	images: {
		domains: [
			"cdn.epics.gg",
			"cdn2.epics.gg",
			"cdn.discordapp.com",
			"cdn.kolex.gg",
			"i.imgur.com",
		],
		dangerouslyAllowSVG: true,
		// contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};
