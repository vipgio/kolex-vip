module.exports = {
	experimental: {
		images: {
			allowFutureImage: true,
		},
	},
	images: {
		domains: ["cdn.epics.gg", "cdn2.epics.gg", "cdn.discordapp.com", "cdn.kolex.gg"],
		dangerouslyAllowSVG: true,
		// contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};
