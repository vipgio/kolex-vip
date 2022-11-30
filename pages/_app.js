import { Analytics } from "@vercel/analytics/react";
import "../globals.css";
import UserContextProvider from "context/UserContext";
import ThemeContextProvider from "context/ThemeContext";
import RushContextProvider from "context/RushContext";
import PrivateRoute from "HOC/PrivateRoutes";
import PremiumRoutes from "HOC/PremiumRoutes";
import Layout from "components/Layout";

const App = ({ Component, pageProps }) => {
	const protectedRoutes = [
		"/cardlister",
		"/circulation",
		"/crafting",
		"/history",
		"/packmanager",
		"/mintsearch",
		"/packs",
		"/profile",
		"/scanner",
		"/spinner",
		"/trades",
		"/rush",
		"/transfer",
	];
	const premiumRoutes = [
		"/packmanager",
		"/history",
		"/mintsearch",
		"/cardlister",
		"/trades",
		// "/accounttransfer",
	];
	return (
		<>
			<UserContextProvider>
				<ThemeContextProvider>
					<RushContextProvider>
						<Layout>
							<PrivateRoute protectedRoutes={protectedRoutes}>
								<PremiumRoutes premiumRoutes={premiumRoutes}>
									<Component {...pageProps} />
								</PremiumRoutes>
							</PrivateRoute>
						</Layout>
					</RushContextProvider>
				</ThemeContextProvider>
			</UserContextProvider>
			<Analytics />
		</>
	);
};

export default App;
