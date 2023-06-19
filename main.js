// Innsbruck
let ibk = {
    lat: 47.267222,
    lng: 11.392778
};

// Karte initialisieren
let map = L.map("map", {
    fullscreenControl: true
}).setView([ibk.lat, ibk.lng], 13);

// thematische Layer
let themaLayer = {
    routen: L.featureGroup(),
    stops_bus: L.markerClusterGroup({ maxZoom: 22 }),
    stops_tram: L.markerClusterGroup({ maxZoom: 22 }),
    huetten: L.featureGroup()
}

// WMTS und Leaflet TileLayerProvider Hintergrundlayer
let layercontrol = L.control.layers({
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap"),
    "BasemapAT Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto").addTo(map)
}, {
    "Mountainbikerouten": themaLayer.routen,
    "ÖPNV-Bus": themaLayer.stops_bus,
    "ÖPNV-Tram": themaLayer.stops_tram,
    "Hütten": themaLayer.huetten
}).addTo(map)

layercontrol.expand()

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Mini Map 
let miniMap = new L.Control.MiniMap(L.tileLayer.provider("OpenStreetMap.DE"), { toggleDisplay: true, minimized: true }).addTo(map);

// Rainviewer Plugin
L.control.rainviewer({
    position: 'bottomleft',
    nextButtonText: '>',
    playStopButtonText: 'Play/Stop',
    prevButtonText: '<',
    positionSliderLabelText: "Hour:",
    opacitySliderLabelText: "Opacity:",
    animationInterval: 500,
    opacity: 0.5
}).addTo(map);

// Hütten 
function writeHuettenLayer(jsondata) {
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/restaurant.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`
            <h1>${prop.name}, ${prop.ele || ""} m ü.A. </h1><ul>
                <li>Öffnungszeiten: ${prop.opening_ho || "-"}</li>
                <li>Website: ${prop.contact_we || "-"}</li>
                <li>Telefon: ${prop.phone || "-"}</li>
                <li>Email: ${prop.email || "-"}</li>
            </ul>
        `);
        }
    }).addTo(themaLayer.huetten);
}
//Funktion ausführen, indem JSON gefetched wird
fetch("data/Hütten_Tirol.geojson")
    .then(response => response.json())
    .then(jsondata => {
        writeHuettenLayer(jsondata);
    })
    .catch(error => {
        console.error("Error fetching GeoJSON data:", error);
    });
//Haltestellen (Bus)
function writeBusLayer(jsondata) {
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/busstop_1.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`
            <h1>${prop.name}
        `);
        }
    }).addTo(themaLayer.stops_bus);
}
//Funktion ausführen, indem JSON gefetched wird
fetch("data/bus_stop.geojson")
    .then(response => response.json())
    .then(jsondata => {
        writeBusLayer(jsondata);
    })
    .catch(error => {
        console.error("Error fetching GeoJSON data:", error);
    });
// Haltestellen (Tram)

function writeTramLayer(jsondata) {
    L.geoJSON(jsondata, {
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/tramstop_1.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            let prop = feature.properties;
            layer.bindPopup(`
            <h1>${prop.name}
        `);
        }
    }).addTo(themaLayer.stops_tram);
}
//Funktion ausführen, indem JSON gefetched wird
fetch("data/tram_stop.geojson")
    .then(response => response.json())
    .then(jsondata => {
        writeTramLayer(jsondata);
    })
    .catch(error => {
        console.error("Error fetching GeoJSON data:", error);
    });