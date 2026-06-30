/* =========================================================
   FreshStart - Office Locator
   Uses:
   - Google Maps JavaScript API
   - Places API
   - Geocoding API
   - Directions API

   Beginner-friendly code with comments.
========================================================= */

let map;
let geocoder;
let directionsService;
let directionsRenderer;
let placesService;

let userLocation = null;
let userMarker = null;
let officeMarkers = [];
let nearbyOfficeResults = [];

/* 
  A small helper object that maps the dropdown label
  to better search keywords for Google Places.
*/
const serviceSearchMap = {
  "Barangay Clearance": "Barangay Hall",
  "PhilHealth": "PhilHealth office",
  "NBI Clearance": "NBI Clearance Center",
  "SSS Registration": "SSS office",
  "TIN / BIR Registration": "BIR office",
  "Voter's Registration": "COMELEC office",
  "Pag-IBIG Membership": "Pag-IBIG Fund office",
  "PSA Documents": "PSA office",
  "National ID": "PhilSys registration center",
  "Passport": "DFA office",
  "Scholarship Application": "Scholarship office"
};

/**
 * This function is called automatically by the Google Maps script
 * because we used callback=initMap in index.html
 */
function initMap() {
  // Default map center: Manila, Philippines
  const defaultCenter = { lat: 14.5995, lng: 120.9842 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 11,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true
  });

  geocoder = new google.maps.Geocoder();
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map,
    suppressMarkers: true
  });
  placesService = new google.maps.places.PlacesService(map);

  document
    .getElementById("findOfficeBtn")
    .addEventListener("click", handleOfficeSearch);
}

/**
 * Main function when user clicks "Find Nearest Office"
 */
function handleOfficeSearch() {
  const addressInput = document.getElementById("addressInput").value.trim();
  const selectedService = document.getElementById("serviceSelect").value;

  clearMessage();
  clearPreviousResults();

  if (!addressInput) {
    showMessage("Please enter your address.", "error");
    return;
  }

  if (!selectedService) {
    showMessage("Please select a government service.", "error");
    return;
  }

  geocodeAddress(addressInput, selectedService);
}

/**
 * Convert the user's typed address into map coordinates
 */
function geocodeAddress(address, selectedService) {
  geocoder.geocode({ address: address }, (results, status) => {
    if (status !== "OK" || !results[0]) {
      showMessage("Invalid address. Please enter a valid location.", "error");
      return;
    }

    userLocation = results[0].geometry.location;

    // Center map to user location
    map.setCenter(userLocation);
    map.setZoom(13);

    // Show marker for the user's location
    userMarker = new google.maps.Marker({
      position: userLocation,
      map: map,
      title: "Your Location",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#631307",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2
      }
    });

    showMessage("Searching nearby offices...", "success");

    searchNearbyOffices(selectedService);
  });
}

/**
 * Search for nearby offices based on selected service
 */
function searchNearbyOffices(selectedService) {
  const keyword = serviceSearchMap[selectedService] || selectedService;

  const request = {
    location: userLocation,
    radius: 20000, // 20 km search radius
    keyword: keyword
  };

  placesService.nearbySearch(request, (results, status) => {
    if (
      status !== google.maps.places.PlacesServiceStatus.OK ||
      !results ||
      results.length === 0
    ) {
      showMessage("No nearby office found. Please try another location.", "error");
      document.getElementById("officeInfo").innerHTML =
        '<div class="empty-state">No nearby office found. Please try another location.</div>';
      document.getElementById("nearbyOfficesList").innerHTML =
        '<div class="empty-state">No nearby office found.</div>';
      document.getElementById("routeSummary").innerHTML =
        '<div class="empty-state">No route available.</div>';
      return;
    }

    // Get full place details and compute route info for each result
    fetchOfficeDetailsAndDistances(results.slice(0, 8));
  });
}

/**
 * For each nearby result:
 * - get place details
 * - compute driving distance/time from user to office
 * Then sort by nearest office
 */
async function fetchOfficeDetailsAndDistances(places) {
  try {
    const detailedOffices = [];

    for (const place of places) {
      const placeDetails = await getPlaceDetails(place.place_id);
      const routeData = await getRouteInfo(userLocation, place.geometry.location);

      detailedOffices.push({
        placeId: place.place_id,
        name: place.name || "Office Name Unavailable",
        address:
          place.vicinity ||
          placeDetails.formatted_address ||
          "Address unavailable",
        location: place.geometry.location,
        rating: placeDetails.rating || "N/A",
        phone: placeDetails.formatted_phone_number || "Not available",
        hours:
          placeDetails.current_opening_hours &&
          placeDetails.current_opening_hours.weekday_text
            ? placeDetails.current_opening_hours.weekday_text.join("<br>")
            : "Not available",
        mapsUrl: `[google.com](https://www.google.com/maps/place/?q=place_id:${place.place_id})`,
        distanceText: routeData.distanceText,
        durationText: routeData.durationText,
        distanceValue: routeData.distanceValue
      });
    }

    detailedOffices.sort((a, b) => a.distanceValue - b.distanceValue);
    nearbyOfficeResults = detailedOffices;

    renderOfficeMarkers(detailedOffices);
    renderNearestOfficeCard(detailedOffices[0]);
    renderNearbyOfficesList(detailedOffices);
    drawRouteToOffice(detailedOffices[0]);

    showMessage("Nearby offices found successfully.", "success");
  } catch (error) {
    console.error(error);
    showMessage("Something went wrong while searching for offices.", "error");
  }
}

/**
 * Get full details for a place using its place_id
 */
function getPlaceDetails(placeId) {
  return new Promise((resolve) => {
    placesService.getDetails(
      {
        placeId: placeId,
        fields: [
          "name",
          "formatted_address",
          "formatted_phone_number",
          "rating",
          "current_opening_hours",
          "geometry"
        ]
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          resolve({});
        }
      }
    );
  });
}

/**
 * Get distance and duration between user and office using Directions API
 */
function getRouteInfo(origin, destination) {
  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === "OK") {
          const leg = result.routes[0].legs[0];
          resolve({
            distanceText: leg.distance.text,
            durationText: leg.duration.text,
            distanceValue: leg.distance.value
          });
        } else {
          reject("Directions request failed.");
        }
      }
    );
  });
}

/**
 * Draw route on the map from user location to selected office
 */
function drawRouteToOffice(office) {
  directionsService.route(
    {
      origin: userLocation,
      destination: office.location,
      travelMode: google.maps.TravelMode.DRIVING
    },
    (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const leg = result.routes[0].legs[0];
        document.getElementById("routeSummary").innerHTML = `
          <div class="route-summary-grid">
            <div class="route-box">
              <h4>Distance</h4>
              <p>${leg.distance.text}</p>
            </div>
            <div class="route-box">
              <h4>Estimated Travel Time</h4>
              <p>${leg.duration.text}</p>
            </div>
          </div>
        `;
      } else {
        document.getElementById("routeSummary").innerHTML =
          '<div class="empty-state">Unable to calculate route.</div>';
      }
    }
  );
}

/**
 * Show markers for all offices
 * Highlight nearest office with a different marker color
 */
function renderOfficeMarkers(offices) {
  officeMarkers = [];

  offices.forEach((office, index) => {
    const isNearest = index === 0;

    const marker = new google.maps.Marker({
      position: office.location,
      map: map,
      title: office.name,
      animation: google.maps.Animation.DROP,
      icon: {
        url: isNearest
          ? "[maps.google.com](http://maps.google.com/mapfiles/ms/icons/red-dot.png)"
          : "[maps.google.com](http://maps.google.com/mapfiles/ms/icons/blue-dot.png)"
      }
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="max-width: 250px; font-family: Poppins, sans-serif;">
          <h3 style="margin-bottom: 8px; color: #631307; font-size: 16px;">${office.name}</h3>
          <p style="margin-bottom: 6px; font-size: 13px;">${office.address}</p>
          <p style="margin-bottom: 6px; font-size: 13px;"><strong>Distance:</strong> ${office.distanceText}</p>
          <p style="font-size: 13px;"><strong>Travel Time:</strong> ${office.durationText}</p>
        </div>
      `
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
      renderNearestOfficeCard(office);
      drawRouteToOffice(office);
      highlightOfficeCard(office.placeId);
    });

    officeMarkers.push(marker);
  });
}

/**
 * Show the nearest/selected office info in the right panel
 */
function renderNearestOfficeCard(office) {
  const directionsUrl = `[google.com](https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent()
    office.address
  )}`;

  document.getElementById("officeInfo").innerHTML = `
    <div class="info-block">
      <p><strong>Office Name:</strong> ${office.name}</p>
      <p><strong>Complete Address:</strong> ${office.address}</p>
      <p><strong>Distance from User:</strong> ${office.distanceText}</p>
      <p><strong>Estimated Travel Time:</strong> ${office.durationText}</p>
      <p><strong>Office Hours:</strong><br>${office.hours}</p>
      <p><strong>Contact Number:</strong> ${office.phone}</p>
      <p><strong>Google Rating:</strong> ${office.rating}</p>

      <div class="action-buttons">
        <a href="${office.mapsUrl}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer">Get Directions</a>
      </div>
    </div>
  `;
}

/**
 * Show all nearby offices sorted by distance
 */
function renderNearbyOfficesList(offices) {
  const listContainer = document.getElementById("nearbyOfficesList");

  listContainer.innerHTML = offices
    .map(
      (office, index) => `
        <div class="office-card ${index === 0 ? "highlighted" : ""}" data-place-id="${office.placeId}">
          <h4>${office.name}</h4>
          <p class="office-distance">Distance: ${office.distanceText}</p>
          <p>${office.address}</p>
          <a href="${office.mapsUrl}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>
        </div>
      `
    )
    .join("");

  // Add click event so user can select any office from the list
  document.querySelectorAll(".office-card").forEach((card) => {
    card.addEventListener("click", () => {
      const selectedPlaceId = card.dataset.placeId;
      const selectedOffice = nearbyOfficeResults.find(
        (office) => office.placeId === selectedPlaceId
      );

      if (selectedOffice) {
        renderNearestOfficeCard(selectedOffice);
        drawRouteToOffice(selectedOffice);
        highlightOfficeCard(selectedOffice.placeId);

        map.panTo(selectedOffice.location);
        map.setZoom(14);
      }
    });
  });
}

/**
 * Add highlight style to selected office card
 */
function highlightOfficeCard(placeId) {
  document.querySelectorAll(".office-card").forEach((card) => {
    card.classList.remove("highlighted");
    if (card.dataset.placeId === placeId) {
      card.classList.add("highlighted");
    }
  });
}

/**
 * Clear previous markers, route, cards, and results
 */
function clearPreviousResults() {
  if (userMarker) {
    userMarker.setMap(null);
  }

  officeMarkers.forEach((marker) => marker.setMap(null));
  officeMarkers = [];
  nearbyOfficeResults = [];

  directionsRenderer.set("directions", null);

  document.getElementById("officeInfo").innerHTML =
    '<div class="empty-state">Select a service and enter your location to see office details.</div>';

  document.getElementById("nearbyOfficesList").innerHTML =
    '<div class="empty-state">Nearby office results will appear here.</div>';

  document.getElementById("routeSummary").innerHTML =
    '<div class="empty-state">Search for an office to view route distance and travel time.</div>';
}

/**
 * Display a message to the user
 */
function showMessage(message, type) {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;
}

/**
 * Remove current message
 */
function clearMessage() {
  const messageBox = document.getElementById("messageBox");
  messageBox.textContent = "";
  messageBox.className = "message-box";
}
