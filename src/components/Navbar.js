import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Link from "next/link";

export const Navbar = () => {
	const { active, setActive } = useContext(UserContext);

	return (
		<div className='h-12 bg-indigo-300 font-semibold text-gray-700'>
			<nav className='relative h-full'>
				<ul className='flex h-full items-center justify-around rounded-full rounded-b-md py-2'>
					<li onClick={() => setActive(1)} className='relative z-10'>
						<Link href='/'>
							<a className='group relative flex flex-col items-center justify-center transition-all duration-150'>
								<div
									className={`indicator translate-y-4 opacity-0 ${
										active === 1 && "-translate-y-1 opacity-100"
									}`}
								></div>
								<span
									className={`absolute -translate-y-4 opacity-0 transition-all duration-500 ${
										active === 1 && "-translate-y-[10px] opacity-100"
									}`}
								>
									Home
								</span>
								<svg
									viewBox='0 0 512 512'
									className={`h-4 w-4 transition-transform duration-500 ${
										active === 1 && "translate-y-8"
									}`}
								>
									<path d='M506.188,236.413L297.798,26.65c-0.267-0.27-0.544-0.532-0.826-0.786c-22.755-20.431-57.14-20.504-79.982-0.169 c-0.284,0.253-0.56,0.514-0.829,0.782L5.872,236.352c-7.818,7.804-7.831,20.467-0.028,28.285 c7.804,7.818,20.467,7.83,28.284,0.028L50,248.824v172.684c0,44.112,35.888,80,80,80h72c11.046,0,20-8.954,20-20v-163h70v163 c0,11.046,8.954,20,20,20h70c44.112,0,80-35.888,80-80c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20 c0,22.056-17.944,40-40,40h-50v-163c0-11.046-8.954-20-20-20H202c-11.046,0-20,8.954-20,20v163h-52c-22.056,0-40-17.944-40-40 v-212c0-0.2-0.003-0.399-0.009-0.597L243.946,55.26c7.493-6.363,18.483-6.339,25.947,0.055L422,208.425v113.083 c0,11.046,8.954,20,20,20c11.046,0,20-8.954,20-20v-72.82l15.812,15.917c3.909,3.935,9.047,5.904,14.188,5.904 c5.097,0,10.195-1.937,14.096-5.812C513.932,256.912,513.974,244.249,506.188,236.413z'></path>
								</svg>
							</a>
						</Link>
					</li>
					<li onClick={() => setActive(2)} className='relative z-10'>
						<Link href='/circulation'>
							<a className='group relative flex flex-col items-center justify-center transition-all duration-150'>
								<div
									className={`indicator translate-y-4 opacity-0 ${
										active === 2 && "-translate-y-1 opacity-100"
									}`}
								></div>

								<span
									className={`absolute -translate-y-4 opacity-0 transition-all duration-500 ${
										active === 2 && "-translate-y-[10px] opacity-100"
									}`}
								>
									Circulation
								</span>
								<svg
									viewBox='0 0 24 24'
									width='1em'
									height='1em'
									className={`transition-transform duration-500 ${
										active === 2 && "translate-y-8"
									}`}
								>
									<path d='M52.8,6.1L52.8,6.1c0-1.7,1.4-3,3-3h0.4h1.5h5.9c1.7,0,3,1.3,3,3v13c0,1.7-1.3,3-3,3l0,0l0,0h-2.1c-0.6,0-1-0.4-1-1 s0.4-1,1-1h2.1c0.6,0,1-0.4,1-1v-13c0-0.6-0.4-1-1-1h-5.9h-1.5h-0.4c-0.6,0-1,0.5-1,1v0.3l0,0l0,0v0.1l0,0v0.1l0,0 c0,0.5-0.5,0.9-1,0.9s-1-0.4-1-0.9V6.5l0,0L52.8,6.1L52.8,6.1z'></path>
									<path d='M18,1.6c-0.5-0.6-1.2-0.9-2.1-0.9L8.7,0.8c-2.3,0-4.1,1.9-4,4.1l0.2,11.9c0,0.6,0.2,1.2,0.6,1.7l0,0c0,0,0,0,0.1,0.1l0,0 l0,0l0,0l0,0l0.1,0.1C5.8,18.8,5.9,18.9,6,19l0.1,0.1c0.1,0,0.1,0.1,0.2,0.1c0.4,0.2,0.8,0.5,1.4,0.5s1-0.4,1-1 c0-0.5-0.3-0.8-0.8-0.9l0,0c-0.5-0.1-0.9-0.4-1-1L6.6,4.9c0-1.2,0.9-2.1,2.1-2.1l6.9-0.1c0.3,0,0.6,0.1,0.8,0.3 c0.2,0.2,0.4,0.4,0.7,0.4C18,3.5,18.6,2.3,18,1.6z'></path>
									<path d='M3.2,6.5C3.7,6.4,4,6,3.9,5.4s-0.5-0.9-1-0.9l0,0l0,0l0,0l0,0l0,0C1.1,4.8-0.2,6.3,0,8.1l1.4,12.7c0.2,1.6,1.6,2.8,3.3,2.7 L7,23.2l1.1-0.1C8.7,23,9,22.6,9,22c-0.1-0.6-0.5-1-1.1-0.9l-1.2,0.1l0,0l-2.2,0.2c-0.5,0.1-1-0.3-1.1-0.9L2,7.9 C2,7.2,2.6,6.6,3.2,6.5'></path>
									<path d='M0.5,5.6'></path>
									<path d='M13.3,3.7c-1.6-0.2-3.1,1.1-3.3,2.7L8.8,19.3c-0.2,1.6,1,3.1,2.7,3.3l8,0.8c1.6,0.2,3.1-1,3.3-2.7l0.2-2l0.6-6.8l0.1-0.6 v-0.1L24,7.8V7.7c0.2-1.6-1.1-3.1-2.7-3.3L13.3,3.7z M21.7,11L21.7,11v0.2v0.5l-0.8,8.8c0,0.5-0.5,1-1.1,0.9l-8-0.8 c-0.5,0-1-0.5-0.9-1.1L12,6.6c0-0.5,0.6-0.9,1.1-0.9l8,0.8c0.6,0.1,1,0.5,0.9,1.1L21.7,11z'></path>
									<path d='M53.5,9.6l-8.3-0.8c-1.6-0.2-3.1,1.1-3.3,2.7l-1.2,12.9c-0.1,1.6,1,3.1,2.7,3.3l8,0.7c1.6,0.1,3.1-1,3.3-2.7l0.2-2v-0.1 v-0.3v-0.1v-0.4l0.9-10C56.2,11.2,55.2,9.7,53.5,9.6z M45,10.8l8,0.7c0.5,0.1,1,0.5,0.9,1.1l-0.6,6c-0.1,0.6-0.5,1-1.1,0.9l-1.1-0.1 c-0.6-1.5-1.2-2.3-1.4-2.5c0.9-0.5,1.5-1.5,1.3-2.7c-0.2-0.8-0.8-1.5-1.7-1.7c-1.6-0.4-3,0.8-3,2.3c0,0.7,0.3,1.4,0.9,1.8 c-0.8,0.5-1.5,1.3-2.1,2.2l-0.8-0.1c-0.5-0.1-1-0.5-0.9-1.1l0.6-6C44,11.1,44.5,10.7,45,10.8z'></path>
								</svg>
							</a>
						</Link>
					</li>
					<li onClick={() => setActive(3)} className='relative z-10'>
						<Link href='/packs'>
							<a className='group relative flex flex-col items-center justify-center transition-all duration-150'>
								<div
									className={`indicator translate-y-4 opacity-0 ${
										active === 3 && "-translate-y-1 opacity-100"
									}`}
								></div>
								<span
									className={`absolute w-max -translate-y-4 opacity-0 transition-all duration-500 ${
										active === 3 && "-translate-y-[10px] opacity-100"
									}`}
								>
									Pack search
								</span>
								<svg
									viewBox='0 0 24 24'
									width='1em'
									height='1em'
									className={`transition-transform duration-500 ${
										active === 3 && "translate-y-8"
									}`}
								>
									<path d='M21.7,3.6'></path>
									<path d='M33.2-10.5'></path>
									<path d='M5.6,22.7c0-0.5-0.4-1-0.9-1l-0.3,0c-0.7-0.1-1.4-0.6-1.4-1.5V3.8c0-0.6,0.4-1.2,1-1.4l0.1,0l0.5,0c0.5,0,0.9-0.5,0.9-1 c0-0.5-0.4-1-0.9-1l-0.1,0c-1.9,0-3.5,1.6-3.5,3.5v16.5c0,1.9,1.6,3.5,3.5,3.5h0.1C5.2,23.8,5.6,23.2,5.6,22.7z'></path>
									<path d='M20.7,0H8.9c-1.6,0-3,1.4-3,3v18c0,1.6,1.3,3,3,3h11.5c1.6,0,3-1.3,3-3V3.7V3.3v0V3.2v0C23.6,1.4,22.4,0,20.7,0z M21.4,21 c0,0.5-0.4,1-1,1H8.9c-0.5,0-1-0.4-1-1v-8H9c0.5,2.7,2.8,4.7,5.6,4.7s5.2-2,5.6-4.7h1.1V21z M15.6,13.8v-0.6L12,11.7 c-0.3-0.1-0.4-0.3-0.4-0.6V9.4c0-0.5,0.3-0.9,0.8-0.9h1.2V7.8h2v0.7h1.2c0.5,0,0.8,0.3,0.8,0.8v1.4h-2V10h-1.9v0.6l3.6,1.5 c0.3,0.1,0.4,0.3,0.4,0.6v1.7c0,0.5-0.3,0.9-0.8,0.9h-1.2V16h-2v-0.7h-1.2c-0.5,0-0.8-0.3-0.8-0.9v-1.5h2v0.9H15.6z M21.4,3.2 L21.4,3.2v0.1v0.1V11h-1.1c-0.5-2.7-2.8-4.7-5.6-4.7S9.5,8.3,9,11H7.9V3c0-0.5,0.5-1,1-1h11.5c0.6,0,1,0.4,1,1V3.2z'></path>
								</svg>
							</a>
						</Link>
					</li>
					<li onClick={() => setActive(4)} className='relative z-10'>
						<Link href='/spinner'>
							<a className='group relative flex flex-col items-center justify-center transition-all duration-150'>
								<div
									className={`indicator translate-y-4 opacity-0 ${
										active === 4 && "-translate-y-1 opacity-100"
									}`}
								></div>
								<span
									className={`absolute -translate-y-4 opacity-0 transition-all duration-500 ${
										active === 4 && "-translate-y-[10px] opacity-100"
									}`}
								>
									Spinner
								</span>
								<svg
									viewBox='0 0 24 24'
									width='1em'
									height='1em'
									className={`transition-transform duration-500 ${
										active === 4 && "translate-y-8"
									}`}
								>
									<path d='M12.2,6.5l-0.1,0c-2.4,0-4.7,1.6-5.2,4c-0.7,3.3,1.7,6.2,4.9,6.4h0c2.8,0,5.3-2.1,5.4-4.9C17.3,9,15.1,6.5,12.2,6.5z M14.4,15.4L12,13.6c0,0-0.1,0-0.1,0l-2.4,1.7l0.9-2.8c0,0,0-0.1,0-0.1l-2.4-1.7H11c0,0,0.1,0,0.1,0L12,8l0.9,2.8c0,0,0,0,0.1,0 h2.9l-2.4,1.7c0,0,0,0,0,0.1L14.4,15.4z'></path>
									<path d='M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M21.7,10.7h-3.6C18,9.7,17.6,8.8,17,8l2.4-2.4 C20.6,7,21.5,8.7,21.7,10.7z M13,2.2c1.9,0.2,3.6,0.9,5,2l-2.4,2.4C14.9,6.1,14,5.7,13,5.5V2.2z M11,2.2v3.3c-1,0.2-1.9,0.5-2.6,1.1 L6,4.2C7.4,3.1,9.1,2.4,11,2.2z M4.6,5.6L7,8C6.4,8.8,6,9.7,5.9,10.7H2.3C2.5,8.7,3.4,7,4.6,5.6z M2.2,12.7h3.7 c0.2,1,0.5,1.9,1.1,2.6L4.2,18C3.1,16.5,2.3,14.7,2.2,12.7z M11,21.8c-2-0.2-3.9-1.1-5.4-2.3l2.8-2.8c0.8,0.6,1.7,0.9,2.6,1.1V21.8z M7.8,11.6c0-2.3,1.9-4.2,4.2-4.2s4.2,1.9,4.2,4.2s-1.9,4.2-4.2,4.2S7.8,14,7.8,11.6z M13,21.8v-4c1-0.2,1.9-0.5,2.6-1.1l2.8,2.8 C16.9,20.7,15,21.6,13,21.8z M19.8,18L17,15.3c0.6-0.8,0.9-1.7,1.1-2.6h3.7C21.7,14.7,20.9,16.5,19.8,18z'></path>
								</svg>
							</a>
						</Link>
					</li>
					{/* <div
						className={`absolute left-[128px] top-5 h-16 w-16 rounded-full border-4 border-gray-700 bg-green-400 transition-transform duration-500 before:absolute before:-left-4 before:h-5 before:w-5 before:rounded-br-full before:shadow-[0_8px_0_0_#374151] after:absolute after:left-[48px] after:h-5 after:w-5 after:rounded-bl-full after:shadow-[0_8px_0_0_#374151]`}
					></div> */}
				</ul>
			</nav>
		</div>
	);
};
