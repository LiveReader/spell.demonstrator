const scenarios = [
    {
        label: "Zugentgleisung",
        graphFiles: [
            "unfall.json",
            "sturz.json",
            "transport.json",
            "zugentgleisung.json",
            "Brand L523.json",
            "E-Call.json",
            "Hausnotruf.json",
            "Apple Watch.json",
            "Dialyse.json",
        ],
        closureFiles: [
            "closure1.json",
            "closure2.json",
            "closure3.json",
        ],
        trafficJamFiles: [
            "traffic_jam1.json",
        ],
    },
    {
        label: "Brand in der Gartenanlage",
        graphFiles: [
            "Brand Gartenanlage.json",
        ],
        cloudFiles: [
            "cloud.json",
        ],

    },
    {
        label: "Verletzte in der Gartenanlage",
        graphFiles: [
            "Verletzte Gartenanlage.json",
        ],
        cloudFiles: [
            "cloud2.json",
        ],
    },
    {
        label: "Augen-/ Atemwegsreizungen",
        graphFiles: [
            "Atemwegsreizung 1.json",
            "Atemwegsreizung 2.json",
            "Atemwegsreizung 3.json",
            "Atemwegsreizung 4.json",
            "Atemwegsreizung 5.json",
        ],
        // meetingPointFiles: [
        //     "meeting_point.json",
        // ],
        cloudFiles: [
            "cloud3.json",
        ],
    },
];

const operationalAreas = [
    "vermka_rlp.6.geojson",
];

const samplePoints = {
    ludwigshafen: [49.4704113, 8.4381568],
    bridge: [49.48189951214223, 8.458592891693117],
    station: [49.4764344146968, 8.432521820068361],
    rheingoenheim: [49.44269710566854, 8.417619077780465],
    kaefertal: [49.50942310213057, 8.517818007391345],
    lindenhof: [49.472413664609626, 8.468794078498757],
    ruchheim: [49.4723270557513, 8.328341303731001],
    ludwigshafenBounds: [
        [49.006059, 8.247909],
        [49.940137, 8.565615],
    ],
    worldBounds: [
        [-360, -180],
        [360, 180],
    ],
};

/** geojson styles */
let defaultGJStyle = {
    fillColor: '#000',
    weight: 2,
    opacity: 1,
    color: '#fff',
    fillOpacity: 0.25,
};
let invertedMapStyle = {
    ...defaultGJStyle,
    opacity: 0,
};
let closureGJStyle = {
    ...defaultGJStyle,
    color: '#f00',
    dashArray: '1 4',
};
let trafficJamGJStyle = {
    ...defaultGJStyle,
    color: '#f0f',
};
let cloudGJStyle = {
    ...defaultGJStyle,
    fillColor: '#ff9f00',
    color: '#ff7a00',
    weight: 1,
}

const GJStyles = {
    defaultGJStyle,
    invertedMapStyle,
    closureGJStyle,
    trafficJamGJStyle,
    cloudGJStyle,
};

export { scenarios, operationalAreas, samplePoints, GJStyles };