assessment.shapeSize = 200;

function assessment(data, initialShape, changes, Template) {
	const { Shape, SVGShape, ShapeStyle, Alignment, CollectionStyle, TextCollection } = Template;

	const shape = initialShape ? initialShape : Shape.create("g");

	const body = addBaseShape();
	body.classed("selectable", true);
	const diagnosisLabel = addDiagnosisLabel();
	const assessmentLabel = addAssessmentLabel();

	Shape.transform(shape, true, data.shape.scale * assessment.shapeSize);
	return shape;

	function addBaseShape() {
		const frame = initialShape
			? shape.select("g.frame")
			: SVGShape(`
			<g transform="matrix(1,0,0,1,-2175.71,-516.253)">
				<g id="assessment" transform="matrix(0.793787,0,0,0.793787,683.695,201.245)">
					<g transform="matrix(0.822969,0,0,0.757995,1053.15,261.313)">
						<path d="M4188.31,706.648C4188.31,529.577 4055.9,385.818 3892.81,385.818L1494.23,385.818C1331.14,385.818 1198.73,529.577 1198.73,706.648L1198.73,1134.42C1198.73,1311.49 1331.14,1455.25 1494.23,1455.25L3892.81,1455.25C4055.9,1455.25 4188.31,1311.49 4188.31,1134.42L4188.31,706.648Z" style="fill:rgb(79,195,247);"/>
					</g>
					<g transform="matrix(0.921899,0,0,0.396942,268.161,730.595)">
						<path d="M4500,981.171C4500,757.473 4421.8,575.859 4325.48,575.859L2186.45,575.859C2090.13,575.859 2011.93,757.473 2011.93,981.171C2011.93,1204.87 2090.13,1386.48 2186.45,1386.48L4325.48,1386.48C4421.8,1386.48 4500,1204.87 4500,981.171Z" style="fill:rgb(244,244,244);"/>
					</g>
					<g transform="matrix(1.25978,0,0,1.25978,-785.72,-165.34)">
						<g transform="matrix(0.842292,0,0,0.913938,367.179,52.1241)">
							<ellipse cx="2328.21" cy="663.753" rx="247.341" ry="227.951" style="fill:rgb(79,195,247);stroke:white;stroke-width:9.48px;"/>
						</g>
						<g id="ai" transform="matrix(0.32731,0,0,0.32731,2244.28,536.911)">
							<g id="face" transform="matrix(4.16667,0,0,4.16667,-251.731,-154.632)">
								<g transform="matrix(1,0,0,1,2,-4)">
									<path d="M80.652,219C80.652,219 91.759,202.113 92.904,188.804C93.425,182.747 92.461,167.791 92.461,167.791" style="fill:none;stroke:white;stroke-width:9.17px;stroke-miterlimit:4;"/>
								</g>
								<path d="M120.424,45.675C120.424,45.675 146.643,45.336 163.499,54.134C183.912,64.789 186.177,83.253 188.49,92.849C189.389,96.577 187.161,106.193 187.161,106.193C187.161,106.193 201.586,123.473 201.501,128.915C201.416,134.389 195.89,135.116 194.312,136.862C192.734,138.608 200.376,145.753 199.269,147.737C198.162,149.722 193.744,152.991 193.744,152.991C193.744,152.991 196.518,153.325 197.416,156.613C197.696,157.64 192.452,159.797 192.366,162.949C192.178,169.886 194.409,172.675 191.968,176.23C189.224,180.226 179.372,183.2 164.379,180.04C154.323,177.92 141.665,170.317 141.665,170.317" style="fill:none;stroke:white;stroke-width:9.17px;stroke-miterlimit:4;"/>
								<path d="M137.265,215C137.265,215 137.556,198.442 150.533,188.46" style="fill:none;stroke:white;stroke-width:9.17px;stroke-miterlimit:4;"/>
							</g>
							<g id="network" transform="matrix(4.16667,0,0,4.16667,-251.731,-154.632)">
								<path d="M125.42,121C125.42,118.791 127.211,117 129.42,117C131.629,117 133.42,118.791 133.42,121C133.42,123.209 131.629,125 129.42,125C127.211,125 125.42,123.209 125.42,121Z" style="fill:none;stroke:white;stroke-width:3px;stroke-miterlimit:4;"/>
								<path d="M43.42,133C43.42,130.791 45.211,129 47.42,129C49.629,129 51.42,130.791 51.42,133C51.42,135.209 49.629,137 47.42,137C45.211,137 43.42,135.209 43.42,133Z" style="fill:none;stroke:white;stroke-width:3px;stroke-miterlimit:4;"/>
								<path d="M55.42,167C55.42,164.791 57.211,163 59.42,163C61.629,163 63.42,164.791 63.42,167C63.42,169.209 61.629,171 59.42,171C57.211,171 55.42,169.209 55.42,167Z" style="fill:none;stroke:white;stroke-width:3px;stroke-miterlimit:4;"/>
								<path d="M42.42,110C42.42,107.791 44.211,106 46.42,106C48.629,106 50.42,107.791 50.42,110C50.42,112.209 48.629,114 46.42,114C44.211,114 42.42,112.209 42.42,110Z" style="fill:none;stroke:white;stroke-width:3px;stroke-miterlimit:4;"/>
								<path d="M49.42,78C49.42,75.791 51.211,74 53.42,74C55.629,74 57.42,75.791 57.42,78C57.42,80.209 55.629,82 53.42,82C51.211,82 49.42,80.209 49.42,78Z" style="fill:none;stroke:white;stroke-width:3px;stroke-miterlimit:4;"/>
								<path d="M126.42,78C126.42,75.791 128.211,74 130.42,74C132.629,74 134.42,75.791 134.42,78C134.42,80.209 132.629,82 130.42,82C128.211,82 126.42,80.209 126.42,78Z" style="fill:none;stroke:white;stroke-width:3px;stroke-miterlimit:4;"/>
								<path d="M89.418,49.237C89.418,47.028 91.209,45.237 93.418,45.237C95.627,45.237 97.418,47.028 97.418,49.237C97.418,51.446 95.627,53.237 93.418,53.237C91.209,53.237 89.418,51.446 89.418,49.237Z" style="fill:none;stroke:white;stroke-width:3px;stroke-miterlimit:4;"/>
								<path d="M64.944,167L83.735,167.021L83.735,148.907L119.37,149.159C119.37,149.159 119.478,133.583 119.478,133.26" style="fill:none;stroke:white;stroke-width:6.11px;stroke-miterlimit:4;"/>
								<path d="M156.258,78L135.478,78" style="fill:none;stroke:white;stroke-width:6.11px;stroke-miterlimit:4;"/>
								<path d="M125.42,78L58.467,78" style="fill:none;stroke:white;stroke-width:6.11px;stroke-miterlimit:4;"/>
								<path d="M113.238,78L113.238,64.789L93.427,64.39L93.418,54.827" style="fill:none;stroke:white;stroke-width:6.11px;stroke-miterlimit:4;"/>
								<path d="M143.163,104.948L110.352,104.721" style="fill:none;stroke:white;stroke-width:6.11px;stroke-miterlimit:4;"/>
								<path d="M159.786,121.1L134.42,121.1" style="fill:none;stroke:white;stroke-width:6.11px;stroke-miterlimit:4;"/>
								<path d="M123.796,120.831L99.351,120.831L99.254,133.297L52.636,133.26" style="fill:none;stroke:white;stroke-width:6.11px;stroke-miterlimit:4;"/>
								<path d="M51.42,110L78.358,110L78.309,95.64L122.152,95.793L122.126,104.149" style="fill:none;stroke:white;stroke-width:6.11px;stroke-miterlimit:4;"/>
							</g>
						</g>
					</g>
				</g>
			</g>
			`);
		frame.classed("frame", true).classed("n_animated", true);
		if (!initialShape) {
			shape.append(() => frame.node());
		}
		return frame;
	}

	function addDiagnosisLabel() {
		shape.select("g.diagnosisLabel").remove();
		if (!data.payload?.diagnosis) return shape.select("g.diagnosisLabel");
		const bbox = Shape.getBBox(shape);
		const text = data.payload?.diagnosis ?? "Diagnosis";
		const labelShape = TextCollection(
			text,
			CollectionStyle(
				100,
				bbox.width * 0.95,
				bbox.width * 0.05,
				bbox.height * 0.44,
				80,
				80,
				1,
				Alignment.Center,
				[100]
			),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "200", true),
				ShapeStyle("class", "n_light_text", true),
			]
		);
		labelShape.classed("diagnosisLabel", true);
		shape.append(() => labelShape.node());
		return labelShape;
	}

	function addAssessmentLabel() {
		shape.select("g.assessmentLabel").remove();
		if (!data.payload?.assessment) return shape.select("g.assessmentLabel");
		const bbox = Shape.getBBox(shape);
		const text = data.payload?.assessment ?? "Assessment";
		const labelShape = TextCollection(
			text,
			CollectionStyle(
				100,
				bbox.width * 0.95,
				bbox.width * 0.05,
				bbox.height * 0.82,
				80,
				80,
				1,
				Alignment.Center,
				[100]
			),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "180", true),
				ShapeStyle("class", "n_dark_text", true),
			]
		);
		labelShape.classed("assessmentLabel", true);
		shape.append(() => labelShape.node());
		return labelShape;
	}
}

export default assessment;
