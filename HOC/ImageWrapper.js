import Image from "next/future/image";

const ImageWrapper = ({
	src,
	alt,
	width,
	height,
	className = "",
	unoptimized = true,
	fill = false,
	noPlaceHolder = false,
}) => {
	return (
		<Image
			src={src}
			alt={alt}
			width={width}
			height={height}
			fill={fill}
			unoptimized={unoptimized}
			placeholder={noPlaceHolder ? "empty" : "blur"}
			blurDataURL={
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjYGBg+A8AAQQBAHAgZQsAAAAASUVORK5CYII="
			}
			className={`${className} rounded-md`}
			quality={100}
		/>
	);
};
export default ImageWrapper;
