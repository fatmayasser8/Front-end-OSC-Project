import "../../styles/searchBar.css";

function SearchBar() {
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
          placeholder="Search by Location, Area, Property..."
          className="!w-full"
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

        <select className="!w-full">
          <option>Any Type</option>
          <option>Apartment</option>
          <option>Villa</option>
          <option>House</option>
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

        <select className="!w-full">
          <option>Any</option>
          <option>Rent</option>
          <option>Buy</option>
        </select>
      </div>

      {/* Price Range */}
      <div
        className="
          property-select
          !w-full
          sm:!flex-[1_1_45%]
          lg:!flex-1
        "
      >
        <label>Price Range</label>

        <select className="!w-full">
          <option>EGP Min-Max</option>
          <option>1000,000-500,000</option>
          <option>500,000-1,000000</option>
          <option>1,000000-2,000000</option>
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

        <select className="!w-full">
          <option>Any</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </div>
<div
  className="
    button-wrapper
    !w-full
    sm:!w-auto
    sm:!flex-1
    lg:!flex-none
  "
>
  <button className="btn-end !w-full">
    <i className="fa-solid fa-magnifying-glass"></i>
    <span>Search</span>
  </button>
</div>
    </div>
  );
}

export default SearchBar;