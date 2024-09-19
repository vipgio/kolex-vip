import { useState, useEffect, useCallback } from "react";

function useLocalStorage(key, initialValue) {
	// State to store our value
	const [storedValue, setStoredValue] = useState(initialValue);

	// Function to safely access localStorage
	const getStoredItem = useCallback(() => {
		if (typeof window === "undefined") {
			return initialValue;
		}
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.warn(`Error reading localStorage key "${key}":`, error);
			return initialValue;
		}
	}, [key, initialValue]);

	// Initialize the state
	useEffect(() => {
		setStoredValue(getStoredItem());
	}, []);

	// Return a wrapped version of useState's setter function that ...
	// ... persists the new value to localStorage.
	const setValue = useCallback(
		(value) => {
			try {
				// Allow value to be a function so we have same API as useState
				const valueToStore = value instanceof Function ? value(storedValue) : value;
				// Save state
				setStoredValue(valueToStore);
				// Save to local storage
				if (typeof window !== "undefined") {
					localStorage.setItem(key, JSON.stringify(valueToStore));
				}
			} catch (error) {
				console.warn(`Error setting localStorage key "${key}":`, error);
			}
		},
		[key, storedValue]
	);

	return [storedValue, setValue];
}

export default useLocalStorage;
