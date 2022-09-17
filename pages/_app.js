import "../globals.css";
import UserContextProvider from "../context/UserContext";
import PrivateRoute from "../components/PrivateRoutes";
import PremiumRoutes from "../components/PremiumRoutes";
import Layout from "../components/Layout";

const App = ({ Component, pageProps }) => {
	const protectedRoutes = [
		"/spinner",
		"/masslist",
		"/circulation",
		"/packs",
		"/profile",
		"/history",
		"/scanner",
		"/mintsearch",
	];
	const premiumRoutes = ["/masslist", "/history", "/mintsearch"];
	return (
		<UserContextProvider>
			<Layout>
				<PrivateRoute protectedRoutes={protectedRoutes}>
					<PremiumRoutes premiumRoutes={premiumRoutes}>
						<Component {...pageProps} />
					</PremiumRoutes>
				</PrivateRoute>
			</Layout>
		</UserContextProvider>
	);
};

export default App;
