operation.shapeSize = 100;

function operation(data, initialShape, changes, Template) {
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

	const { body, border, persons, content, objects, pin } = addBaseShape();
	border.classed("selectable", true);
	pin.classed("hidden", !data.payload?.location);
	// const label = addLabel();
	const location = addLocation();
	// const tagCollection = addTagCollection();
	const personsCount = addPersonsCount();
	const objectsCount = addObjectsCount();
	location.classed('hidden', true);
	setState(content);

	Shape.transform(shape, true, data.shape.scale * operation.shapeSize);
	return shape;

	function addBaseShape() {
		const frame = initialShape
			? shape.select("g.frame")
			: SVGShape(`
			<g transform="matrix(1,0,0,1,-713.417,-901.983)">
			<g id="body" transform="matrix(4.16667,0,0,4.16667,-46.0579,-0.1)">
				<g transform="matrix(1,0,0,1,382.106,216.5)">
					<path d="M0,647.048C-11.004,647.048 -21.258,641.128 -26.759,631.598L-195.706,338.974C-201.208,329.444 -201.208,317.604 -195.706,308.074L-26.759,15.45C-21.257,5.92 -11.004,0 0,0L337.894,0C348.897,0 359.151,5.92 364.654,15.45L533.601,308.074C539.103,317.604 539.103,329.444 533.601,338.974L364.654,631.598C359.151,641.128 348.897,647.048 337.894,647.048L0,647.048Z" style="fill:rgb(64,64,64);fill-rule:nonzero;"/>
				</g>
			</g>
			<g id="content">
				<g transform="matrix(4.16667,0,0,4.16667,-46.0579,-0.1)">
					<g id="objects" transform="matrix(8,0,0,8,580,565)">
						<rect x="2" y="7" width="7" height="15"/>
						<rect x="9" y="2" width="13" height="20"/>
						<rect x="12" y="6" width="2" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="17" y="6" width="2" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="12" y="14" width="2" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="17" y="14" width="2" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="12" y="10" width="2" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="17" y="10" width="2" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="12" y="18" width="2" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="17" y="18" width="2" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="5" y="14" width="1" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="5" y="10" width="1" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
						<rect x="5" y="18" width="1" height="1" style="fill:rgb(128,128,128);fill-rule:nonzero;stroke:rgb(128,128,128);stroke-width:1px;"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,-46.0579,-0.1)">
					<g id="persons" transform="matrix(8,0,0,8,580,315)">
						<path d="M12,12C6.48,12 2,16.48 2,22L22,22C22,16.48 17.52,12 12,12Z" />
						<path d="M12,12C14.761,12 17,9.761 17,7C17,4.239 14.761,2 12,2C9.239,2 7,4.239 7,7C7,9.761 9.239,12 12,12Z"/>
					</g>
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
		const persons = frame.select("#persons");
		const content = frame.select('#content');
		persons.attr("stroke", "none");
		const objects = frame.select("#objects");
		objects.attr("stroke", "none");
		const pin = frame.select("#pin");
		return {
			body,
			border,
			persons,
			content,
			objects,
			pin,
		};
	}

	function addLabel() {
		if (data.payload?.label || data.payload?.status)
			if (!changes.payload?.label && !changes.payload?.status) return shape.select("g.label");
		const bbox = Shape.getBBox(shape);
		shape.select("g.label").remove();
		const labelShape = TagShape(
			data.payload?.label || " Operation ",
			TagStyle(
				[240, 40],
				[
					ShapeStyle("class", "n_text", true),
					ShapeStyle("font-size", "240", true),
					ShapeStyle("class", "n_light_text", true),
					ShapeStyle("class", "n_gray.lighten-1", !data.payload?.label),
				],
				[],
				180
			)
		);
		labelShape.classed("label", true).attr("transform", `translate(${bbox.width / 2}, ${bbox.height / 2})`);
		shape.append(() => labelShape.node());
		return labelShape;
	}

	function setState(state) {
		const status = data.payload?.status ?? "unkown";
		state
			.classed("n_gray", false)
			.classed("darken-1", false)
			.classed("n_red", status == "immediate")
			.classed("n_orange", status === "delayed")
			.classed("n_green", status === "minor");
		if (status != "immediate" && status != "delayed" && status != "minor") {
			state.classed("n_gray", true).classed("darken-1", true);
		}
	}

	function addLocation() {
		if (!changes.payload?.location) return shape.select("g.location");
		shape.select("g.location").remove();
		const bbox = Shape.getBBox(shape);
		const locationShape = TextCollection(
			data.payload?.location ?? "",
			CollectionStyle(280, bbox.width, 0, bbox.height * 0.28, 60, 80, 2, Alignment.Center, [500, 400]),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "140", true),
				ShapeStyle("font-weight", "semibold", true),
				ShapeStyle("class", "n_light_text", true),
			]
		);
		locationShape.classed("location", true);
		shape.append(() => locationShape.node());
		return locationShape;
	}

	function addTagCollection() {
		// if (!changes.payload?.tags) return shape.select("g.tag-collection");
		shape.select("g.tag-collection").remove();
		const bbox = Shape.getBBox(shape);
		const tagCollection = TagCollection(
			data.payload?.tags ?? [],
			CollectionStyle(800, bbox.width, 0, bbox.height * 0.64, 60, 60, 3, Alignment.Center, [320, 490, 660]),
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

	function addPersonsCount() {
		if (!changes.payload?.affected_persons) return shape.select("g.persons-count");
		shape.select("g.persons-count").remove();
		const bbox = Shape.getBBox(shape);
		const personsCount = TextCollection(
			data.payload?.affected_persons.toString() ?? "0",
			CollectionStyle(1180, 1000, bbox.width * 0.2, bbox.height * 0.42, 80, 80, 1, Alignment.Center),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "800", true),
				ShapeStyle("font-weight", "bold", true),
				ShapeStyle("class", "n_light_text", true),
			]
		);
		personsCount.classed("persons-count", true);
		shape.append(() => personsCount.node());
		return personsCount;
	}

	function addObjectsCount() {
		if (!changes.payload?.affected_objects) return shape.select("g.objects-count");
		shape.select("g.objects-count").remove();
		const bbox = Shape.getBBox(shape);
		const objectsCount = TextCollection(
			data.payload?.affected_objects.toString() ?? "0",
			CollectionStyle(1180, 1000, bbox.width * 0.2, bbox.height * 0.81, 80, 80, 1, Alignment.Center),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "800", true),
				ShapeStyle("font-weight", "bold", true),
				ShapeStyle("class", "n_light_text", true),
			]
		);
		objectsCount.classed("objects-count", true);
		shape.append(() => objectsCount.node());
		return objectsCount;
	}
}

export default operation;
