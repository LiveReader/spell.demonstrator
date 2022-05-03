closeButton.shapeSize = 30;

function closeButton(data, initialShape, changes, Template) {
	const { Shape } = Template;

	const shape = initialShape ? initialShape : Shape.create("g");
	const body = Shape.create("circle");
	body.attr("r", closeButton.shapeSize / 2);
	body.attr("cx", closeButton.shapeSize / 2);
	body.attr("cy", closeButton.shapeSize / 2);
	body.classed("n_gray", true);
	body.classed("lighten-2", true);
	body.attr("stroke", "none");
	shape.append(() => body.node());

	const cross = Shape.create("path");
	cross.attr(
		"d",
		"M" +
			closeButton.shapeSize * 0.2 +
			", " +
			closeButton.shapeSize * 0.2 +
			" L" +
			(closeButton.shapeSize - closeButton.shapeSize * 0.2) +
			", " +
			(closeButton.shapeSize - closeButton.shapeSize * 0.2) +
			" M" +
			(closeButton.shapeSize - closeButton.shapeSize * 0.2) +
			", " +
			closeButton.shapeSize * 0.2 +
			" L" +
			closeButton.shapeSize * 0.2 +
			", " +
			(closeButton.shapeSize - closeButton.shapeSize * 0.2)
	);
	cross.attr("stroke-width", "4");
	cross.attr("stroke", "#f44336");
	cross.attr("stroke-linecap", "round");
	cross.attr("fill", "none");
	shape.append(() => cross.node());

	Shape.transform(shape, true, data.shape.scale * closeButton.shapeSize);
	return shape;
}

export default closeButton;
