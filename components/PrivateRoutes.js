import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

import FullPageLoader from "./FullPageLoader";
import { UserContext } from "../context/UserContext";

const PrivateRoute = ({ protectedRoutes, children }) => {
	const router = useRouter();
	const { user, initialLoading } = useContext(UserContext);

	const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

	useEffect(() => {
		if (!initialLoading && !user && pathIsProtected) {
			router.push("/");
		}
	}, [user, pathIsProtected, initialLoading]);

	if ((initialLoading || !user) && pathIsProtected) {
		return <FullPageLoader />;
	}

	return children;
};
export default PrivateRoute;
