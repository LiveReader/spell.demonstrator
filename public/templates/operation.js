operation.shapeSize = 300;

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

	const { body, border, persons, objects, pin } = addBaseShape();
	border.classed("selectable", true);
	pin.classed("hidden", !data.payload?.location);
	const label = addLabel();
	setState(label.select("path"));
	const location = addLocation();
	const tagCollection = addTagCollection();
	const personsCount = addPersonsCount();
	const objectsCount = addObjectsCount();

	if(!data.ignoreLODs) {
		OnZoom(data, 0.35, [LODStyle(label.select("text"), "class", "hidden", (k) => k < 0.35)]);
		OnZoom(data, 0.7, [
			LODStyle(tagCollection, "class", "hidden", (k) => k < 0.7),
			LODStyle(location, "class", "hidden", (k) => k < 0.7),
			LODStyle(persons, "class", "hidden", (k) => k < 0.7),
			LODStyle(personsCount, "class", "hidden", (k) => k < 0.7),
			LODStyle(objects, "class", "hidden", (k) => k < 0.7),
			LODStyle(objectsCount, "class", "hidden", (k) => k < 0.7),
		]);
	}

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
				<g transform="matrix(4.16667,0,0,4.16667,-46.0579,-0.1)">
					<g id="header">
						<g id="map">
							<g id="background" transform="matrix(1,0,0,1,382.106,216.5)">
								<path d="M-199.832,323.5C-199.829,318.167 -198.453,312.832 -195.706,308.074L-26.759,15.45C-21.257,5.92 -11.004,0 0,0L337.894,0C348.897,0 359.151,5.92 364.654,15.45L533.601,308.074C536.348,312.832 537.724,318.167 537.727,323.5L-199.832,323.5Z" style="fill:rgb(240,240,240);"/>
							</g>
							<g id="forest" transform="matrix(0.24,0,0,0.24,0,0)">
								<path d="M1845.96,902.083L3000,902.083C3045.85,902.083 3088.57,926.75 3111.5,966.458L3223.44,1160.33L2850.78,1434.9C2821.2,1456.71 2785.87,1469.36 2749.17,1471.3C2684.49,1474.72 2579.45,1480.27 2518.55,1483.49C2487.14,1485.15 2455.83,1478.91 2427.46,1465.34C2329.93,1418.67 2090.32,1304.02 1948.66,1236.23C1881.76,1204.22 1839.92,1135.89 1841.84,1061.75L1845.96,902.083Z" style="fill:rgb(178,217,184);"/>
							</g>
							<g id="street" transform="matrix(0.24,0,0,0.24,0,0)">
								<path d="M932.94,1915.06C1064.12,1917.64 1193.51,1926.94 1320.72,1944.33C1324.18,1944.8 1327.61,1945.51 1330.98,1946.44L1376.47,1959.04L1428.57,1713.21C1431.98,1697.16 1436.85,1681.45 1443.13,1666.29C1450.44,1648.68 1460.88,1623.48 1470.49,1600.32C1486.46,1561.79 1513.02,1528.58 1547.09,1504.53C1547.09,1504.53 1547.09,1504.53 1547.09,1504.53C1600.1,1467.12 1663.75,1447.8 1728.6,1449.44C1877.18,1453.21 2145.68,1460.01 2208.22,1461.59C2216.98,1461.82 2225.62,1463.73 2233.66,1467.22C2238.37,1469.27 2244.12,1471.77 2250.34,1474.48C2285.73,1489.87 2305.64,1527.81 2298.19,1565.68C2298.19,1565.68 2298.19,1565.68 2298.19,1565.68C2297.44,1569.52 2295.91,1573.16 2293.71,1576.39C2282.17,1593.31 2243.45,1650.1 2220.74,1683.4C2216.3,1689.9 2214.72,1697.94 2216.35,1705.65C2217.99,1713.35 2222.7,1720.05 2229.4,1724.2C2256.78,1741.15 2299.82,1767.79 2326.52,1784.32C2332.66,1788.12 2336.93,1794.32 2338.26,1801.42C2339.6,1808.52 2337.89,1815.85 2333.56,1821.63C2333.56,1821.63 2333.56,1821.63 2333.56,1821.63C2329.45,1827.09 2321.91,1828.62 2316.01,1825.19C2295.07,1813 2247.75,1785.49 2225.16,1772.34C2216.89,1767.53 2209.25,1761.7 2202.43,1754.98C2196.47,1749.11 2188.61,1741.38 2180.81,1733.7C2163.5,1716.65 2162.13,1689.17 2177.66,1670.49C2194.23,1650.56 2214.66,1625.98 2228.11,1609.8C2237.51,1598.49 2243.39,1584.67 2245.01,1570.05C2245.01,1570.05 2245.01,1570.05 2245.01,1570.05C2247.99,1543.27 2233.41,1517.61 2208.88,1506.46C2207.52,1505.84 2206.16,1505.23 2204.82,1504.62C2184.88,1495.55 2163.26,1490.78 2141.36,1490.61L2044.18,1489.84C2044.54,1661.28 2037.08,1831.53 2022.6,2000.68C2129.3,2004.78 2236.37,2008.72 2343.66,2013.15C2363.78,1994.88 2383.88,1976.34 2403.94,1957.47C2421.41,1940.98 2437.46,1923.04 2451.92,1903.86C2469.98,1879.97 2496.45,1844.86 2518.97,1814.99C2546.48,1778.49 2556.15,1731.56 2545.31,1687.16C2530.62,1626.97 2511.8,1549.87 2511.8,1549.87L2602.69,1597.75C2602.69,1597.75 2607.02,1640.94 2610.15,1672.18C2610.67,1677.35 2614.28,1681.67 2619.26,1683.11C2624.25,1684.54 2629.61,1682.8 2632.79,1678.7C2644.46,1663.66 2657.07,1647.43 2657.07,1647.43L2734.09,1739.67C2587.58,1887.19 2445.55,2019.22 2308.76,2142.37C2448.48,2178.89 2597.6,2192.62 2755.73,2184.53L2743.64,2250L2630.37,2250C2503.94,2244.2 2379.02,2223.89 2255.48,2190.14C2232.89,2210.31 2210.46,2230.26 2188.19,2250L2074.81,2250C2147.14,2185.79 2221.11,2122.6 2295.28,2056.62C2181.63,2055.58 2067.48,2052.83 1952.84,2048.38C1951.18,2059.49 1948.97,2074.29 1946.97,2087.54C1943.6,2110.11 1935.83,2131.8 1924.09,2151.37C1901.83,2188.57 1878.56,2221.75 1854.04,2250L1793.35,2250C1827.49,2213.29 1857,2172.09 1881.06,2125.57C1887.47,2113.17 1892.38,2100.05 1895.66,2086.48L1905.34,2046.44C1742.6,2039.46 1578.85,2029.05 1414.09,2015.19C1412.32,2015.05 1410.56,2014.86 1408.8,2014.62L1382.13,2133.2C1377.63,2153.2 1388.56,2173.47 1407.76,2180.69C1454.56,2198.3 1539.31,2230.17 1588.34,2248.62C1589.4,2249.01 1590.42,2249.48 1591.41,2250L1476.49,2250L1393.62,2216.92C1374.04,2209.1 1351.71,2217.37 1341.95,2236.06L1334.67,2250L1286.48,2250L1321.55,2179.94C1330.88,2161.31 1337.79,2141.56 1342.11,2121.18L1366.86,2004.37C1349.51,1999.7 1330.78,1994.65 1322.18,1992.34C1318.95,1991.47 1315.67,1990.81 1312.36,1990.36C1177.37,1972.08 1042.38,1962.29 907.407,1959.28L932.94,1915.06ZM3546.38,1719.69L3303.59,1843.91C3287.71,1852.03 3272.61,1861.59 3258.46,1872.45C3207.51,1911.59 3080.1,2009.46 3045.45,2036.08C3039.57,2040.6 3033.53,2044.9 3027.35,2048.99C2989.98,2073.7 2852.52,2164.62 2852.52,2164.62L2835.52,2250L2986.81,2250L3144.28,2072.85C3159.11,2056.16 3175.37,2040.79 3192.86,2026.91C3229.59,1997.76 3296.9,1944.34 3342.64,1908.04C3374.34,1882.88 3409.31,1862.15 3446.6,1846.43L3585.69,1787.77L3546.38,1719.69ZM2000.09,1489.49L1736.34,1487.41C1675.21,1486.93 1615.68,1506.92 1567.24,1544.2C1567.24,1544.2 1567.24,1544.2 1567.24,1544.2C1557.77,1551.49 1549.88,1560.63 1544.06,1571.06C1533.38,1590.22 1515.13,1622.93 1501.67,1647.08C1490.36,1667.35 1482.03,1689.14 1476.93,1711.79L1418.79,1970.26C1422.95,1971.01 1427.16,1971.53 1431.39,1971.81C1612.29,1983.88 1795.22,1991.82 1979.4,1999.01C1999.61,1829.17 2008.04,1659.33 2000.09,1489.49ZM3218.6,1151.96C3090.51,1269.25 2963.32,1343.01 2800.78,1438.05C2789.76,1444.49 2778.01,1449.58 2765.77,1453.18C2701.66,1471.99 2584.96,1483.57 2499.74,1465.65L2673.34,1567.12C2688.99,1568.84 2725.79,1564.17 2760.95,1546.99C2762.12,1546.4 2763.53,1546.74 2764.3,1547.79C2765.06,1548.84 2764.96,1550.29 2764.05,1551.21C2748.49,1567.11 2724.15,1591.93 2724.15,1591.93L2783.43,1680.56C2783.43,1680.56 2847.15,1623.54 2881.2,1593.07C2883.22,1591.26 2886.24,1591.12 2888.44,1592.72C2890.63,1594.33 2891.4,1597.26 2890.28,1599.73C2860.87,1667.15 2840.08,1749.14 2839.06,1807.39L2883.05,1969.67C2882.55,1853.63 2893.54,1721.31 2954.15,1604.05C2956.13,1600.22 2958.26,1596.48 2960.53,1592.82C2974.08,1570.87 3031.19,1478.59 3054.68,1440.64C3061.43,1429.74 3069.32,1419.57 3078.21,1410.33L3259.12,1222.14L3218.6,1151.96ZM2360.69,902.083L2301.86,902.083C2127.8,1051.92 1928.97,1205.95 1711.5,1363.14C1706.49,1366.76 1703.13,1372.25 1702.2,1378.36C1701.26,1384.48 1702.81,1390.71 1706.51,1395.67C1706.51,1395.68 1706.52,1395.68 1706.52,1395.68C1712.43,1403.61 1723.63,1405.3 1731.62,1399.47C1951.03,1239.37 2150.83,1068.84 2360.69,902.083Z" style="fill:white;"/>
							</g>
							<g id="highway" transform="matrix(0.24,0,0,0.24,0,0)">
								<path d="M1589.85,902.103C1775.72,1038.66 2147.14,1263.95 2697.22,1574.69C2755.73,1607.73 2798.59,1662.81 2816.25,1727.64C2833.6,1791.32 2855.58,1872.02 2871.3,1929.75C2884.61,1978.62 2886.65,2029.88 2877.25,2079.65L2845.11,2250L2729.23,2250L2763.49,2092.62C2776.03,2035.02 2774.25,1975.22 2758.3,1918.48C2749.51,1887.19 2739.35,1851.06 2729.64,1816.52C2705.29,1729.88 2646.14,1657.2 2566.25,1615.76C2184.28,1417.27 1820.36,1203.16 1478.65,969.864L1480.61,966.458C1503.16,927.405 1544.86,902.901 1589.85,902.103Z" style="fill:rgb(249,227,157);"/>
							</g>
						</g>
						<g transform="matrix(1,0,0,1,182.502,216.888)">
							<path d="M0,323.047C0.082,317.794 1.507,312.627 4.136,308.074L173.083,15.449C178.584,5.92 188.838,0 199.842,0L537.736,0C548.741,0 558.994,5.92 564.496,15.449L733.443,308.074C736.071,312.626 737.497,317.793 737.578,323.047L0,323.047Z" style="fill:rgb(64,64,64);fill-opacity:0.75;fill-rule:nonzero;"/>
						</g>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,-46.0579,-0.1)">
					<g id="objects" transform="matrix(1.5,0,0,1.5,568.916,804.133)">
						<rect x="2" y="7" width="7" height="15" style="fill:rgb(244,244,244);fill-rule:nonzero;"/>
						<rect x="9" y="2" width="13" height="20" style="fill:rgb(244,244,244);fill-rule:nonzero;"/>
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
					<g id="persons" transform="matrix(1.5,0,0,1.5,457.94,804.133)">
						<path d="M12,12C6.48,12 2,16.48 2,22L22,22C22,16.48 17.52,12 12,12Z" style="fill:rgb(244,244,244);fill-rule:nonzero;"/>
						<path d="M12,12C14.761,12 17,9.761 17,7C17,4.239 14.761,2 12,2C9.239,2 7,4.239 7,7C7,9.761 9.239,12 12,12Z" style="fill:rgb(244,244,244);fill-rule:nonzero;"/>
					</g>
				</g>
				<g transform="matrix(4.16667,0,0,4.16667,-46.0579,-0.1)">
					<g id="pin" transform="matrix(1,0,0,1,551.291,323.793)">
						<path d="M0,-18.46C2.683,-18.46 4.858,-16.285 4.858,-13.602C4.858,-10.919 2.683,-8.744 0,-8.744C-2.683,-8.744 -4.858,-10.919 -4.858,-13.602C-4.858,-16.285 -2.683,-18.46 0,-18.46M0,12.631C8.744,3.887 17.489,-3.943 17.489,-13.602C17.489,-23.261 9.659,-31.091 0,-31.091C-9.659,-31.091 -17.489,-23.261 -17.489,-13.602C-17.489,-3.943 -8.744,3.887 0,12.631" style="fill:rgb(229,115,115);fill-rule:nonzero;"/>
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
		persons.attr("stroke", "none");
		const objects = frame.select("#objects");
		objects.attr("stroke", "none");
		const pin = frame.select("#pin");
		return {
			body,
			border,
			persons,
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
			CollectionStyle(80, 160, bbox.width * 0.43, bbox.height * 0.955, 80, 80, 1, Alignment.Left),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "140", true),
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
			CollectionStyle(80, 160, bbox.width * 0.59, bbox.height * 0.955, 80, 80, 1, Alignment.Left),
			[
				ShapeStyle("class", "n_text", true),
				ShapeStyle("font-size", "140", true),
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
