emergencyAction.shapeSize = 300;

function emergencyAction(data, initialShape, changes, Template) {
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

	const IconPosition = {
		Top: "top",
		Bottom: "bottom",
	};

	const shape = initialShape ? initialShape : Shape.create("g");

	const { body, border, category } = addBaseShape();
	border.classed("selectable", true);
	setCategory(category);
	const label = addLabel();
	const { priorityTag, largePriorityTag } = addPriorityTag();
	const tagCollection = addTagCollection();
	const topIcon = addStatusIcon(IconPosition.Top);
	const bottomIcon = addStatusIcon(IconPosition.Bottom);

	OnZoom(data, 0.35, [
		LODStyle(largePriorityTag, "class", "hidden", (k) => k > 0.7 || k < 0.35),
		LODStyle(topIcon, "class", "hidden", (k) => k < 0.35),
		LODStyle(bottomIcon, "class", "hidden", (k) => k > 0.35),
	]);
	OnZoom(data, 0.7, [
		LODStyle(tagCollection, "class", "hidden", (k) => k < 0.7),
		LODStyle(largePriorityTag, "class", "hidden", (k) => k > 0.7 || k < 0.35),
		LODStyle(priorityTag, "class", "hidden", (k) => k < 0.7),
	]);

	Shape.transform(shape, true, data.shape.scale * emergencyAction.shapeSize);
	return shape;

	function addBaseShape() {
		const frame = initialShape
			? shape.select("g.frame")
			: SVGShape(`
			<g transform="matrix(1,0,0,1,-711.335,-901.655)">
				<g transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g id="body" transform="matrix(1,0,0,1,370.553,216.397)">
						<path d="M0,647.047C-11.004,647.047 -21.258,641.127 -26.76,631.598L-195.707,338.973C-201.208,329.443 -201.208,317.604 -195.707,308.074L-26.76,15.449C-21.258,5.92 -11.004,0 0,0L337.894,0C348.898,0 359.151,5.92 364.654,15.449L533.6,308.074C539.102,317.604 539.102,329.443 533.6,338.973L364.654,631.598C359.151,641.127 348.898,647.047 337.894,647.047L0,647.047Z" style="fill-rule:nonzero;"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,0,0)">
					<g id="category" transform="matrix(1,0,0,1,197.086,385.349)">
						<path d="M0,101.76L684.827,101.76L626.076,0L58.751,0L0,101.76Z" style="fill-rule:nonzero;"/>
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
		const category = frame.select("#category");
		return {
			body,
			border,
			category,
		};
	}

	function setCategory(categoryShape) {
		const category = data.payload?.category ?? "unkown";
		categoryShape
			.classed("n_gray", false)
			.classed("lighten-3", false)
			.classed("n_teal", category === "ambulance")
			.classed("n_purple", category === "emergency-rescue")
			.classed("n_red", category == "fire-department");
		if (category != "ambulance" && category != "emergency-rescue" && category != "fire-department") {
			categoryShape.classed("n_gray", true).classed("lighten-3", true);
		}
	}

	function addLabel() {
		if (!changes.payload?.label) return shape.select("g.label");
		shape.select("g.label").remove();
		const bbox = Shape.getBBox(shape);
		const text = data.payload?.label;
		const placeholder = data.payload?.label ? null : "Action";
		const labelShape = TextCollection(
			placeholder ? placeholder : text,
			CollectionStyle(100, bbox.width, 0, bbox.height * 0.37, 80, 80, 1, Alignment.Center, [300]),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "300", true),
				ShapeStyle("class", "n_light_text", true),
				ShapeStyle("class", "n_gray.lighten-1", placeholder),
			]
		);
		labelShape.classed("label", true);
		shape.append(() => labelShape.node());
		return labelShape;
	}

	function addPriorityTag() {
		if (!changes.payload?.priority) {
			return {
				priorityTag: shape.select("g.priority-tag"),
				largePriorityTag: shape.select("g.large-priority-tag"),
			};
		}
		const bbox = Shape.getBBox(shape);
		shape.select("g.priority-tag").remove();
		const priorityTag = TagShape(
			data.payload?.priority ?? " – ",
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
		priorityTag
			.classed("priority-tag", true)
			.attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.6})`);
		shape.append(() => priorityTag.node());

		shape.select("g.large-priority-tag").remove();
		const largePriorityTag = TagShape(
			data.payload?.priority ?? " – ",
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
		largePriorityTag
			.classed("large-priority-tag", true)
			.attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.65})`);
		shape.append(() => largePriorityTag.node());
		return {
			priorityTag,
			largePriorityTag,
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

	function addStatusIcon(pos) {
		if (!changes.payload?.status) return shape.select("g.top-status-icon" + pos);
		shape.select("g.top-status-icon" + pos).remove();
		let icon = null;
		switch (data.payload?.status) {
			case "scheduled":
				icon = scheduledIcon();
				break;
			case "in-progress":
				icon = inProgressIcon();
				break;
			case "completed":
				icon = completedIcon();
				break;
			default:
				break;
		}
		if (!icon) return shape.select("g.top-status-icon" + pos);
		icon.classed("top-status-icon" + pos, true);
		const bbox = Shape.getBBox(shape);
		const iconBBox = Shape.getBBox(icon);
		switch (pos) {
			case IconPosition.Top:
				icon.attr("transform", `translate(${bbox.width / 2 - iconBBox.width}, ${bbox.height * 0.07})`);
				break;
			case IconPosition.Bottom:
				icon.attr(
					"transform",
					`translate(${bbox.width / 2 - iconBBox.width * 5}, ${bbox.height * 0.55}) scale(2.5)`
				);
				break;
		}
		shape.append(() => icon.node());
		return icon;
	}

	function scheduledIcon() {
		const icon = SVGShape(`
			<g id="scheduled" transform="matrix(4.16667,0,0,4.16667,-2101.08,-1092.99)">
				<g transform="matrix(1,0,0,1,539.5,326.709)">
					<path d="M0,-58.3C-16.073,-58.3 -29.15,-45.223 -29.15,-29.15C-29.15,-13.076 -16.073,0.001 0,0.001C16.074,0.001 29.15,-13.076 29.15,-29.15C29.15,-45.223 16.074,-58.3 0,-58.3M0,6.091C-19.432,6.091 -35.241,-9.718 -35.241,-29.15C-35.241,-48.581 -19.432,-64.391 0,-64.391C19.432,-64.391 35.241,-48.581 35.241,-29.15C35.241,-9.718 19.432,6.091 0,6.091" style="fill-rule:nonzero;"/>
				</g>
				<g transform="matrix(-1,0,0,1,1078.72,-504.452)">
					<rect x="536.313" y="779.185" width="6.091" height="26.082"/>
				</g>
				<g transform="matrix(-1,0,0,1,1089.42,-481.785)">
					<rect x="536.314" y="777.847" width="16.788" height="6.091"/>
				</g>
			</g>
		`);
		icon.attr("stroke", "none").classed("n_red", true);
		return icon;
	}
	function inProgressIcon() {
		const icon = SVGShape(`
			<g id="in-progress" transform="matrix(4.16667,0,0,4.16667,-2127.4,-4060.37)">
				<g transform="matrix(1,0,0,1,545.538,1038.37)">
					<path d="M0,-57.841C-15.947,-57.841 -28.92,-44.867 -28.92,-28.92C-28.92,-12.973 -15.947,0.001 0,0.001C15.948,0.001 28.921,-12.973 28.921,-28.92C28.921,-44.867 15.948,-57.841 0,-57.841M0,6.043C-19.279,6.043 -34.963,-9.641 -34.963,-28.92C-34.963,-48.199 -19.279,-63.884 0,-63.884C19.279,-63.884 34.964,-48.199 34.964,-28.92C34.964,-9.641 19.279,6.043 0,6.043" style="fill-rule:nonzero;"/>
				</g>
				<g transform="matrix(-1,0,0,1,1085.46,941.907)">
					<rect x="529.791" y="66.025" width="25.877" height="6.043"/>
				</g>
				<g transform="matrix(-0.707107,-0.707107,-0.707107,0.707107,556.862,998.552)">
					<rect x="-12.081" y="5.004" width="16.657" height="6.043"/>
				</g>
				<g transform="matrix(0.707107,-0.707107,-0.707107,-0.707107,550.398,1023.36)">
					<rect x="-0.303" y="0.731" width="16.657" height="6.043"/>
				</g>
			</g>
		`);
		icon.attr("stroke", "none").classed("n_blue", true);
		return icon;
	}
	function completedIcon() {
		const icon = SVGShape(`
			<g id="completed" transform="matrix(4.16667,0,0,4.16667,-2785.94,-4059.88)">
				<g transform="matrix(1,0,0,1,703.707,1038.47)">
					<path d="M0,-58.039C-16.001,-58.039 -29.019,-45.021 -29.019,-29.02C-29.019,-13.019 -16.001,-0.001 0,-0.001C16.002,-0.001 29.019,-13.019 29.019,-29.02C29.019,-45.021 16.002,-58.039 0,-58.039M0,6.063C-19.344,6.063 -35.082,-9.675 -35.082,-29.02C-35.082,-48.364 -19.344,-64.102 0,-64.102C19.345,-64.102 35.083,-48.364 35.083,-29.02C35.083,-9.675 19.345,6.063 0,6.063" style="fill-rule:nonzero;"/>
				</g>
				<g transform="matrix(0.672229,0.740343,0.740343,-0.672229,697.655,1006.03)">
					<rect x="8.618" y="-6.5" width="6.064" height="25.965"/>
				</g>
				<g transform="matrix(0.672211,0.74036,0.74036,-0.672211,696.14,1005.33)">
					<rect x="-0.495" y="-7.181" width="16.713" height="6.063"/>
				</g>
			</g>
		`);
		icon.attr("stroke", "none").classed("n_green", true);
		return icon;
	}
}

export default emergencyAction;
