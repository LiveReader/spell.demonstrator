emergencyRessource.shapeSize = 300;

function emergencyRessource(data, initialShape, changes, Template) {
	const {
		Shape,
		SVGShape,
		ShapeStyle,
		OnZoom,
		LODStyle,
		Alignment,
		CollectionStyle,
		TextCollection,
		TagShape,
		TagStyle,
	} = Template;

	const shape = initialShape ? initialShape : Shape.create("g");

	const { body, border, statusIndicator } = addBaseShape();
	border.classed("selectable", true);
	setStatus(statusIndicator);
	const status = addStatus();
	const { label, largeLabel } = addLabel();
	const timeLabel = addTimeLabel();
	const alertedTag = addAlertedTag();

	alertedTag.classed("hidden", !data.payload?.alerted);

	OnZoom(data, 0.35, [
		LODStyle(timeLabel, "class", "hidden", (k) => k < 0.35),
		LODStyle(label, "class", "hidden", (k) => k < 0.35),
		LODStyle(largeLabel, "class", "hidden", (k) => k > 0.35),
	]);
	OnZoom(data, 0.7, [
		LODStyle(timeLabel.select("text"), "class", "hidden", (k) => k < 0.7),
		LODStyle(alertedTag.select("text"), "class", "hidden", (k) => k < 0.7),
	]);

	Shape.transform(shape, true, data.shape.scale * emergencyRessource.shapeSize);
	return shape;

	function addBaseShape() {
		const frame = initialShape
			? shape.select("g.frame")
			: SVGShape(`
			<g transform="matrix(1,0,0,1,-713.418,-901.984)">
				<g transform="matrix(4.16667,0,0,4.16667,-0.000104167,-0.000833333)">
					<g id="body" transform="matrix(1,0,0,1,371.053,216.476)">
						<path d="M0,647.047C-11.004,647.047 -21.258,641.127 -26.76,631.598L-195.707,338.973C-201.208,329.443 -201.208,317.604 -195.707,308.074L-26.76,15.449C-21.257,5.92 -11.004,0 0,0L337.894,0C348.897,0 359.151,5.92 364.654,15.449L533.6,308.074C539.102,317.604 539.102,329.443 533.6,338.973L364.654,631.598C359.151,641.127 348.898,647.047 337.894,647.047L0,647.047Z" style="fill-rule:nonzero;"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,-0.000104167,-0.000833333)">
					<g id="status-indicator" transform="matrix(0.24,0,0,0.24,0,0)">
						<path d="M2841.67,901.985L1658.34,901.985L1658.34,1637.92C1658.34,1703.23 1711.36,1756.25 1776.67,1756.25L2723.34,1756.25C2788.64,1756.25 2841.67,1703.23 2841.67,1637.92L2841.67,901.985Z" style="fill-rule:nonzero;"/>
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
		const statusIndicator = frame.select("#status-indicator");
		return {
			body,
			border,
			statusIndicator,
		};
	}

	function addStatus() {
		if (!changes.payload?.status) return shape.select("g.status");
		shape.select("g.status").remove();
		const bbox = Shape.getBBox(shape);
		const statusShape = TextCollection(
			(data.payload?.status ?? -1).toString(),
			CollectionStyle(200, bbox.width, 0, bbox.height * 0.2, 80, 80, 1, Alignment.Center, []),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "380", true),
				ShapeStyle("font-weight", "bold", true),
				ShapeStyle("class", "n_dark_text", true),
			]
		);
		statusShape.classed("status", true);
		shape.append(() => statusShape.node());
		return statusShape;
	}

	function setStatus(statusShape) {
		const s = data.payload?.status ?? -1;
		statusShape
			.classed("n_gray", s == 6 || s == -1)
			.classed("n_orange", s == 0 || s == 5)
			.classed("n_green", s == 1 || s == 2 || s == 8)
			.classed("n_purple", s == 3 || s == 4 || s == 7)
			.classed("lighten-1", s == 5 || s == 2 || s == 4)
			.classed("lighten-2", s == 8 || s == 7 || s == 6 || s == -1);
	}

	function addLabel() {
		if (!changes.payload?.label)
			return {
				label: shape.select("g.label"),
				largeLabel: shape.select("g.large-label"),
			};
		const bbox = Shape.getBBox(shape);
		shape.select("g.label").remove();
		const labelShape = TextCollection(
			data.payload?.label ?? " – ",
			CollectionStyle(200, bbox.width, 0, bbox.height * 0.55, 80, 80, 1, Alignment.Center, []),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "280", true),
				ShapeStyle("class", "n_dark_text", true),
			]
		);
		labelShape.classed("label", true);
		shape.append(() => labelShape.node());

		shape.select("g.large-label").remove();
		const largeLabelShape = TextCollection(
			data.payload?.label ?? " – ",
			CollectionStyle(200, bbox.width, 0, bbox.height * 0.62, 80, 80, 1, Alignment.Center, []),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "380", true),
				ShapeStyle("class", "n_dark_text", true),
			]
		);
		largeLabelShape.classed("large-label", true);
		shape.append(() => largeLabelShape.node());
		return {
			label: labelShape,
			largeLabel: largeLabelShape,
		};
	}

	function addTimeLabel() {
		if (!changes.payload?.time_label) return shape.select("g.time-label");
		if (!data.payload?.time_label) return shape.select("g.time-label");
		const bbox = Shape.getBBox(shape);
		shape.select("g.time-label").remove();
		const timeLabelShape = TagShape(
			data.payload?.time_label ?? "",
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
		timeLabelShape
			.classed("time-label", true)
			.attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.65})`);
		shape.append(() => timeLabelShape.node());
		return timeLabelShape;
	}

	function addAlertedTag() {
		const bbox = Shape.getBBox(shape);
		const alertedTag = initialShape
			? shape.select("g.alerted")
			: TagShape(
					"alarmiert",
					TagStyle(
						[120, 40],
						[
							ShapeStyle("class", "n_text", true),
							ShapeStyle("font-size", "140", true),
							ShapeStyle("class", "n_light_text", true),
						],
						[ShapeStyle("class", "n_red", true)],
						120
					)
			  );
		alertedTag.classed("alerted", true).attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.8})`);
		shape.append(() => alertedTag.node());
		return alertedTag;
	}
}

export default emergencyRessource;
