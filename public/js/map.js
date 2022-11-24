mapboxgl.accessToken =
    "pk.eyJ1IjoibG9pYy1kdXZhaWwiLCJhIjoiY2w2czIyMXhwMHA0cjNmcGJ2enE2dGp1ZCJ9.SweNNTZ_-Izbqr718xshkg";

function loadMap() {
    var map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/loic-duvail/cl6s2d5lq00it14pdm9s57rvy",
        center: [2.5435926664247117, 46.85818708573365],
        zoom: 4.8,
    });

    const geojson = {
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [-1.6767725597884877, 48.10880703554323],
                },
                properties: {
                    title: "",
                    description: "Je suis situé sur Rennes",
                },
            },
        ],
    };

    // add markers to map
    for (const feature of geojson.features) {
        // create a HTML element for each feature
        const el = document.createElement("div");
        el.className = "marker";

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(feature.geometry.coordinates)
            .addTo(map)
            .setPopup(
                new mapboxgl.Popup({ offset: 25 }) // add popups
                    .setHTML(
                        `<h3>${feature.properties.title}</h3><p>${feature.properties.description}</p>`
                    )
            )
            .addTo(map);
    }

    //when map loaded, make it appear smoothly instead of directly
    //to avoid buggy feel
    map.on("load", () => {
        document.getElementById("map").style.opacity = 1;
    });
}
