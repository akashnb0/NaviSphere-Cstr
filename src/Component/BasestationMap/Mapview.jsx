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
const MAX_ZOOM = 15;

const MapView = () => {
    const { basemountpoint, subid } = useParams();
    const mapElement = useRef();
    const [map, setMap] = useState({});
    const [GPST, setGPST] = useState(null);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [height, setHeight] = useState(null);
    const [Q,setQ]=useState(null);
    const [ns,setNs]=useState(null);
    const [sdn,setSdn]=useState(null);
    const [sde,setSde]=useState(null);
    const [sdu,setSdu]=useState(null);
    const [sdne,setSdne]=useState(null);
    const [sdeu,setSdeu]=useState(null);
    const [sdun,setSdun]=useState(null);
    const [age,setAge]=useState(null);
    const [ratio,setRatio]=useState(null);
    const[timestamp,setTimestamp]=useState(null);
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [receivedData, setReceivedData] = useState([]); // State to hold received data
    const [newGreenMarkerCoordinates, setNewGreenMarkerCoordinates] = useState({ latitude: 0, longitude: 0 });
  // Add this line at the beginning of your component
  const [nearbyLocations, setNearbyLocations] = useState([]);
  
    const mapView = useRef(null); // Add this line to create a ref
  
    
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
        const { latitude, longitude, } = lastJsonMessage.data;
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
        zoom: 10,
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
        const { GPST,latitude, longitude, height,Q,ns,sdn,sde,sdu,sdne,sdeu,sdun,age,ratio,timestamp } = lastJsonMessage.data;
  
        // Store received data into an array of objects
        const newData = [...receivedData, { latitude, longitude, height ,q:Q,ns,sdn,sde,sdu,sdne,sdeu,sdun,age,ratio,timestamp,mountpoint:GPST}];
        console.log(newData);
        
        setReceivedData(newData);
        setGPST(GPST);
        setLat(latitude);
        setLng(longitude);
        setHeight(height);
        setQ(Q);
        setNs(ns);
        setSdn(sdn);
        setSde(sde);
        setSdu(sdu);
        setSdne(sdne);
        setSdeu(sdeu);
        setSdun(sdun);
        setAge(age);
        setRatio(ratio);
        setTimestamp(timestamp);
        updateMap();
      }
    }, [lastJsonMessage]);
  
    const handleConnect = () => {
      sendJsonMessage({ action: "connectToCaster" });
      setConnectionStatus("Connected to Caster");
    };
  
    const handleStopStreaming = () => {
      sendJsonMessage({ action: "stopStreaming" });
      setConnectionStatus("Streaming of data stopped...");
    };
  
    const handleClose = async () => {
      console.log("receivedData");
      sendJsonMessage({ action: "closeConnection" });
      setConnectionStatus("Disconnected");
    
      try {
        // Get the user details, including subscriptions
        const responseUserDetails = await fetch('/api/users/all-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any headers needed for authentication if required
          },
        });
    
        if (!responseUserDetails.ok) {
          throw new Error('Failed to fetch user details');
        }
    
        const userData = await responseUserDetails.json();
    
        // Find the specific subscription you want to update (you might need to adjust this logic)
        const subscription = userData.subscriptions.find(sub => sub.basemountpoint === basemountpoint);
    
        if (subscription) {
          // Make a PUT request to update the baseStationData for the subscription
          const responseUpdateData = await fetch(`/api/users/update-base-station-data/${userData._id}/${subscription._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              // Add any headers needed for authentication if required
            },
            body: JSON.stringify({ receivedData }),
          });
    
          if (!responseUpdateData.ok) {
            throw new Error('Failed to update base station data');
          }
    
          const responseData = await responseUpdateData.json();
          console.log(responseData.message);
        }
      } catch (error) {
        console.error('Error handling close:', error.message);
      }
    };
    
    // ...
  
    useEffect(() => {
        fetch("/Nearbybasestation.json")
          .then(response => response.json())
          .then(data => {
            setNearbyLocations(data);
            addBaseStationMarkers(data);
            updateMap();
          })
          
          .catch(error => console.error("Error fetching JSON data:", error));
          
          
      }, []);
      
  
  // const addLocationMarkerOnMap = (location) => {
  //   if (map && location.latitude && location.longitude) {
  //     const coordinates = [
  //       parseFloat(location.longitude),
  //       parseFloat(location.latitude),
  //     ];
  
  //     new tt.Marker({
  //       color: '#0000FF', // Blue color for locations
  //     })
  //       .setLngLat(coordinates)
  //       .addTo(map)
  //       .setPopup(new tt.Popup().setHTML(`Latitude: ${location.latitude}<br>Longitude: ${location.longitude}`));
  //   }
  // };
  
  // ...
  
  
  const addBaseStationMarkers = (locations) => {
    // Add a marker for the new green marker
    if (map && newGreenMarkerCoordinates.latitude && newGreenMarkerCoordinates.longitude) {
      const newGreenMarkerCoordinatesArray = [
        parseFloat(newGreenMarkerCoordinates.longitude),
        parseFloat(newGreenMarkerCoordinates.latitude),
      ];
  
      new tt.Marker({
        color: '#00FF00' // Green color for the new marker
      })
        .setLngLat(newGreenMarkerCoordinatesArray)
        .addTo(map)
        .setPopup(new tt.Popup().setHTML(`Latitude: ${newGreenMarkerCoordinates.latitude}<br>Longitude: ${newGreenMarkerCoordinates.longitude}`));
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
  
  useEffect(() => {
    addBaseStationMarkers(nearbyLocations); // Use the nearbyLocations state
  }, [newGreenMarkerCoordinates, nearbyLocations]);
  
    const handleSendRequest = async () => {
      try {
        const response = await fetch('/api/users/all-details', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any headers needed for authentication if required
          },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
    
        const userData = await response.json();
        if (userData.subscriptions.length > 0) {
          const subscription = userData.subscriptions.find(sub => sub.basemountpoint === basemountpoint);
    
          if (subscription) {
            const SubscriptionDelay = subscription.delay;
            const Subscriptionusername = subscription.username;
            const Subscriptionpwd = subscription.passsword;
    
            const data = {
              action: "sendRequest",
              username: Subscriptionusername,
              password: Subscriptionpwd,
              mountPoint: basemountpoint,
              delay: SubscriptionDelay
            };
            console.log("exiting handlesenreq");
            sendJsonMessage(data);
    
    
            
          
        }
        }
      } catch (error) {
        console.error('Error fetching user details:', error.message);
      }
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
  
  
  
   

  return (
    <>
    <center>
    <Container  className="mapviewcontainer">
      <Row>
        <Col xs="12">
          <div ref={mapElement} className="mapDiv" />
        </Col>
      </Row>
    </Container>
    </center>
    </>
  );
};

export default MapView;
