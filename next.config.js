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
	async headers() {
		return [
			{
				source: "/api/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, s-maxage=60",
					},
					{
						key: "Vary",
						value: "jwt",
					},
				],
			},
		];
	},
};
