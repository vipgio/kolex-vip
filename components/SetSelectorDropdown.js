import { useState, Fragment } from "react";
import {
	Menu as MenuInner,
	MenuItem as MenuItemInner,
	SubMenu as SubMenuInner,
	MenuButton,
	MenuDivider,
	FocusableItem,
	MenuGroup,
} from "@szhsin/react-menu";
import LoadingSpin from "./LoadingSpin";
// import "@szhsin/react-menu/dist/index.css";
const SetSelectorDropdown = ({ collections, setSelectedCollection }) => {
	const [filter, setFilter] = useState("");
	return (
		<div tabIndex={-1}>
			<Menu
				menuButton={
					<MenuButton className='m-2 box-border rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-800 shadow-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:bg-gray-800 dark:text-gray-100'>
						Select a collection
					</MenuButton>
				}
				boundingBoxPadding='10'
				onMenuChange={() => setFilter("")}
			>
				{!collections.length > 0 ? (
					<div className='flex justify-center'>
						<LoadingSpin />
					</div>
				) : (
					collections.map(([season, seasonCollections], index) => (
						<Fragment key={season}>
							{index !== 0 && <MenuDivider className='mx-2.5 my-1.5 h-px bg-gray-200' />}
							<SubMenu
								label={season}
								onMenuChange={() => setFilter("")}
								setDownOverflow
								overflow='auto'
								position='auto'
							>
								<MenuGroup takeOverflow>
									{seasonCollections.map(([tier, tierCollections], idx) => (
										<Fragment key={`${season}-${tier}`}>
											{idx !== 0 && (
												<MenuDivider className='mx-2.5 my-1.5 h-px bg-gray-200' />
											)}
											<SubMenu
												label={tier}
												onMenuChange={() => setFilter("")}
												setDownOverflow
												overflow='auto'
												position='anchor'
											>
												<FocusableItem>
													{({ ref }) => (
														<input
															ref={ref}
															type='text'
															placeholder='Type to filter'
															value={filter}
															onChange={(e) => setFilter(e.target.value)}
															className='mb-2 w-full rounded-md border border-gray-500 px-2.5 py-1.5'
														/>
													)}
												</FocusableItem>
												<MenuGroup takeOverflow>
													{tierCollections
														.filter((col) =>
															col.collection
																? col.collection.name
																		.toUpperCase()
																		.includes(filter.trim().toUpperCase())
																: true
														)
														.filter((col) =>
															!col.collection
																? col[0]
																		.toUpperCase()
																		.includes(filter.trim().toUpperCase())
																: true
														)

														.map((col, idx) => (
															<Fragment
																key={`${season}-${tier}-${
																	col.collection ? col.collection.id : col[0]
																}`}
															>
																{idx !== 0 && (
																	<MenuDivider className='mx-2.5 my-1.5 h-px bg-gray-200' />
																)}

																{col.collection ? ( // if collection is true, then it is a collection
																	<MenuItem
																		key={col.collection.name}
																		value={col}
																		onClick={(e) => setSelectedCollection(e.value)}
																	>
																		{col.collection.name}
																	</MenuItem>
																) : (
																	// if collection is false, then it is a set
																	<SubMenu label={col[0]}>
																		{col[1].map((subCol, idx) => (
																			<Fragment key={subCol.collection.name}>
																				{idx !== 0 && (
																					<MenuDivider className='mx-2.5 my-1.5 h-px bg-gray-200' />
																				)}
																				<MenuItem
																					key={subCol.collection.name}
																					value={subCol}
																					onClick={(e) => setSelectedCollection(e.value)}
																				>
																					{subCol.collection.name}
																				</MenuItem>
																			</Fragment>
																		))}
																	</SubMenu>
																)}
															</Fragment>
														))}
												</MenuGroup>
											</SubMenu>
										</Fragment>
									))}
								</MenuGroup>
							</SubMenu>
						</Fragment>
					))
				)}
			</Menu>
		</div>
	);
};
export default SetSelectorDropdown;

const menuClassName = ({ state }) =>
	`box-border absolute z-50 text-sm dark:bg-gray-800 bg-white p-1.5 border border-gray-700 dark:border-gray-100 rounded-md shadow-lg select-none focus:outline-none min-w-[12rem] ${
		state === "closed" && "hidden"
	} ${state === "opening" && "animate-fadeIn"} ${
		state === "closing" && "animate-fadeOut"
	}`;

const menuItemClassName = ({ hover, disabled, submenu }) =>
	`rounded-md px-3 py-1 focus:outline-none text-black dark:text-gray-100 flex items-center ${
		hover && "text-white bg-primary-500"
	} ${disabled && "text-gray-400"} ${
		submenu &&
		"relative after:content-['❯'] after:absolute text-black dark:text-gray-100 after:right-1"
	}`;

const Menu = (props) => (
	<MenuInner {...props} className='relative' menuClassName={menuClassName} />
);

const MenuItem = (props) => <MenuItemInner {...props} className={menuItemClassName} />;

const SubMenu = (props) => (
	<SubMenuInner
		{...props}
		offsetY={-7}
		className='relative'
		menuClassName={menuClassName}
		itemProps={{ className: menuItemClassName }}
	/>
);
