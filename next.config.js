module.exports = {
	experimental: {
		images: {
			allowFutureImage: true,
		},
	},
	images: {
		domains: ["cdn.kolex.gg", "i.imgur.com"],
		dangerouslyAllowSVG: true,
		// contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
};
