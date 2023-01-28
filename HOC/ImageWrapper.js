import Image from "next/future/image";

const ImageWrapper = ({ src, alt, width, height, className, optimize }) => {
	return (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			unoptimized={true}
			placeholder='blur'
			blurDataURL={
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBg+A8AAQQBAHAgZQsAAAAASUVORK5CYII="
			}
			className={`${className} rounded-md`}
		/>
	);
};
export default ImageWrapper;
