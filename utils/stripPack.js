import pick from "lodash/pick";
import omit from "lodash/omit";

const stripPack = (pack) => {
	return pick(
		{
			...pack,
			treatmentsChance: pack.treatmentsChance
				? pack.treatmentsChance.map((treatment) => omit(treatment, "treatmentId"))
				: undefined,
			properties: pack.properties ? pick(pack.properties, "seasons") : undefined,
			images: pick(
				pack.images.find(({ name }) => name === "image") ||
					pack.images.find(({ name }) => name === "pack-store"),
				"url"
			),
		},
		[
			"acquireType",
			"categoryId",
			"cost",
			"costType",
			"description",
			"entityCount",
			"id",
			"images",
			"inventoryCount",
			"marketStart",
			"mintCount",
			"name",
			"openedCount",
			"properties",
			"purchaseEnd",
			"purchaseStart",
			"treatmentsChance",
		]
	);
};
export default stripPack;
