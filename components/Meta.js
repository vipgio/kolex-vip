import Head from "next/head";
import { useRouter } from "next/router";
import { server } from "@/config/config";

const Meta = ({
	title,
	keywords = "Kolex, Kolex Toolkit, Kolex.gg, Kolex.gg Toolkit",
	description = "An epic and kool toolkit for Kolex.gg",
	robots,
}) => {
	const router = useRouter();
	const currentUrl = `${server}${router.asPath}`;
	return (
		<Head>
			<link rel='icon' href='/favicon.ico' />
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<meta name='keywords' content={keywords} />
			<meta name='description' content={description} />
			<meta name='robots' content={robots} />
			<meta charSet='utf-8' />
			<meta property='og:image' content='https://i.imgur.com/ZCWNJwi.png' />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:url' content={currentUrl} />
			<meta name='google-site-verification' content='9AMGLYbdxkh1RPLt3m7cR4lX1aHKid51YCpdZlOLOE8' />
			<title>{title}</title>
		</Head>
	);
};

export default Meta;
