import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "./filter.scss";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    breed: searchParams.get("breed") || "",
    minAge: searchParams.get("minAge") || "",
    maxAge: searchParams.get("maxAge") || "",
    healthStatus: searchParams.get("healthStatus") || "",
  });

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    const params = {
      ...query,
      breed: query.breed.toLowerCase(), // Convert breed to lowercase
    };
    setSearchParams(params);
  };

  return (
    <div className="filter">
      <h1>
        {query.city ? `Pets available in ` : "All available pets"}
        <b>{query.city}</b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city"
            onChange={handleChange}
            value={query.city}
          />
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Pet Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            value={query.type}
          >
            <option value="">All</option>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="item">
          <label htmlFor="breed">Breed</label>
          <input
            type="text"
            id="breed"
            name="breed"
            placeholder="Enter breed"
            onChange={handleChange}
            value={query.breed}
          />
        </div>

        <div className="item">
          <label htmlFor="minAge">Min Age</label>
          <input
            type="number"
            id="minAge"
            name="minAge"
            placeholder="Any"
            min="0"
            onChange={handleChange}
            value={query.minAge}
          />
        </div>

        <div className="item">
          <label htmlFor="maxAge">Max Age</label>
          <input
            type="number"
            id="maxAge"
            name="maxAge"
            placeholder="Any"
            min="0"
            onChange={handleChange}
            value={query.maxAge}
          />
        </div>

        <div className="item">
          <label htmlFor="healthStatus">Health Status</label>
          <select
            name="healthStatus"
            id="healthStatus"
            onChange={handleChange}
            value={query.healthStatus}
          >
            <option value="">Any</option>
            <option value="UP_TO_DATE">Up-to-date</option>
            <option value="VACCINATED">Vaccinated</option>
            <option value="SPAYED_NEUTERED">Spayed/Neutered</option>
            <option value="HEALTH_ISSUES">Health Issues</option>
            <option value="NO_HEALTH_ISSUES">Healthy</option>
          </select>
        </div>

        <button onClick={handleFilter}>
          <img src="/search.png" alt="Search" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
