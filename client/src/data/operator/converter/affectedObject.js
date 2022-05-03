import { getTags } from "./index";

function affectedObject(node) {
	const tax = node.taxonomy;

	let status = {
		Grün: "minor",
		Gelb: "delayed",
		Rot: "immediate",
	};

	let mobile_tags = getTags(tax.mobile);
	let residentialtype_tags = getTags(tax.residentialtype);
	let medicaltype_tags = getTags(tax.medicaltype);
	let infrastructure_tags = getTags(tax.infrastructure);
	let supply_tags = getTags(tax.infrastructure.supply);
	let specialtype_tags = getTags(tax.specialtype);
	let tags = mobile_tags.concat(
		residentialtype_tags,
		medicaltype_tags,
		infrastructure_tags,
		supply_tags,
		specialtype_tags
	);

	node.payload = {
		status: status[tax.status.value] ?? "delayed",
		label: tax.name.value ?? "",
		accessibility: "",
		tags: tags,
	};
}

export default affectedObject;
