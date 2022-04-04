emergencyReporter.shapeSize = 260;

function emergencyReporter(data, initialShape, changes, Template) {
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

	const { body, border, pin, callbackIndicator } = addBaseShape();
	border.classed("selectable", true);
	pin.classed("hidden", !data.payload?.location);
	callbackIndicator.classed("hidden", !data.payload?.callback_number);
	const fullName = addFullName();
	const location = addLocation();
	const label = addLabel();
	setCategory(label.select("path"));

	clearInterval(data.payload?.intervalID);
	if (data.payload?.pending) {
		let pendingIteration = 0;
		data.payload.intervalID = setInterval(() => {
			pendingLocation(location, pendingIteration);
			pendingIteration = (pendingIteration + 1) % 4;
		}, 1000);
	}

	OnZoom(data, 0.35, [
		LODStyle(callbackIndicator, "class", "hidden", (k) => k < 0.35 || !data.payload?.callback_number),
		LODStyle(label.select("text"), "class", "hidden", (k) => k < 0.35),
		LODStyle(fullName, "class", "hidden", (k) => k < 0.35),
	]);
	OnZoom(data, 0.7, [LODStyle(location, "class", "hidden", (k) => k < 0.7)]);

	Shape.transform(shape, true, data.shape.scale * emergencyReporter.shapeSize);
	return shape;

	function addBaseShape() {
		const frame = initialShape
			? shape.select("g.frame")
			: SVGShape(`
			<g transform="matrix(1,0,0,1,-897.945,-896.731)">
				<g id="body" transform="matrix(4.16667,0,0,4.16667,-0.000104167,-0.000833333)">
					<g transform="matrix(0.2088,0,0,0.217535,73.8817,55.3915)">
						<ellipse cx="2234.83" cy="2228.83" rx="1551.76" ry="1489.52"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,-0.000104167,-0.000833333)">
					<g transform="matrix(0.24,0,0,0.24,2.5e-05,0.0002)">
						<path d="M3574.74,1979.17C3592.73,2067.05 3602.16,2157.93 3602.16,2251C3602.16,2343.4 3592.86,2433.64 3575.15,2520.83L929.129,2520.83C911.413,2433.64 902.112,2343.4 902.112,2251C902.112,2157.93 911.549,2067.05 929.536,1979.17L3574.74,1979.17Z" style="fill:rgb(244,244,244);stroke:rgb(204,204,204);stroke-width:8.33px;"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,-0.000104167,-0.000833333)">
					<g id="callback_indicator" transform="matrix(1,0,0,1,0.975404,-77.2552)">
						<g>
							<path d="M517.3,827.663L508.269,827.663L506.38,833.091L502.169,833.091L510.975,809.779L514.61,809.779L523.432,833.091L519.205,833.091L517.3,827.663ZM509.406,824.397L516.163,824.397L512.784,814.726L509.406,824.397Z" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
							<path d="M528.542,815.767L528.654,817.768C529.935,816.22 531.616,815.447 533.698,815.447C537.306,815.447 539.142,817.512 539.206,821.643L539.206,833.091L535.315,833.091L535.315,821.867C535.315,820.768 535.077,819.954 534.602,819.425C534.127,818.897 533.351,818.633 532.273,818.633C530.704,818.633 529.535,819.343 528.766,820.762L528.766,833.091L524.876,833.091L524.876,815.767L528.542,815.767Z" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
							<path d="M552.242,819.321C551.729,819.236 551.201,819.193 550.657,819.193C548.874,819.193 547.673,819.876 547.054,821.243L547.054,833.091L543.163,833.091L543.163,815.767L546.878,815.767L546.974,817.704C547.913,816.199 549.216,815.447 550.881,815.447C551.436,815.447 551.895,815.521 552.258,815.671L552.242,819.321Z" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
							<path d="M565.198,831.394C564.055,832.739 562.433,833.411 560.33,833.411C558.452,833.411 557.029,832.861 556.063,831.762C555.097,830.662 554.614,829.072 554.614,826.991L554.614,815.767L558.505,815.767L558.505,826.943C558.505,829.141 559.418,830.241 561.243,830.241C563.132,830.241 564.408,829.563 565.069,828.207L565.069,815.767L568.96,815.767L568.96,833.091L565.294,833.091L565.198,831.394Z" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
							<path d="M574.295,833.091L574.295,818.649L571.653,818.649L571.653,815.767L574.295,815.767L574.295,814.182C574.295,812.26 574.828,810.777 575.896,809.731C576.963,808.685 578.458,808.162 580.379,808.162C581.062,808.162 581.788,808.258 582.556,808.45L582.46,811.492C582.033,811.406 581.537,811.364 580.971,811.364C579.114,811.364 578.185,812.319 578.185,814.23L578.185,815.767L581.708,815.767L581.708,818.649L578.185,818.649L578.185,833.091L574.295,833.091Z" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
							<path d="M591.798,833.411C589.332,833.411 587.333,832.634 585.802,831.081C584.27,829.528 583.504,827.46 583.504,824.877L583.504,824.397C583.504,822.668 583.838,821.123 584.505,819.762C585.172,818.401 586.109,817.341 587.315,816.583C588.521,815.826 589.866,815.447 591.349,815.447C593.708,815.447 595.531,816.199 596.817,817.704C598.104,819.209 598.747,821.339 598.747,824.093L598.747,825.662L587.427,825.662C587.544,827.092 588.022,828.223 588.86,829.056C589.698,829.889 590.752,830.305 592.022,830.305C593.805,830.305 595.256,829.584 596.377,828.143L598.474,830.145C597.781,831.18 596.855,831.983 595.697,832.554C594.538,833.125 593.239,833.411 591.798,833.411ZM591.333,818.569C590.266,818.569 589.404,818.942 588.748,819.69C588.091,820.437 587.672,821.477 587.491,822.812L594.904,822.812L594.904,822.523C594.819,821.221 594.472,820.237 593.863,819.569C593.255,818.902 592.412,818.569 591.333,818.569Z" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
							<path d="M605.378,815.767L605.49,817.768C606.771,816.22 608.452,815.447 610.534,815.447C614.142,815.447 615.977,817.512 616.042,821.643L616.042,833.091L612.151,833.091L612.151,821.867C612.151,820.768 611.913,819.954 611.438,819.425C610.963,818.897 610.187,818.633 609.109,818.633C607.54,818.633 606.371,819.343 605.602,820.762L605.602,833.091L601.712,833.091L601.712,815.767L605.378,815.767Z" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
						</g>
						<g>
							<g transform="matrix(1,0,0,1,473.142,826.9)">
								<path d="M0,-0.076L-0.016,-0.06C0.049,0 0,-0.076 0,-0.076" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
							</g>
							<g transform="matrix(1,0,0,1,488.161,819.539)">
								<path d="M0,8.439C-3.319,6.577 -5.342,6.982 -6.313,8.439C-7.285,9.896 -9.389,12 -12.546,9.41C-14.169,8.078 -15.931,6.29 -17.24,4.695C-19.83,1.538 -17.725,-0.567 -16.268,-1.538C-14.811,-2.509 -14.407,-4.533 -16.268,-7.851C-18.13,-11.17 -21.206,-10.28 -21.206,-10.28C-21.206,-10.28 -24.524,-9.308 -25.981,-3.157C-27.295,2.388 -20.716,9.906 -19.407,11.334C-19.407,11.334 -10.846,19.609 -4.695,18.152C1.457,16.695 2.428,13.376 2.428,13.376C2.428,13.376 3.319,10.301 0,8.439" style="fill:rgb(79,195,247);fill-rule:nonzero;"/>
							</g>
						</g>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,-0.000104167,-0.000833333)">
					<g id="pin" transform="matrix(1,0,0,1,540.237,323.769)">
						<path d="M0,-18.46C2.683,-18.46 4.858,-16.285 4.858,-13.602C4.858,-10.919 2.683,-8.744 0,-8.744C-2.683,-8.744 -4.858,-10.919 -4.858,-13.602C-4.858,-16.285 -2.683,-18.46 0,-18.46M0,12.631C8.744,3.887 17.489,-3.943 17.489,-13.602C17.489,-23.261 9.659,-31.091 0,-31.091C-9.659,-31.091 -17.489,-23.261 -17.489,-13.602C-17.489,-3.943 -8.744,3.887 0,12.631" style="fill:rgb(229,115,115);fill-rule:nonzero;"/>
					</g>
				</g>
				<g id="border" transform="matrix(4.16667,0,0,4.16667,-0.000104167,-0.000833333)">
					<g transform="matrix(0.24,0,0,0.24,2.5e-05,0.0002)">
						<path d="M2252.14,896.757C2432.7,896.757 2612.71,932.872 2779.03,1003.25C2939.49,1071.15 3086.31,1170.4 3209.49,1293.59C3317.14,1401.24 3406.58,1526.95 3472.68,1664.1C3530.61,1784.27 3570.54,1913 3590.69,2044.88C3614.93,2203.55 3610.96,2366.51 3578.77,2523.78C3552.16,2653.79 3506.12,2779.69 3442.76,2896.29C3296.98,3164.57 3060.27,3379.74 2779.03,3498.75C2612.71,3569.12 2432.7,3605.24 2252.14,3605.24C2071.57,3605.24 1891.57,3569.12 1725.25,3498.75C1564.79,3430.85 1417.97,3331.59 1294.79,3208.4C1187.14,3100.76 1097.7,2975.05 1031.59,2837.9C973.668,2717.72 933.737,2589 913.587,2457.12C889.342,2298.44 893.316,2135.48 925.504,1978.22C952.114,1848.2 998.157,1722.31 1061.51,1605.71C1207.29,1337.42 1444.01,1122.26 1725.25,1003.25C1891.57,932.872 2071.57,896.757 2252.14,896.757L2252.13,896.757L2252.13,905.091L2252.14,905.091C2072.68,905.091 1893.78,940.984 1728.49,1010.93C1448.98,1129.2 1213.72,1343.05 1068.84,1609.68C1005.87,1725.56 960.114,1850.68 933.668,1979.89C901.678,2136.19 897.729,2298.15 921.824,2455.85C941.851,2586.92 981.536,2714.85 1039.1,2834.29C1104.8,2970.59 1193.7,3095.53 1300.68,3202.51C1423.1,3324.94 1569.02,3423.59 1728.49,3491.07C1893.78,3561.01 2072.68,3596.91 2252.14,3596.91C2431.59,3596.91 2610.49,3561.01 2775.79,3491.07C3055.3,3372.79 3290.55,3158.95 3435.44,2892.32C3498.4,2776.44 3544.16,2651.32 3570.61,2522.1C3602.6,2365.8 3606.55,2203.85 3582.45,2046.14C3562.43,1915.08 3522.74,1787.14 3465.17,1667.71C3399.47,1531.4 3310.58,1406.47 3203.6,1299.49C3081.18,1177.05 2935.26,1078.41 2775.79,1010.93C2610.49,940.984 2431.59,905.091 2252.14,905.091L2252.15,905.091L2252.15,896.757L2252.14,896.757Z" style="fill:rgb(204,204,204)"/>
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
		const pin = frame.select("#pin");
		pin.attr("stroke", "none");
		const callbackIndicator = frame.select("#callback_indicator");
		callbackIndicator.attr("stroke", "none");
		return {
			body,
			border,
			pin,
			callbackIndicator,
		};
	}

	function addFullName() {
		if (!changes.payload?.name) return shape.select("g.full-name");
		shape.select("g.full-name").remove();
		const bbox = Shape.getBBox(shape);
		const text = (data.payload?.name?.first ?? "") + " " + (data.payload?.name?.last ?? "");
		const placeholder = data.payload?.name?.first || data.payload?.name?.last ? null : "Vorname Nachname";
		const nameShape = TextCollection(
			placeholder ? placeholder : text,
			CollectionStyle(200, bbox.width, 0, bbox.height * 0.525, 80, 80, 1, Alignment.Center, []),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "180", true),
				ShapeStyle("class", "n_dark_text", true),
				ShapeStyle("class", "n_gray.lighten-1", placeholder),
			]
		);
		nameShape.classed("full-name", true);
		shape.append(() => nameShape.node());
		return nameShape;
	}

	function addLocation() {
		if (!changes.payload?.location && !changes.payload?.pending) return shape.select("g.location");
		shape.select("g.location").remove();
		const bbox = Shape.getBBox(shape);
		const locationShape = TextCollection(
			data.payload?.location ?? "",
			CollectionStyle(240, bbox.width, 0, bbox.height * 0.25, 40, 60, 2, Alignment.Center, [300, 200]),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "120", true),
				ShapeStyle("font-weight", "semibold", true),
				ShapeStyle("class", "n_dark_text", true),
			]
		);
		locationShape.classed("location", true);
		shape.append(() => locationShape.node());
		return locationShape;
	}

	function pendingLocation(locationShape, iteration) {
		const bbox = Shape.getBBox(shape);
		shape.select("g.location").remove();
		locationShape = TextCollection(
			"Suche " + "•".repeat(iteration),
			CollectionStyle(240, bbox.width, 0, bbox.height * 0.25, 40, 60, 2, Alignment.Center, [300, 200]),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "120", true),
				ShapeStyle("font-weight", "semibold", true),
				ShapeStyle("class", "n_dark_text", true),
			]
		);
		locationShape.classed("location", true);
		shape.append(() => locationShape.node());
		return locationShape;
	}

	function addLabel() {
		if (data.payload?.label || data.payload?.category)
			if (!changes.payload?.label && !changes.payload?.category) return shape.select("g.label");
		const bbox = Shape.getBBox(shape);
		shape.select("g.label").remove();
		const labelShape = TagShape(
			data.payload?.label || " – ",
			TagStyle(
				[140, 40],
				[
					ShapeStyle("class", "n_text", true),
					ShapeStyle("font-size", "160", true),
					ShapeStyle("class", "n_light_text", true),
				],
				[],
				140
			)
		);
		labelShape.classed("label", true).attr("transform", `translate(${bbox.width / 2}, ${bbox.height * 0.6})`);
		shape.append(() => labelShape.node());
		return labelShape;
	}

	function setCategory(categoryShape) {
		const category = data.payload?.category ?? "unkown";
		categoryShape
			.classed("n_gray", false)
			.classed("lighten-3", false)
			.classed("n_teal", category === "ambulance")
			.classed("n_green", category === "police-department")
			.classed("n_red", category === "fire-department")
			.classed("n_orange", category == "control-center")
			.classed("n_purple", category == "automatic-system")
			.classed("n_blue", category == "civilian");
		if (
			category != "ambulance" &&
			category != "police-department" &&
			category != "fire-department" &&
			category != "control-center" &&
			category != "automatic-system" &&
			category != "civilian"
		) {
			categoryShape.classed("n_gray", true).classed("lighten-3", true);
		}
	}
}

export default emergencyReporter;
