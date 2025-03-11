import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./searchBar.scss";

const petTypes = ["dog", "cat", "bird", "fish", "other"];
const healthStatusOptions = [
  "UP_TO_DATE",
  "VACCINATED",
  "SPAYED_NEUTERED",
  "HEALTH_ISSUES",
  "NO_HEALTH_ISSUES",
];

function SearchBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    minAge: searchParams.get("minAge") || "",
    maxAge: searchParams.get("maxAge") || "",
    breed: searchParams.get("breed") || "",
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query.type) params.type = query.type;
    if (query.city) params.city = query.city;
    if (query.minAge) params.minAge = query.minAge;
    if (query.maxAge) params.maxAge = query.maxAge;
    if (query.breed) params.breed = query.breed;
    if (query.healthStatus) params.healthStatus = query.healthStatus;
    setSearchParams(params);
  };

  const handleChange = (e) => {
    setQuery((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="searchBar">
      <div className="petType">
        {petTypes.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setQuery((prev) => ({ ...prev, type }))}
            className={query.type === type ? "active" : ""}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={query.city}
          onChange={handleChange}
        />
        <input
          type="number"
          name="minAge"
          min="0"
          placeholder="Min Age"
          value={query.minAge}
          onChange={handleChange}
        />
        <input
          type="number"
          name="maxAge"
          min="0"
          placeholder="Max Age"
          value={query.maxAge}
          onChange={handleChange}
        />
        <input
          type="text"
          name="breed"
          placeholder="Breed"
          value={query.breed}
          onChange={handleChange}
        />
        <select
          name="healthStatus"
          value={query.healthStatus}
          onChange={handleChange}
        >
          <option value="">Any Health Status</option>
          {healthStatusOptions.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <Link
          to={`/list?type=${query.type}&city=${query.city}&breed=${query.breed}&minAge=${query.minAge}&maxAge=${query.maxAge}&healthStatus=${query.healthStatus}`}
        >
          <button type="submit">
            <img src="/search.png" alt="Search" />
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
