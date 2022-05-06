affectedObject.shapeSize = 300;

function affectedObject(data, initialShape, changes, Template) {
	const {
		Shape,
		SVGShape,
		ShapeStyle,
		OnZoom,
		LODStyle,
		Alignment,
		CollectionStyle,
		TextCollection,
		TagCollection,
		TagShape,
		TagStyle,
	} = Template;

	const shape = initialShape ? initialShape : Shape.create("g");

	const { body, border, state, rect, largeRect } = addBaseShape();
	border.classed("selectable", true);
	setState(state);
	const { label, largeLabel } = addLabels();
	const { accessibilityTag, largeAccessibilityTag } = addAccessibilityTag();
	const tagCollection = addTagCollection();

	OnZoom(data, 0.35, [
		LODStyle(largeRect, "class", "hidden", (k) => k > 0.35),
		LODStyle(label, "class", "hidden", (k) => k < 0.35),
		LODStyle(largeLabel, "class", "hidden", (k) => k > 0.35),
		LODStyle(rect, "class", "hidden", (k) => k < 0.35),
		LODStyle(largeAccessibilityTag, "class", "hidden", (k) => k > 0.7 || k < 0.35),
	]);
	OnZoom(data, 0.7, [
		LODStyle(tagCollection, "class", "hidden", (k) => k < 0.7),
		LODStyle(largeAccessibilityTag, "class", "hidden", (k) => k > 0.7 || k < 0.35),
		LODStyle(accessibilityTag, "class", "hidden", (k) => k < 0.7),
	]);

	Shape.transform(shape, true, data.shape.scale * affectedObject.shapeSize);
	return shape;

	function addBaseShape() {
		const frame = initialShape
			? shape.select("g.frame")
			: SVGShape(`
			<g transform="matrix(1,0,0,1,-713.419,-878.793)">
				<g transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g id="body" transform="matrix(1,0,0,1,371.053,216.935)">
						<path d="M0,647.047C-11.004,647.047 -21.258,641.127 -26.76,631.598L-195.707,338.973C-201.208,329.443 -201.208,317.604 -195.707,308.074L-26.76,15.449C-21.257,5.92 -11.004,0 0,0L337.894,0C348.897,0 359.151,5.92 364.654,15.449L533.6,308.074C539.102,317.604 539.102,329.443 533.6,338.973L364.654,631.598C359.151,641.127 348.898,647.047 337.894,647.047L0,647.047Z" style="fill:white;fill-rule:nonzero;"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g id="state" transform="matrix(1,0,0,1,733.385,371.504)">
						<path d="M0,-142.023C-4.84,-150.405 -13.784,-155.569 -23.463,-155.569L-363.307,-155.569C-372.986,-155.569 -381.93,-150.405 -386.769,-142.023L-469.385,1.071C-383.992,9.12 -290.869,13.546 -193.385,13.546C-95.9,13.546 -2.778,9.12 82.615,1.071L0,-142.023Z" style="fill-rule:nonzero;stroke:rgb(166,163,164);stroke-width:1px;"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g id="rect" transform="matrix(0.24,0,0,0.24,0,0)">
						<path d="M2871.51,1388.91C2871.51,1313.38 2810.19,1252.05 2734.65,1252.05L1765.35,1252.05C1689.81,1252.05 1628.49,1313.38 1628.49,1388.91L1628.49,1784.38C1628.49,1859.91 1689.81,1921.23 1765.35,1921.23L2734.65,1921.23C2810.19,1921.23 2871.51,1859.91 2871.51,1784.38L2871.51,1388.91Z" style="fill:rgb(244,244,244);stroke:rgb(204,204,204);stroke-width:4.17px;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g id="large-rect" transform="matrix(0.442471,0,0,0.442471,-455.559,-161.747)">
						<path d="M2871.51,1388.91C2871.51,1313.38 2810.19,1252.05 2734.65,1252.05L1765.35,1252.05C1689.81,1252.05 1628.49,1313.38 1628.49,1388.91L1628.49,1784.38C1628.49,1859.91 1689.81,1921.23 1765.35,1921.23L2734.65,1921.23C2810.19,1921.23 2871.51,1859.91 2871.51,1784.38L2871.51,1388.91Z" style="fill:rgb(244,244,244);stroke:rgb(204,204,204);stroke-width:2.26px;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.5;"/>
					</g>
				</g>
				<g id="border" transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g transform="matrix(1,0,0,1,708.947,864.483)">
						<path d="M0,-648.048L-337.894,-648.048C-349.112,-648.048 -359.477,-642.063 -365.086,-632.348L-534.033,-339.724C-539.642,-330.009 -539.642,-318.039 -534.033,-308.325L-365.086,-15.7C-359.477,-5.985 -349.112,0 -337.894,0L0,0C11.218,0 21.584,-5.985 27.193,-15.7L196.14,-308.325C201.748,-318.039 201.748,-330.009 196.14,-339.724L27.193,-632.348C21.584,-642.063 11.218,-648.048 0,-648.048M0,-647.048C10.826,-647.048 20.914,-641.224 26.327,-631.848L195.273,-339.224C200.686,-329.848 200.686,-318.2 195.273,-308.825L26.327,-16.2C20.914,-6.824 10.826,-1 0,-1L-337.894,-1C-348.72,-1 -358.807,-6.824 -364.22,-16.2L-533.167,-308.825C-538.58,-318.2 -538.58,-329.848 -533.167,-339.224L-364.22,-631.848C-358.807,-641.224 -348.72,-647.048 -337.894,-647.048L0,-647.048"/>
					</g>
				</g>
			</g>
			`);
		frame.classed("frame", true).classed("n_animated", true);
		if (!initialShape) {
			shape.append(() => frame.node());
		}
		const body = frame.select("#body");
		const border = frame.select("#border");
		const state = frame.select("#state");
		const rect = frame.select("#rect");
		const largeRect = frame.select("#large-rect");
		return {
			body,
			border,
			state,
			rect,
			largeRect,
		};
	}

	function setState(state) {
		const status = data.payload?.status ?? "unkown";
		state
			.classed("n_gray", false)
			.classed("lighten-3", false)
			.classed("n_red", status == "immediate")
			.classed("n_orange", status === "delayed")
			.classed("n_green", status === "minor");
		if (status != "immediate" && status != "delayed" && status != "minor") {
			state.classed("n_gray", true).classed("lighten-3", true);
		}
	}

	function addLabels() {
		if (!changes.payload?.label) {
			return {
				label: shape.select("g.label"),
				largeLabel: shape.select("g.large-label"),
			};
		}
		shape.select("g.label").remove();
		const bbox = Shape.getBBox(shape);
		const text = data.payload?.label ?? "";
		const placeholder = data.payload?.label ? null : "Betroffenes\nObjekt";

		const label = TextCollection(
			placeholder ? placeholder : text,
			CollectionStyle(300, bbox.width, 0, bbox.height * 0.25, 80, 80, 2, Alignment.Center, [1000, 1000]),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "160", true),
				ShapeStyle("class", "n_dark_text", true),
				ShapeStyle("class", "n_gray.lighten-1", placeholder),
			]
		);
		label.classed("label", true);
		shape.append(() => label.node());

		shape.select("g.large-label").remove();
		const largeLabel = TextCollection(
			placeholder ? placeholder : text,
			CollectionStyle(600, bbox.width, 0, bbox.height * 0.475, 80, 80, 2, Alignment.Center, [500, 500]),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "280", true),
				ShapeStyle("class", "n_dark_text", true),
				ShapeStyle("class", "n_gray.lighten-1", placeholder),
			]
		);
		largeLabel.classed("large-label", true);
		shape.append(() => largeLabel.node());
		return { label, largeLabel };
	}

	function addAccessibilityTag() {
		if (!changes.payload?.accessibility) {
			return {
				accessibilityTag: shape.select("g.accessibility-tag"),
				largeAccessibilityTag: shape.select("g.large-accessibility-tag"),
			};
		}
		const bbox = Shape.getBBox(shape);
		shape.select("g.accessibility-tag").remove();
		const accessibilityTag = TagShape(
			data.payload?.accessibility ?? " – ",
			TagStyle(
				[120, 40],
				[
					ShapeStyle("class", "n_text", true),
					ShapeStyle("font-size", "140", true),
					ShapeStyle("class", "n_light_text", true),
				],
				[ShapeStyle("class", "n_black", true)],
				120
			)
		);
		accessibilityTag
			.classed("accessibility-tag", true)
			.attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.6})`);
		shape.append(() => accessibilityTag.node());

		shape.select("g.large-accessibility-tag").remove();
		const largeAccessibilityTag = TagShape(
			data.payload?.accessibility ?? " – ",
			TagStyle(
				[160, 50],
				[
					ShapeStyle("class", "n_text", true),
					ShapeStyle("font-size", "180", true),
					ShapeStyle("class", "n_light_text", true),
				],
				[ShapeStyle("class", "n_black", true)],
				160
			)
		);
		largeAccessibilityTag
			.classed("large-accessibility-tag", true)
			.attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.65})`);
		shape.append(() => largeAccessibilityTag.node());
		return {
			accessibilityTag,
			largeAccessibilityTag,
		};
	}

	function addTagCollection() {
		// if (!changes.payload?.tags) return shape.select("g.tag-collection");
		shape.select("g.tag-collection").remove();
		const bbox = Shape.getBBox(shape);
		const tagCollection = TagCollection(
			data.payload?.tags ?? [],
			CollectionStyle(800, bbox.width, 0, bbox.height * 0.72, 60, 60, 3, Alignment.Center, [370, 540, 710]),
			TagStyle(
				[100, 40],
				[
					ShapeStyle("class", "n_text", true),
					ShapeStyle("font-size", "120", true),
					ShapeStyle("class", "n_dark_text", true),
				],
				[ShapeStyle("class", "n_gray.lighten-3", true)],
				110
			)
		);
		tagCollection.classed("tag-collection", true);
		shape.append(() => tagCollection.node());
		return tagCollection;
	}
}

export default affectedObject;
