import "../../styles/searchBar.css"

function SearchBar(){
    return(
<div className="container d-flex gap-3 align-items-center">
        <div className="search-box">
      <i className="fa-solid fa-magnifying-glass"></i>

      <input
        type="search"
        placeholder="Search by Location, Area, Property..."
      />
    </div>

{/* property Typ */}
<div className="property-select">
  <label>Property Type</label>

  <select>
    <option>Any Type</option>
    <option>Apartment</option>
    <option>Villa</option>
    <option>House</option>
  </select>
</div>

{/* Purpose */}
<div className="property-select">
  <label>Purpose</label>

  <select>
    <option>Any</option>
    <option>Rent</option>
    <option>Buy</option>
  </select>
</div>
{/* Price Range */}

<div className="property-select">
  <label>Price Range </label>

  <select>
    <option>EGP Min-Max</option>
    <option>1000,000-500,000</option>
    <option>500,000-1,000000</option>
<option>1,000000-2,000000</option>
  </select>
</div>

{/* Bedrooms */}
<div className="property-select">
  <label>Bedrooms </label>

  <select>
    <option>Any</option>
    <option>1</option>
    <option>2</option>
<option>3</option>
  </select>
</div>

<div className="button-wrapper">
<button className="btn-end">
  <i className="fa-solid fa-magnifying-glass"></i>
  <span>Search</span>
</button>
</div>

</div>

    );
}
export default SearchBar;