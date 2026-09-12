
import { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Navbar/navbar";
import { useNavigate } from "react-router-dom";
import SearchBar from "../../components/searchBar/searchBar";
import Card from "../../components/propertyCard/propertyCard";
import Sidebar from "../../components/sideBar/sideBar";
import "../../styles/Home.css";
import { apiFetch } from "../../utils/apiFetch";
import { isAuthenticated } from "../../utils/auth";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* =========================================================
   CONSTANTS
========================================================= */

const API_URL =
  "https://real-estate-market-place-api.vercel.app/api/v1";

const LOCATION_KEY = "novaPreferredLocation";
const SEARCH_KEY = "novaLastSearch";
const LOCATION_SETUP_KEY = "novaLocationSetup";
/* =========================================================
   PROPERTY MAP ICON
========================================================= */

const createPropertyIcon = (listingType, isSelected) => {
  const color =
    listingType === "rent" ? "#9b5de5" : "#d4af37";

  return L.divIcon({
    className: `property-map-marker ${
      isSelected ? "marker-selected" : ""
    }`,

    html: `
      <div
        class="property-marker-pin ${
          isSelected ? "selected" : ""
        }"
        style="background: ${color};"
      >
        <i class="fa-solid fa-house"></i>
      </div>
    `,

    iconSize: isSelected ? [52, 52] : [42, 42],
    iconAnchor: isSelected ? [26, 52] : [21, 42],
    popupAnchor: [0, -42],
  });
};

/* =========================================================
   DISTANCE CALCULATION
========================================================= */

const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;
};

/* =========================================================
   FILTER PROPERTIES BY LOCATION
========================================================= */

const getNearbyProperties = (
  properties,
  latitude,
  longitude,
  radius = 10
) => {
  return properties.filter((property) => {
    const coordinates =
      property.location?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2
    ) {
      return false;
    }

    const propertyLongitude =
      Number(coordinates[0]);

    const propertyLatitude =
      Number(coordinates[1]);

    if (
      Number.isNaN(propertyLatitude) ||
      Number.isNaN(propertyLongitude)
    ) {
      return false;
    }

    const distance = calculateDistance(
      latitude,
      longitude,
      propertyLatitude,
      propertyLongitude
    );

    return distance <= radius;
  });
};

/* =========================================================
   MAP SEARCH
========================================================= */
function MapSearch({
  onLocationSearch,
  loading,
  initialLocationName,
}) {
  const map = useMap();

  const [search, setSearch] = useState(
    initialLocationName || ""
  );

    useEffect(() => {
    if (initialLocationName) {
      setSearch(initialLocationName);
    }
  }, [initialLocationName]);

  const handleSearch = async () => {
    const query = search.trim();

    if (!query || loading) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error("Location search failed");
      }

      const data = await response.json();

      if (!data.length) {
        alert("Location not found");
        return;
      }

      const result = data[0];

      const latitude = Number(result.lat);
      const longitude = Number(result.lon);

      map.flyTo(
        [latitude, longitude],
        14,
        {
          duration: 1.5,
        }
      );

      onLocationSearch(
        latitude,
        longitude,
        result.display_name
      );
    } catch (error) {
      console.error(
        "Map search error:",
        error
      );

      alert(
        "Unable to search for this location."
      );
    }
  };

  return (
    <div className="home-map-search">
      <i className="fa-solid fa-magnifying-glass"></i>

      <input
        type="text"
        placeholder="Search area or location..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
      />

      <button
        type="button"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}

/* =========================================================
   FLY TO SELECTED PROPERTY
========================================================= */

function FlyToSelected({
  selectedProperty,
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedProperty) return;

    const coordinates =
      selectedProperty.location?.coordinates;

    if (
      !Array.isArray(coordinates) ||
      coordinates.length < 2
    ) {
      return;
    }

    const longitude = Number(
      coordinates[0]
    );

    const latitude = Number(
      coordinates[1]
    );

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return;
    }

    map.flyTo(
      [latitude, longitude],
      15,
      {
        duration: 1.2,
      }
    );
  }, [selectedProperty, map]);

  return null;
}

/* =========================================================
   LOCATION MARKER
========================================================= */

function LocationMarker({
  location,
}) {
  if (!location) return null;

  return (
    <Marker
      position={[
        location.latitude,
        location.longitude,
      ]}
      icon={L.divIcon({
        className: "nova-location-marker",
        html: `
          <div class="nova-location-pin">
            <i class="fa-solid fa-location-crosshairs"></i>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 42],
      })}
    />
  );
}

/* =========================================================
   PROPERTIES MAP
========================================================= */

function PropertiesMap({
  properties,
  selectedProperty,
  onSelectProperty,
  onLocationSearch,
  selectedLocation,
}) {
  const center = selectedLocation
    ? [
        selectedLocation.latitude,
        selectedLocation.longitude,
      ]
    : [30.0444, 31.2357];

  return (
    <div className="home-map-wrapper">

      <div className="map-legend">

        <div className="map-legend-item">
          <span className="map-legend-dot rent"></span>
          For Rent
        </div>

        <div className="map-legend-item">
          <span className="map-legend-dot sale"></span>
          For Sale
        </div>

      </div>

      <MapContainer
        center={center}
        zoom={selectedLocation ? 13 : 11}
        className="home-map"
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

   <MapSearch
  onLocationSearch={onLocationSearch}
  initialLocationName={selectedLocation?.name || ""}
/>

        <FlyToSelected
          selectedProperty={selectedProperty}
        />

        <LocationMarker
          location={selectedLocation}
        />

        {properties.map((property) => {
          const coordinates =
            property.location?.coordinates;

          if (
            !Array.isArray(coordinates) ||
            coordinates.length < 2
          ) {
            return null;
          }

          const longitude = Number(
            coordinates[0]
          );

          const latitude = Number(
            coordinates[1]
          );

          if (
            Number.isNaN(latitude) ||
            Number.isNaN(longitude)
          ) {
            return null;
          }

          const isSelected =
            selectedProperty?._id ===
            property._id;

          return (
            <Marker
              key={property._id}
              position={[
                latitude,
                longitude,
              ]}
              icon={createPropertyIcon(
                property.listingType,
                isSelected
              )}
              eventHandlers={{
                click: () => {
                  onSelectProperty(
                    property
                  );
                },
              }}
            />
          );
        })}

      </MapContainer>
    </div>
  );
}

/* =========================================================
   FLY TO LOCATION SETUP (LOCATION SETUP MAP)
========================================================= */

function FlyToLocationSetup({ location }) {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.flyTo(
      [location.latitude, location.longitude],
      13,
      { duration: 1.5 }
    );
  }, [location, map]);

  return null;
}


/* =========================================================
   LOCATION SETUP MAP
========================================================= */

function LocationSetup({
  onLocationSelected,
}) {
  const [search, setSearch] =
    useState("");

  const [location, setLocation] =
    useState(null);

  const [searchLoading, setSearchLoading] =
    useState(false);

  const [saveLoading, setSaveLoading] =
    useState(false);



  const searchLocation = async () => {
    const query = search.trim();

    if (!query || searchLoading) return;

    try {
      setSearchLoading(true);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
          query
        )}`
      );

      if (!response.ok) {
        throw new Error(
          "Location search failed"
        );
      }

      const data = await response.json();

      if (!data.length) {
        alert("Location not found");
        return;
      }

      const result = data[0];

      const latitude = Number(
        result.lat
      );

      const longitude = Number(
        result.lon
      );

      const selectedLocation = {
        latitude,
        longitude,
        name:
          result.display_name ||
          query,
      };

      setLocation(selectedLocation);


    } catch (error) {
      console.error(
        "Location setup error:",
        error
      );

      alert(
        "Unable to find this location."
      );
    } finally {
      setSearchLoading(false);
    }
  };

  const saveLocation = () => {
    if (!location || saveLoading) return;

    try {
      setSaveLoading(true);

      localStorage.setItem(
        LOCATION_KEY,
        JSON.stringify(location)
      );

      localStorage.setItem(
        LOCATION_SETUP_KEY,
        "true"
      );

      onLocationSelected(location);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="location-setup-page">

      <div className="location-setup-card">

        <div className="location-setup-icon">
          <i className="fa-solid fa-location-dot"></i>
        </div>

        <h1>
          Find Properties Near You
        </h1>

        <p>
          Choose an area to discover
          properties around you.
        </p>

        <div className="location-search-box">

          <i className="fa-solid fa-magnifying-glass"></i>

          <input
            type="text"
            placeholder="Search Cairo, New Cairo, Maadi..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                searchLocation();
              }
            }}
          />

          <button
            type="button"
            onClick={searchLocation}
            disabled={searchLoading}
          >
            {searchLoading
              ? "Searching..."
              : "Search"}
          </button>

        </div>

        <div className="location-setup-map">

<MapContainer
  center={
    location
      ? [
          location.latitude,
          location.longitude,
        ]
      : [30.0444, 31.2357]
  }
  zoom={location ? 13 : 11}
  className="location-map"
>

  <TileLayer
    attribution="&copy; OpenStreetMap contributors"
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  <FlyToLocationSetup location={location} />

  {location && (
    <Marker
      position={[
        location.latitude,
        location.longitude,
      ]}
      icon={L.divIcon({
        className:
          "nova-location-marker",
        html: `
          <div class="nova-location-pin">
            <i class="fa-solid fa-location-dot"></i>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 42],
      })}
    />
  )}

</MapContainer>
        </div>

        {location && (
          <div className="selected-location-info">

            <i className="fa-solid fa-location-dot"></i>

            <div>
              <span>
                Selected Area
              </span>

              <strong>
                {location.name}
              </strong>
            </div>

          </div>
        )}

        <button
          type="button"
          className="save-location-btn"
          disabled={!location || saveLoading}
          onClick={saveLocation}
        >
          {saveLoading ? (
            <>
              <span className="button-spinner"></span>
              Saving...
            </>
          ) : (
            <>
              <i className="fa-solid fa-check"></i>
              Use This Area
            </>
          )}
        </button>

        <small>
          You can change your area anytime
          from the Map button.
        </small>

      </div>

    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home() {
  const navigate = useNavigate();

  const [properties, setProperties] =
    useState([]);

  const [allProperties, setAllProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [networkError, setNetworkError] =
    useState(false);

  const requestInProgress =
    useRef(false);

  const [favoriteIds, setFavoriteIds] =
    useState([]);

  const [mapProperties, setMapProperties] =
    useState([]);

  const [selectedProperty, setSelectedProperty] =
    useState(null);

  const [showMap, setShowMap] =
    useState(false);

  const [preferredLocation, setPreferredLocation] =
    useState(null);

  const [locationSetupRequired, setLocationSetupRequired] =
    useState(false);

  const [locationChanging, setLocationChanging] =
    useState(false);

const [lastSearch, setLastSearch] = useState(() => {
  try {
    return (
      JSON.parse(
        localStorage.getItem(SEARCH_KEY)
      ) || {}
    );
  } catch {
    return {};
  }
});


  /* =====================================================
     LOAD SAVED LOCATION
  ===================================================== */

const [locationLoaded, setLocationLoaded] = useState(false);

useEffect(() => {
  if (!isAuthenticated()) {
    setLocationLoaded(true);
    return;
  }

  const savedLocation = localStorage.getItem(LOCATION_KEY);
  const setupDone = localStorage.getItem(LOCATION_SETUP_KEY);

  if (savedLocation) {
    try {
      setPreferredLocation(JSON.parse(savedLocation));
    } catch (error) {
      console.error("Invalid saved location:", error);
    }
  }

  if (!setupDone || !savedLocation) {
    setLocationSetupRequired(true);
  }

  setLocationLoaded(true);
}, []);




  /* =====================================================
     GET FAVORITES
  ===================================================== */

  const getFavorites = async () => {
    if (!isAuthenticated()) {
      setFavoriteIds([]);
      return;
    }

    try {
      const response = await apiFetch(
        `${API_URL}/users/favorites`,
        {
          method: "GET",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setFavoriteIds([]);
          return;
        }

        throw new Error(
          result.message ||
            "Failed to get favorites"
        );
      }

      const favorites =
        Array.isArray(result.data)
          ? result.data
          : [];

      setFavoriteIds(
        favorites.map(
          (favorite) => favorite._id
        )
      );
    } catch (error) {
      console.error(
        "Favorites error:",
        error
      );
    }
  };

  useEffect(() => {
    getFavorites();
  }, []);

  /* =====================================================
     FETCH PROPERTIES
  ===================================================== */

const fetchProperties = async (filters = {}, saveSearch = false, retryCount = 0) => {
  if (requestInProgress.current) return;
  requestInProgress.current = true;

  try {
    setLoading(true);
    setError("");
    setNetworkError(false);

    const { priceRange, ...cleanFilters } = filters;

    if (saveSearch) {
      localStorage.setItem(SEARCH_KEY, JSON.stringify(cleanFilters));
      setLastSearch(cleanFilters);
    }

    const params = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      if (
        key === "search" ||
        value === "" ||
        value === null ||
        value === undefined
      ) {
        return;
      }

      params.append(key, value);
    });

    const response = await fetch(
      `${API_URL}/listings?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const listings = Array.isArray(data.data) ? data.data : [];

    setAllProperties(listings);

    if (preferredLocation?.latitude && preferredLocation?.longitude) {
      const nearby = getNearbyProperties(
        listings,
        preferredLocation.latitude,
        preferredLocation.longitude
      );

      setProperties(nearby);
      setMapProperties(nearby);
    } else {
      setProperties(listings);
      setMapProperties(listings);
    }

    setLoading(false);
    requestInProgress.current = false;
  } catch (err) {
    console.error("Properties error:", err);
    requestInProgress.current = false;

    if (retryCount < 1) {
      setTimeout(() => {
        fetchProperties(filters, false, retryCount + 1);
      }, 1200);
      return;
    }

    setError("We couldn't load the properties.");
    setNetworkError(true);
    setProperties([]);
    setMapProperties([]);
    setLoading(false);
  }
};

  /* =====================================================
     INITIAL FETCH
  ===================================================== */

useEffect(() => {
  if (locationSetupRequired) {
    setLoading(false);
    return;
  }

  fetchProperties(lastSearch);
}, [
  locationSetupRequired,
  preferredLocation,
]);

  /* =====================================================
     LOCATION SEARCH FROM MAP
  ===================================================== */

  const handleLocationSearch = (
    latitude,
    longitude,
    locationName
  ) => {
    const nearby =
      getNearbyProperties(
        allProperties,
        latitude,
        longitude
      );

    const newLocation = {
      latitude,
      longitude,
      name:
        locationName ||
        "Selected Area",
    };

    setMapProperties(nearby);
    setProperties(nearby);
    setPreferredLocation(
      newLocation
    );

    /*
      Save new area immediately
      when user searches from Map.
    */

    localStorage.setItem(
      LOCATION_KEY,
      JSON.stringify(newLocation)
    );

    localStorage.setItem(
      LOCATION_SETUP_KEY,
      "true"
    );
  };

  /* =====================================================
     SAVE LOCATION SETUP
  ===================================================== */

  const handleLocationSelected = (
    location
  ) => {
    setPreferredLocation(location);

    setLocationSetupRequired(false);

    const nearby =
      getNearbyProperties(
        allProperties,
        location.latitude,
        location.longitude
      );

    setProperties(nearby);
    setMapProperties(nearby);
  };

  /* =====================================================
     MAP BUTTON
  ===================================================== */

  const handleMapClick = () => {
    setShowMap((prev) => {
      const next = !prev;

      if (next) {
        setMapProperties(
          properties
        );

        setSelectedProperty(null);
      } else {
        setSelectedProperty(null);
      }

      return next;
    });
  };

  /* =====================================================
     CHANGE LOCATION
  ===================================================== */

  const handleChangeLocation = () => {
    setLocationChanging(true);
    setShowMap(false);
    setSelectedProperty(null);
  };

  /* =====================================================
     LOCATION SETUP SCREEN
  ===================================================== */

  if (
    isAuthenticated() &&
    (locationSetupRequired ||
      locationChanging)
  ) {
    return (
      <LocationSetup
        onLocationSelected={
          (location) => {
            setLocationChanging(false);
            handleLocationSelected(
              location
            );
          }
        }
      />
    );
  }

  /* =====================================================
     HOME UI
  ===================================================== */

  return (
    <div className="home">

      <Sidebar />

   <div className="main-content !ml-0 lg:!ml-[210px]">

        <Navbar
          onMenuClick={() =>
            window.dispatchEvent(
              new Event(
                "openSidebar"
              )
            )
          }

          onMapClick={
            handleMapClick
          }

          showMap={showMap}
        />

        {/* =================================================
            HERO
        ================================================= */}

        <section className="hero min-h-[250px] px-4 py-8 sm:min-h-[280px] sm:px-6 md:min-h-[300px] md:px-0 md:py-10">

          <div className="hero-content w-full max-w-none sm:max-w-[90%] md:w-[1200px] md:max-w-[90%]">

            <span className="hero-badge text-[10px] sm:text-[11px]">
              Find Your Dream Home
            </span>

            <h1 className="text-[28px] sm:text-[34px] md:text-[38px]">
              Your Next Chapter
              <br />
              <span>
                Starts Here
              </span>
            </h1>

            <p className="max-w-[330px] text-[12px] sm:max-w-[450px] sm:text-[14px]">
              Discover the perfect
              property, whether you're
              buying, renting, or
              investing.
            </p>

          </div>

        </section>


        {/* =================================================
            SEARCH
        ================================================= */}

        <section className="search-section -mt-5 px-3 sm:-mt-[30px] sm:px-5 md:px-0">

<SearchBar
  initialFilters={lastSearch}
  onSearch={(filters) => fetchProperties(filters, true)}
/>

        </section>

        {/* =================================================
            PROPERTIES
        ================================================= */}

        <section className="properties-section px-4 py-6 sm:px-5 sm:py-8 md:px-[25px] md:py-[35px]">

          <div className="properties-header mb-3">

            <h2>
              {loading
                ? "Finding Properties..."
                : `${properties.length} Properties Found`}
            </h2>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="properties-loading">

              <div className="loading-spinner"></div>

              <h3>
                Finding your perfect
                home...
              </h3>

              <p>
                Please wait while we
                search for available
                properties.
              </p>

            </div>
          )}

          {/* =================================================
              NETWORK ERROR
          ================================================= */}

          {!loading &&
            networkError && (
              <div className="properties-empty">

                <div className="empty-icon">
                  <i className="fa-solid fa-wifi"></i>
                </div>

                <h3>
                  Network Error
                </h3>

                <p>
                  We couldn't connect to
                  NOVA right now. Please
                  check your internet
                  connection and try again.
                </p>

                <button
                  onClick={() =>
                    fetchProperties()
                  }
                  className="empty-button"
                >
                  Try Again
                </button>

              </div>
            )}

          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            !networkError &&
            !error &&
            properties.length === 0 && (
              <div className="properties-empty">

                <div className="empty-icon">
                  <i className="fa-solid fa-house-circle-xmark"></i>
                </div>

                <h3>
                  No Properties Found
                </h3>

                <p>
                  We couldn't find any
                  properties in this area.
                  Try changing your area
                  or search again.
                </p>

                <button
                  onClick={() =>
                    fetchProperties()
                  }
                  className="empty-button"
                >
                  View All Properties
                </button>

              </div>
            )}

          {/* =================================================
              MAP VIEW
          ================================================= */}

          {!loading &&
            showMap && (
              <div className="properties-map-layout">

                {/* =========================================
                    LEFT PROPERTY LIST
                ========================================= */}

                <div className="map-properties-list">

                  <div className="map-list-header">

                    <h3>
                      {mapProperties.length} Properties
                    </h3>

                    <span>
                      Properties near selected area
                    </span>

                  </div>

                  {mapProperties.length === 0 ? (
                    <div className="map-no-properties">

                      <i className="fa-solid fa-house-circle-xmark"></i>

                      <h3>
                        No properties nearby
                      </h3>

                      <p>
                        Try searching for
                        another area.
                      </p>

                    </div>
                  ) : (
                    mapProperties.map(
                      (property) => (
                        <div
                          key={
                            property._id
                          }
                          className={`map-property-item ${
                            selectedProperty?._id ===
                            property._id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            setSelectedProperty(
                              property
                            )
                          }
                        >

                          <img
                            src={
                              property
                                .images?.[0] ||
                              "/placeholder.jpg"
                            }
                            alt={
                              property.title
                            }
                          />

                          <div>

                            <h4>
                              {
                                property.title
                              }
                            </h4>

                            <p>
                              {
                                property
                                  .location
                                  ?.address ||
                                property
                                  .location
                                  ?.city ||
                                "Location unavailable"
                              }
                            </p>

                            <strong>
                              EGP{" "}
                              {Number(
                                property.price ||
                                  0
                              ).toLocaleString()}
                            </strong>

                          </div>

                        </div>
                      )
                    )
                  )}

                </div>

                {/* =========================================
                    RIGHT MAP
                ========================================= */}

                <div className="map-side">

                  <PropertiesMap
                    properties={
                      mapProperties
                    }
                    selectedProperty={
                      selectedProperty
                    }
                    onSelectProperty={
                      setSelectedProperty
                    }
                    onLocationSearch={
                      handleLocationSearch
                    }
                    selectedLocation={
                      preferredLocation
                    }
                  />

                  {/* =======================================
                      SELECTED PROPERTY
                  ======================================= */}

                  {selectedProperty && (
                    <div className="map-property-preview">

                      <button
                        type="button"
                        className="close-map-preview"
                        onClick={() =>
                          setSelectedProperty(
                            null
                          )
                        }
                      >
                        ×
                      </button>

                      <img
                        src={
                          selectedProperty
                            .images?.[0] ||
                          "/placeholder.jpg"
                        }
                        alt={
                          selectedProperty.title
                        }
                      />

                      <div className="map-preview-info">

                        <span>
                          {selectedProperty.listingType ===
                          "rent"
                            ? "For Rent"
                            : "For Sale"}
                        </span>

                        <h3>
                          {
                            selectedProperty.title
                          }
                        </h3>

                        <p>
                          <i className="fa-solid fa-location-dot"></i>

                          {" "}

                          {
                            selectedProperty
                              .location
                              ?.address ||
                            selectedProperty
                              .location
                              ?.city ||
                            "Location unavailable"
                          }
                        </p>

                        <strong>
                          EGP{" "}
                          {Number(
                            selectedProperty.price ||
                              0
                          ).toLocaleString()}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/property/${selectedProperty._id}`
                            )
                          }
                        >
                          View Property
                        </button>

                      </div>

                    </div>
                  )}

                </div>

              </div>
            )}

          {/* =================================================
              NORMAL CARD VIEW
          ================================================= */}

          {!loading &&
            !networkError &&
            !showMap &&
            properties.length > 0 && (
              <div className="row g-3">

                {properties.map(
                  (property) => (
                    <Card
                      key={
                        property._id
                      }
                      property={
                        property
                      }
                      isFavorite={favoriteIds.includes(
                        property._id
                      )}
                      onFavoriteChange={(
                        id,
                        newStatus
                      ) => {
                        setFavoriteIds(
                          (prev) => {
                            if (
                              newStatus
                            ) {
                              return [
                                ...prev,
                                id,
                              ];
                            }

                            return prev.filter(
                              (
                                favoriteId
                              ) =>
                                favoriteId !==
                                id
                            );
                          }
                        );
                      }}
                    />
                  )
                )}

              </div>
            )}

        </section>

      </div>

    </div>
  );
}

export default Home;

