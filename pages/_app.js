import "../globals.css";
import UserContextProvider from "../context/UserContext";
import PrivateRoute from "../components/PrivateRoutes";
import Layout from "../components/Layout";

const App = ({ Component, pageProps }) => {
	const protectedRoutes = ["/spinner", "/masslist", "/circulation", "/packs", "/profile"];
	return (
		<UserContextProvider>
			<Layout>
				<PrivateRoute protectedRoutes={protectedRoutes}>
					<Component {...pageProps} />
				</PrivateRoute>
			</Layout>
		</UserContextProvider>
	);
};

export default App;
