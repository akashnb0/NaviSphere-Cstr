import React, { useEffect, useState, useRef } from "react";
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from "react-use-websocket";
import * as tt from "@tomtom-international/web-sdk-maps";
import {
  Container,
  Col,
  Row,
} from "reactstrap";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "./Map.css";

const WS_URL = "ws://127.0.0.1:8080";
const MAX_ZOOM = 50;

const MapView = () => {
  const { basemountpoint } = useParams();
  const mapElement = useRef();
  const [map, setMap] = useState({});
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [nearbyLocations, setNearbyLocations] = useState([]);

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      share: false,
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`Got a new message: ${JSON.stringify(lastJsonMessage.data)}`);
      const { latitude, longitude } = lastJsonMessage.data;
      setLat(latitude);
      setLng(longitude);
      updateMap();
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    let map = tt.map({
      key: "lA2ONWjNjuFjGxJC4oAlV2IQJrgTpAXi",
      container: mapElement.current,
      center: [0, 0], // Default center, will be updated later
      zoom: 100,
      language: "en-GB",
    });

    map.addControl(new tt.FullscreenControl());
    map.addControl(new tt.NavigationControl());
    setMap(map);

    return () => map.remove();
  }, []);

  useEffect(() => {
    const connectionStatusMessages = {
      [ReadyState.CONNECTING]: "Connecting to Caster...",
      [ReadyState.OPEN]: "OPEN",
      [ReadyState.CLOSING]: "Disconnecting...",
      [ReadyState.CLOSED]: "Disconnected",
    };

    setConnectionStatus(connectionStatusMessages[readyState]);
  }, [readyState]);

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(`Got a new message: ${JSON.stringify(lastJsonMessage.data)}`);
      const { latitude, longitude } = lastJsonMessage.data;
      setLat(latitude);
      setLng(longitude);
      updateMap();
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    fetch("/Nearbybasestation.json")
      .then(response => response.json())
      .then(data => {
        setNearbyLocations(data);
        const initialCoordinates = data.length > 0 ? data[0] : { latitude: 0, longitude: 0 };
        addBaseStationMarkers(data);
        updateMap();
      })
      .catch(error => console.error("Error fetching JSON data:", error));
  }, []);

  const handleConnect = () => {
    sendJsonMessage({ action: "connectToCaster" });
    setConnectionStatus("Connected to Caster");
  };

  const handleClose = () => {
    console.log("Closing connection");
    sendJsonMessage({ action: "closeConnection" });
    setConnectionStatus("Disconnected");
  };

  const updateMap = () => {
    if (map && lat && lng) {
      map.setCenter([parseFloat(lng), parseFloat(lat)]);
      map.setZoom(MAX_ZOOM);
      addMarker();
    }
  };

  const addMarker = () => {
    if (map && lat && lng) {
      const targetCoordinates = [parseFloat(lng), parseFloat(lat)];

      const existingMarker = map.getLayer('roverMarker');

      if (existingMarker) {
        existingMarker.setLngLat(targetCoordinates);
      } else {
        const marker = new tt.Marker({
          color: '#FF0000'
        })
          .setLngLat(targetCoordinates)
          .addTo(map)
          .setPopup(new tt.Popup().setHTML("Real Time Rover Location"));

        marker._element.id = 'roverMarker';
      }
    }
  };

  const addBaseStationMarkers = (locations) => {
    // Add a marker for the green marker
    if (map && locations.length > 0) {
      const greenMarkerCoordinatesArray = [
        parseFloat(locations[0].longitude),
        parseFloat(locations[0].latitude),
      ];

      new tt.Marker({
        color: '#00FF00' // Green color for the marker
      })
        .setLngLat(greenMarkerCoordinatesArray)
        .addTo(map)
        .setPopup(new tt.Popup().setHTML(`Green Marker<br>Latitude: ${locations[0].latitude}<br>Longitude: ${locations[0].longitude}`));
    }

    // Add markers for all locations
    locations.forEach(location => {
      if (map && location.latitude && location.longitude) {
        const coordinates = [
          parseFloat(location.longitude),
          parseFloat(location.latitude),
        ];

        new tt.Marker({
          color: '#0000FF', // Blue color for locations
        })
          .setLngLat(coordinates)
          .addTo(map)
          .setPopup(new tt.Popup().setHTML(`Base Station<br>Latitude: ${location.latitude}<br>Longitude: ${location.longitude}`));
      }
    });
  };

  return (
    <Container className="mapviewcontainer">
      <Row>
        <Col xs="12">
          <div ref={mapElement} className="mapDiv" />
        </Col>
      </Row>
    </Container>
  );
};

export default MapView;
