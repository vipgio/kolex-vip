import { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import { CDN } from "@/config/config";
import { useAxios } from "@/hooks/useAxios";
import { UserContext } from "@/context/UserContext";
import ImageWrapper from "@/HOC/ImageWrapper";

const CategorySelector = () => {
	const { user, categoryId, categories, setCategories, setCategoryId } = useContext(UserContext);
	const { fetchData } = useAxios();
	const router = useRouter();

	const getCategories = async () => {
		const { result } = await fetchData(`/api/categories`);
		result && setCategories(result.sort((a, b) => a.id - b.id));
		return result;
	};

	const changeCategory = (id) => {
		setCategoryId(id.toString());
		router.reload();
	};

	useEffect(() => {
		getCategories();
	}, []);
	return (
		<>
			<div className='h-12 w-12'>
				{user && (
					<Menu as='div' className='relative z-30 inline-block h-full w-12 text-left'>
						{({ open }) => (
							<>
								<Menu.Button className='my-outline text-smtext-gray-100 inline-flex h-12 w-full items-center justify-center rounded-full focus-visible:ring-inset'>
									{categories.length > 0 ? (
										<div
											style={{
												backgroundColor:
													categories.find((category) => category.id.toString() === categoryId).color || "#000",
											}}
											className='rounded-full'
										>
											<ImageWrapper
												src={
													CDN + categories.find((category) => category.id.toString() === categoryId).iconUrl
												}
												alt={categories.find((category) => category.id.toString() === categoryId).name}
												className='h-8 w-8'
												height={32}
												width={32}
												noPlaceHolder={true}
											/>
										</div>
									) : (
										<div>{categoryId}</div>
									)}
								</Menu.Button>

								<Transition
									show={open}
									enter='transition ease-out duration-100'
									enterFrom='transform opacity-0 scale-95'
									enterTo='transform opacity-100 scale-100'
									leave='transition ease-in duration-75'
									leaveFrom='transform opacity-100 scale-100'
									leaveTo='transform opacity-0 scale-95'
								>
									<Menu.Items className='absolute left-0 mt-1 flex w-48 origin-top-left flex-col gap-2 rounded-lg border border-gray-800 bg-gray-200 p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-200 dark:bg-gray-800'>
										{categories.map((category) => (
											<Menu.Items key={category.id}>
												<Menu.Item>
													{({ active }) => (
														<button
															className={`${
																active
																	? "bg-primary-500 fill-gray-200 text-gray-200 dark:bg-gray-300 dark:fill-gray-700 dark:text-gray-700"
																	: "text-gray-custom fill-gray-700 dark:fill-gray-200"
															} flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors active:bg-gray-800 active:shadow-md dark:active:bg-gray-300`}
															onClick={() =>
																categoryId !== category.id.toString() ? changeCategory(category.id) : null
															}
														>
															<div
																style={{ backgroundColor: category.color || "#000" }}
																className='inline-flex w-max flex-shrink-0 items-center rounded-full border border-gray-400'
															>
																<ImageWrapper
																	src={CDN + category.iconUrl}
																	alt={category.name}
																	className='h-8 w-8'
																	height={32}
																	width={32}
																	priority='true'
																	noPlaceHolder={true}
																/>
															</div>
															<div className='w-full font-normal'>{category.name}</div>
														</button>
													)}
												</Menu.Item>
											</Menu.Items>
										))}
									</Menu.Items>
								</Transition>
							</>
						)}
					</Menu>
				)}
			</div>
		</>
	);
};
export default CategorySelector;
