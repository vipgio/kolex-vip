import "../globals.css";
import UserContextProvider from "../context/UserContext";
import Layout from "../components/Layout";

function App({ Component, pageProps }) {
	return (
		<UserContextProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</UserContextProvider>
	);
}

export default App;
