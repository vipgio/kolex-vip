import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Circulation } from "./pages/Circulation";
import { PackSearch } from "./pages/PackSearch";
import { Spinner } from "./pages/Spinner";
import { Navbar } from "./components/Navbar";

function App() {
	const { user } = useContext(UserContext);
	return (
		<BrowserRouter>
			{user && (
				<div className='container relative mx-auto h-screen bg-gray-700'>
					<Navbar />
					<Routes>
						<Route index element={<Home user={user} />} />
						<Route path='/circulation' element={<Circulation />}></Route>
						<Route path='/packs' element={<PackSearch />}></Route>
						<Route path='/spinner' element={<Spinner />}></Route>
						{/* <Route index element={<Home />} /> */}
						{/* <Route path='teams' element={<Teams />}>
						<Route path=':teamId' element={<Team />} />
						<Route path='new' element={<NewTeamForm />} />
						<Route index element={<LeagueStandings />} />
					</Route> */}
						{/* </Route> */}
					</Routes>
				</div>
			)}
			{!user && (
				<div className='h-screen w-full overflow-auto bg-gray-700'>
					<Login />
				</div>
			)}
		</BrowserRouter>
	);
}

export default App;
