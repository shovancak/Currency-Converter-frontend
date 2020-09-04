import React from "react";

import "./Conversion.css";

const Conversion = () => {
  return (
    <div className="conversion">
      <div className="conversion-row first">
        <div>
          <h2>From USD</h2>
          <input placeholder="Amount in USD"></input>
        </div>
        <button>CONVERT</button>
        <div>
          <h2>Destination Currency</h2>
          <select>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CZK">CZK</option>
            <option value="PLN">PLN</option>
          </select>
        </div>
      </div>
      <div className="conversion-row second">
        <h2>Converted Amount:</h2>
        <h1> 500 EUR</h1>
      </div>
      <div className="conversion-row third">
        <h3>Total USD: 17563</h3>
        <h3>Total Conversion: 38</h3>
      </div>
    </div>
  );
};

export default Conversion;
