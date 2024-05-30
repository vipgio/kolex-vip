import Head from "next/head";

const Meta = ({
	title,
	keywords = "Kolex, KolexGG, Kolexgg, Kolex Toolkit, Epics, EpicsGG, Epicsgg, Epics Toolkit",
	description = "An epic and kool toolkit for Kolex.gg",
	robots,
}) => {
	return (
		<Head>
			<meta name='viewport' content='width=device-width, initial-scale=1' />
			<meta name='keywords' content={keywords} />
			<meta name='description' content={description} />
			<meta name='robots' content={robots} />
			<meta charSet='utf-8' />
			<meta property='og:image' content='https://i.imgur.com/JzHKUOD.png' />
			<link rel='icon' href='/favicon.ico' />
			<title>{title}</title>
		</Head>
	);
};

export default Meta;
