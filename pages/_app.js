import "../globals.css";
import UserContextProvider from "context/UserContext";
import PrivateRoute from "HOC/PrivateRoutes";
import PremiumRoutes from "HOC/PremiumRoutes";
import Layout from "components/Layout";
import ThemeContextProvider from "context/ThemeContext";

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
		"/cardlister",
	];
	const premiumRoutes = ["/masslist", "/history", "/mintsearch", "/cardlister"];
	return (
		<UserContextProvider>
			<ThemeContextProvider>
				<Layout>
					<PrivateRoute protectedRoutes={protectedRoutes}>
						<PremiumRoutes premiumRoutes={premiumRoutes}>
							<Component {...pageProps} />
						</PremiumRoutes>
					</PrivateRoute>
				</Layout>
			</ThemeContextProvider>
		</UserContextProvider>
	);
};

export default App;
