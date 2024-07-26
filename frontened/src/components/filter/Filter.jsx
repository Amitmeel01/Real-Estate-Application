import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Filter.scss';

function Filter() {
  // Using useSearchParams to access and manipulate the URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();

  // State to manage the form input values
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "", // Default value for type
    city: searchParams.get("city") || "", // Default value for city
    property: searchParams.get("property") || "", // Default value for property
    minPrice: searchParams.get("minPrice") || 0, // Default value for minPrice
    maxPrice: searchParams.get("maxPrice") || 1000000, // Default value for maxPrice
    bedroom: searchParams.get("bedroom") || 1, // Default value for bedroom
  });

  // Function to handle changes in form inputs
  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  // Function to apply filters and update URL query parameters
  const handleFilter = () => {
    setSearchParams(query);
  };

  return (
    <div className='filter'>
      {/* Displaying the current city being filtered */}
      <h1>Search results for <b>{searchParams.get("city")}</b></h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id='city'
            name='city'
            placeholder='City Location'
            onChange={handleChange}
            value={query.city} // Binding input value to state
          />
        </div>
      </div>

      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select name="type" id="type" onChange={handleChange} value={query.type}>
            <option value="">Any</option> {/* Default option */}
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select name="property" id="property" onChange={handleChange} value={query.property}>
            <option value="">Any</option> {/* Default option */}
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id='minPrice'
            name='minPrice'
            placeholder='Any'
            onChange={handleChange}
            value={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="number"
            id='maxPrice'
            name='maxPrice'
            placeholder='Any'
            onChange={handleChange}
            value={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="number"
            id='bedroom'
            name='bedroom'
            placeholder='Any'
            onChange={handleChange}
            value={query.bedroom}
          />
        </div>
        {/* Button to apply filters */}
        <button onClick={handleFilter}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </div>
    </div>
  );
}

export default Filter;
