import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import "../globals.css";
import UserContextProvider from "@/context/UserContext";
import ThemeContextProvider from "@/context/ThemeContext";
import RushContextProvider from "@/context/RushContext";
import PrivateRoute from "@/HOC/PrivateRoutes";
import PremiumRoutes from "@/HOC/PremiumRoutes";
import Layout from "@/components/Layout";

const App = ({ Component, pageProps }) => {
	const router = useRouter();
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
		"/rush",
		"/transfer",
		"/vip",
		"/delist",
		"/feed",
		"/transactions",
		"/trade",
		"/test",
	];
	const premiumRoutes = [
		"/packmanager",
		"/history",
		"/mintsearch",
		"/cardlister",
		"/transfer",
		"/vip",
		"/feed",
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
									<SpeedInsights route={router.pathname} />
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
