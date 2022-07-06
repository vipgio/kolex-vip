import "../globals.css";
import UserContextProvider from "../context/UserContext";

function App({ Component, pageProps }) {
	return (
		<UserContextProvider>
			<Component {...pageProps} />
		</UserContextProvider>
	);
}

export default App;
