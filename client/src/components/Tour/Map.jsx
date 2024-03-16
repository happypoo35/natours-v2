import { useRef, useEffect } from "react";
import pin from "assets/pin.png";
import mapboxgl from "!mapbox-gl"; //eslint-disable-line
import "mapbox-gl/dist/mapbox-gl.css";

const Map = ({ locations }) => {
  mapboxgl.accessToken = process.env.REACT_APP_MAP_TOKEN;
  const mapContainer = useRef(null);
  const map = useRef(null);

  const features = locations.map((el) => {
    return {
      type: "Feature",
      properties: {
        description: `<p><b>Day ${el.day}:</b> ${el.description}</p>`,
      },
      geometry: { type: "Point", coordinates: el.coordinates },
    };
  });

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      cooperativeGestures: true,
    });

    const bounds = new mapboxgl.LngLatBounds();

    features.forEach((el) => {
      bounds.extend(el.geometry.coordinates);
    });

    map.current.on("load", () => {
      map.current.loadImage(pin, (err, img) => {
        if (err) throw err;
        map.current.addImage("pin", img);
      });

      map.current.addSource("locations", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features,
        },
      });

      map.current.addLayer({
        id: "locations",
        type: "symbol",
        source: "locations",
        layout: {
          "icon-image": "pin",
          "icon-allow-overlap": true,
          "icon-size": 0.15,
          "icon-anchor": "bottom",
        },
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 40,
      });

      map.current.on("mouseenter", "locations", (e) => {
        map.current.getCanvas().style.cursor = "pointer";

        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
      });

      map.current.on("mouseleave", "locations", () => {
        map.current.getCanvas().style.cursor = "";
        popup.remove();
      });
    });

    map.current.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
  });

  return (
    <section className="map">
      <div ref={mapContainer} className="map-container" />
    </section>
  );
};

export default Map;
