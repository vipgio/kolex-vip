import { useRef, useEffect, useState, useContext } from "react";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import Meta from "@/components/Meta";
import Filters from "@/components/transactions/Filters";
import TransactionResults from "@/components/transactions/TransactionResults";

const Transactions = () => {
	const { fetchData } = useAxios();
	const { categoryId } = useContext(UserContext);
	const defaultFilters = {
		costType: "",
		min: "",
		max: "",
		income: true,
		expense: true,
		startDate: null,
		endDate: null,
	};
	const [filters, setFilters] = useState(defaultFilters);
	const [results, setResults] = useState([]);
	const [loading, setLoading] = useState(false);
	const [pageCounter, setPageCounter] = useState(1);
	const finished = useRef(false);

	const getTransactions = async (pageNumber) => {
		setPageCounter(pageNumber);
		try {
			const { result } = await fetchData({
				endpoint: `/api/users/transactions`,
				params: { page: pageNumber },
				forceCategoryId: true,
			});
			if (result.transactions.length === 50 && !finished.current) {
				setResults((prev) => [
					...prev,
					...result.transactions.filter((tr) => {
						return (
							tr.costType === filters.costType &&
							tr.created >= filters.startDate.toISOString() &&
							tr.created <= filters.endDate.toISOString()
						);
					}),
				]);
				if (result.transactions[0]?.created?.split("T")[0] < filters.startDate?.toISOString()?.split("T")[0]) {
					finished.current = true;
					setLoading(false);
				} else return await getTransactions(pageNumber + 1);
			} else {
				finished.current = true;
				setLoading(false);
				return;
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		return () => {
			setLoading(false);
			finished.current = true;
		};
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		setResults([]);
		setLoading(true);
		finished.current = false;
		getTransactions(1);
	};

	return (
		<>
			<Meta title='Transactions | Kolex VIP' />
			<Filters
				filters={filters}
				setFilters={setFilters}
				defaultFilters={defaultFilters}
				loading={loading}
				onSubmit={onSubmit}
			/>
			{loading ? (
				<div className='text-gray-custom mt-1 ml-1 w-full text-center'>
					Checking page {pageCounter} of your transactions...
				</div>
			) : null}
			{results.length > 0 ? <TransactionResults results={results} filters={filters} /> : null}
		</>
	);
};
export default Transactions;
