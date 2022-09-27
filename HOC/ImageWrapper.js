import Image from "next/future/image";

const ImageWrapper = ({ src, alt, width, height }) => {
	return (
		<>
			<Image
				src={src}
				alt={alt}
				width={width}
				height={height}
				unoptimized={true}
				placeholder='blur'
				blurDataURL={
					"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkrAcAAIcAgit25/8AAAAASUVORK5CYII="
				}
			/>
		</>
	);
};
export default ImageWrapper;
