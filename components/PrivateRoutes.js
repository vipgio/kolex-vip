import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

import FullPageLoader from "./FullPageLoader";
import { UserContext } from "../context/UserContext";

const PrivateRoute = ({ protectedRoutes, children }) => {
	const router = useRouter();
	const { user } = useContext(UserContext);

	const pathIsProtected = protectedRoutes.indexOf(router.pathname) !== -1;

	useEffect(() => {
		if (!user && pathIsProtected) {
			// Redirect route, you can point this to /login
			router.push("/");
		}
	}, [user, pathIsProtected]);

	if (!user && pathIsProtected) {
		return <FullPageLoader />;
	}

	return children;
};
export default PrivateRoute;
