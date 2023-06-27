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

// WMTS und Leaflet TileLayerProvider Hintergrundlayer und thematische Layer 
let layercontrol = L.control.layers({
    "Esri WorldTopoMap": L.tileLayer.provider("Esri.WorldTopoMap").addTo(map),
    "Orthofoto": L.tileLayer.provider("BasemapAT.orthofoto"),
    "Geländeschummerung": L.tileLayer.provider("BasemapAT.surface")
}, {
    "ÖPNV-Bus": themaLayer.stops_bus.addTo(map),
    "ÖPNV-Tram": themaLayer.stops_tram.addTo(map),
    "Hütten": themaLayer.huetten.addTo(map)
}).addTo(map)

layercontrol.expand()

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Mini Map 
let miniMap = new L.Control.MiniMap(L.tileLayer.provider("OpenStreetMap.DE"), { toggleDisplay: true, minimized: true }).addTo(map);

//Lokalisierungsservice
map.locate({ watch: true, maxZoom: 18 });
//Funktionen für Events Lokalisierung gefunden oder Error message
map.on('locationerror', function onLocationError(evt) {
    alert(evt.message);
});

const circle = L.circle([0, 0]).addTo(map);
const marker = L.marker([0, 0]).addTo(map);

map.on('locationfound', function onLocationFound(evt) {
    console.log(evt)
    let radius = Math.round(evt.accuracy)
    marker.setLatLng(evt.latlng)
    marker.bindTooltip(`Sie befinden sich in einem Umkreis von ca. ${radius} Meter von diesem Punkt. `).openTooltip();
    circle.setLatLng(evt.latlng);
    circle.setRadius(radius)
});

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
fetch("data/huetten_tirol_reduced.geojson")
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
fetch("data/bus_stop_reduced.geojson")
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
fetch("data/tram_stop_reduced.geojson")
    .then(response => response.json())
    .then(jsondata => {
        writeTramLayer(jsondata);
    })
    .catch(error => {
        console.error("Error fetching GeoJSON data:", error);
    });

let gpxfiles = ['data/GPX_hike/aldranser-alm.gpx', 'data/GPX_hike/adlerweg-etappe-14-innsbruck--solsteinhaus.gpx','data/GPX_hike/adlerweg-etappe-13-innsbruck--zirbenweg--innsbruck.gpx', 'data/GPX_hike/almenweg-1600-fuenf-almen-am-patscherkofel,gpx','data/GPX_hike/almtour-birgitzkoepflhaus-muttereralm-goetzner-alm-birgitzeralm','data/GPX_hike/almtour-birgitzkoepflhaus-muttereralm-goetzner-alm-birgitzeralm.gpx','data/GPX_hike/alpenrosensteig-14a-rundwanderung.gpx','data/GPX_hike/arzler-alm-rumer-alm-enzian-huette','data/GPX_hike/arzler-alm-rumer-alm-enzian-huette','data/GPX_hike/arzler-alm-rumer-alm-enzian-huette.gpx','data/GPX_hike/arzler-alm-rumer-alm-enzian-huette.gpx','data/GPX_hike/axamer-lizum-zum-halsl-und-weiter-zur-sailenockspitze','data/GPX_hike/bergheim-fotsch-schmalzgrube-sellrain16.gpx','data/GPX_hike/faltegartenkoepfl.gpx','data/GPX_hike/geisterwanderweg-oberperfuss.gpx','data/GPX_hike/hungerburg-brandjochkreuz-sadrach.gpx','data/GPX_hike/hungerburg-gramart-hoettingerbild','data/GPX_hike/inntaler-hoehenweg-etappe-1.gpx','data/GPX_hike/juifenalm-25.gpx','data/GPX_hike/praxmar-westfalenhaus-33.gpx','data/GPX_hike/rum-thaurer-alm-rumer-alm.gpx','data/GPX_hike/sellrainer-huettenrunde-3.-etappe.gpx','data/GPX_hike/sellrain-potsdamer-huette.gpx','data/GPX_hike/sellraintaler-hoehenwanderweg.gpx','data/GPX_hike/st.-sigmund-pforzheimer-huette-145.gpx','data/GPX_hike/wanderung-ueber-die-arzler-alm-zur-hoettinger-alm.gpx','data/GPX_hike/wanderung-zum-rauschbrunnen.gpx','data/GPX_hike/wendelinsteig-714-bis-rechenhof-und-schoenblick.gpx','data/GPX_hike/Mutters-Kreitheralm-Kreith.gpx','data/GPX_hike/wandertour-am-patscherkofel-sistranser-alm-und-almgasthaus-b.gpx','data/GPX_hike/rundwandertour-auf-den-patscherkofel.gpx'];

gpxfiles.forEach(function(gpxFile) {
  new L.GPX(gpxFile, { async: true }).on('loaded', function(e) {
    map.fitBounds(e.target.getBounds());
  }).addTo(map);
});

  // Load each GPX file separately
  gpxFiles.forEach((gpxFile) => {
    const gpxFilePath = path.join(gpxDirectory, gpxFile);
    new L.GPX(gpxFilePath, { async: true }).on('loaded', (e) => {
      const gpxLayer = e.target;
      map.fitBounds(gpxLayer.getBounds());
      gpxLayer.addTo(map);
    });
  });