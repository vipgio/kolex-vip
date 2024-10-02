import { memo, useState } from "react";
import isEqual from "lodash/isEqual";
import Dialog from "@/HOC/Dialog";
import PackData from "./PackData";

const PackModal = memo(
	({ pack, isOpen, setIsOpen }) => {
		return (
			<Dialog isOpen={isOpen} setIsOpen={setIsOpen} closeButton={true} title={pack.name}>
				<PackData pack={pack} />
			</Dialog>
		);
	},
	(oldProps, newProps) => isEqual(oldProps, newProps)
);
PackModal.displayName = "PackModal";
export default PackModal;
