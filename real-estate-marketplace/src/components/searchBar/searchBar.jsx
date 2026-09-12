import "../../styles/searchBar.css";
import { useEffect, useState } from "react";

const getPriceRangeFromMinMax = (minPrice, maxPrice) => {
  const min = minPrice !== undefined && minPrice !== "" ? Number(minPrice) : null;
  const max = maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : null;

  if (min === null && max === null) return "";

  if (min === 0 && max === 500000) return "0-500000";
  if (min === 500000 && max === 1000000) return "500000-1000000";
  if (min === 1000000 && max === 3000000) return "1000000-3000000";
  if (min === 3000000 && max === 5000000) return "3000000-5000000";
  if (min === 5000000 && max === 10000000) return "5000000-10000000";
  if (min === 10000000 && max === 20000000) return "10000000-20000000";
  if (min === 20000000 && (max === null || max === "")) return "20000000+";

  return "";
};

function SearchBar({
  onSearch,
  initialFilters = {},
}) {
const [search, setSearch] = useState(
  initialFilters.search || ""
);

const [propertyType, setPropertyType] = useState(
  initialFilters.propertyType || ""
);

const [purpose, setPurpose] = useState(
  initialFilters.purpose || ""
);

const [priceRange, setPriceRange] = useState(
  getPriceRangeFromMinMax(initialFilters.minPrice, initialFilters.maxPrice)
);

const [bedrooms, setBedrooms] = useState(
  initialFilters.bedrooms || ""
);

useEffect(() => {
  setSearch(initialFilters.search || "");
  setPropertyType(initialFilters.propertyType || "");
  setPurpose(initialFilters.listingType || "");
  setPriceRange(getPriceRangeFromMinMax(initialFilters.minPrice, initialFilters.maxPrice));
  setBedrooms(initialFilters.bedrooms || "");
}, [initialFilters]);

const handleSearch = () => {
  const searchValue = search.trim().toLowerCase();

  let searchCity = "";
  let searchPropertyType = propertyType;

  // Detect property type from anywhere in the search text
  if (searchValue.includes("villa")) {
    searchPropertyType = "villa";
  } else if (searchValue.includes("apartment")) {
    searchPropertyType = "apartment";
  } else if (searchValue.includes("studio")) {
    searchPropertyType = "studio";
  } else if (
    searchValue.includes("commercial") ||
    searchValue.includes("office") ||
    searchValue.includes("shop")
  ) {
    searchPropertyType = "commercial";
  } else if (searchValue) {
    // If no property type is detected,
    // treat the search text as a city
    searchCity = search.trim();
  }
let minPrice = "";
let maxPrice = "";

if (priceRange === "0-500000") {
  minPrice = 0;
  maxPrice = 500000;
} else if (priceRange === "500000-1000000") {
  minPrice = 500000;
  maxPrice = 1000000;
} else if (priceRange === "1000000-3000000") {
  minPrice = 1000000;
  maxPrice = 3000000;
} else if (priceRange === "3000000-5000000") {
  minPrice = 3000000;
  maxPrice = 5000000;
} else if (priceRange === "5000000-10000000") {
  minPrice = 5000000;
  maxPrice = 10000000;
} else if (priceRange === "10000000-20000000") {
  minPrice = 10000000;
  maxPrice = 20000000;
} else if (priceRange === "20000000+") {
  minPrice = 20000000;
}
const filters = {
  search,
  city: searchCity,
  propertyType: searchPropertyType,
  listingType: purpose,

  minPrice,
  maxPrice,
  bedrooms,
};

  console.log("SEARCH FILTERS:", filters);

  onSearch(filters);
};

  return (
    <div
      className="
        container d-flex gap-3 align-items-center
        flex-wrap
        !w-full
        !max-w-none
        !px-3
        sm:!px-4
        md:!px-5
        lg:!flex-nowrap
        lg:!px-3
      "
    >
      <div
        className="
          search-box
          !w-full
          sm:!flex-[1_1_45%]
          lg:!flex-[2_1_280px]
        "
      >
        <i className="fa-solid fa-magnifying-glass"></i>

        <input
          type="search"
          placeholder="Search by city or property..."
          className="!w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Property Type */}
      <div
        className="
          property-select
          !w-full
          sm:!flex-[1_1_45%]
          lg:!flex-1
        "
      >
        <label>Property Type</label>

        <select
          className="!w-full"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Any Type</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="studio">Studio</option>
          <option value="commercial">Commercial</option>
        </select>
      </div>

      {/* Purpose */}
      <div
        className="
          property-select
          !w-full
          sm:!flex-[1_1_45%]
          lg:!flex-1
        "
      >
        <label>Purpose</label>

        <select
          className="!w-full"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
        >
          <option value="">Any</option>
          <option value="rent">Rent</option>
          <option value="sale">Buy</option>
        </select>
      </div>

      {/* Price Range */}
<div className="property-select !w-full sm:!flex-[1_1_45%] lg:!flex-1">
  <label>Price Range</label>

  <select
    value={priceRange}
    onChange={(e) => setPriceRange(e.target.value)}
    className="!w-full"
  >
    <option value="">Any Price</option>

    <option value="0-500000">
      Under 500K
    </option>

    <option value="500000-1000000">
      500K - 1M
    </option>

    <option value="1000000-3000000">
      1M - 3M
    </option>

    <option value="3000000-5000000">
      3M - 5M
    </option>

    <option value="5000000-10000000">
      5M - 10M
    </option>

    <option value="10000000-20000000">
      10M - 20M
    </option>

    <option value="20000000+">
      20M+
    </option>
  </select>
</div>
      {/* Bedrooms */}
      <div
        className="
          property-select
          !w-full
          sm:!flex-[1_1]
          lg:!flex-1
        "
      >
        <label>Bedrooms</label>

        <select
          className="!w-full"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
        >
          <option value="">Any</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5+</option>
        </select>
      </div>

      {/* Search Button */}
      <div
        className="
          button-wrapper
          !w-full
          sm:!w-auto
          sm:!flex-1
          lg:!flex-none
        "
      >
        <button
          className="btn-end !w-full"
          onClick={handleSearch}
        >
          <i className="fa-solid fa-magnifying-glass"></i>
          <span>Search</span>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;