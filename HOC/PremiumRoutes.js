import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import FullPageLoader from "@/components/FullPageLoader";

const PrivateRoute = ({ premiumRoutes, children }) => {
	const router = useRouter();
	const { user, initialLoading } = useContext(UserContext);
	const pathIsProtected = premiumRoutes.includes(router.pathname);
	useEffect(() => {
		if (user && !user.info.allowed.includes(router.pathname.slice(1)) && pathIsProtected) {
			router.push("/");
		}
	}, [user]);

	if (initialLoading && pathIsProtected && !user) {
		return <FullPageLoader />;
	}

	return children;
};
export default PrivateRoute;
