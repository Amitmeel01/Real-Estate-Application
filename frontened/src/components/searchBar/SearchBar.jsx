import React, { useState } from 'react';
import './SearchBar.scss';
import { Link } from 'react-router-dom';

function SearchBar() {
    const types = ["buy", "rent"];
    const [query, setQuery] = useState({
        type: "buy",
        city: "",
        minPrice: 0,
        maxPrice: 0,
    });

    const switchType = (val) => {
        setQuery((prev) => ({ ...prev, type: val }));
    };

    console.log(query);
    return (
        <div className='searchbar'>
            <div className="type">
                {types.map((item) => (
                    <button key={item} onClick={() => switchType(item)}
                        className={query.type === item ? "active" : ""}
                    >{item}</button>
                ))}
            </div>
            <form>
                <input
                    type="text"
                    name='city'
                    placeholder='City Location'
                    value={query.city}
                    onChange={(e) => setQuery((prev) => ({ ...prev, city: e.target.value }))}
                />
                <input
                    type="number"
                    name='min-price'
                    min={0}
                    value={query.minPrice}
                    placeholder='Min Price'
                    onChange={(e) => setQuery((prev) => ({ ...prev, minPrice: parseInt(e.target.value) }))}
                />
                <input
                    type="number"
                    max={1000000}
                    name='max-price'
                    value={query.maxPrice}
                    placeholder='Max Price'
                    onChange={(e) => setQuery((prev) => ({ ...prev, maxPrice: parseInt(e.target.value) }))}
                />
                <Link to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}>
                    <button>
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                </Link>
            </form>
        </div>
    );
}

export default SearchBar;
