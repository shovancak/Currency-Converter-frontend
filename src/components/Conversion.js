import React, { useState } from "react";

import "./Conversion.css";

const Conversion = () => {
  const [amountFrom, setAmountFrom] = useState();

  const inputValueHandler = (event) => {
    const value = event.target.value;
    const number = Math.abs(Number(value));
    setAmountFrom(number);
  };

  return (
    <div className="conversion">
      <div className="conversion-row first">
        <div>
          <h2>From USD</h2>
          <h5>Add amount to convert:</h5>
          <input
            type="number"
            min="0"
            step="0.01"
            name="amountFrom"
            placeholder="Amount in USD"
            onChange={inputValueHandler}
          ></input>
        </div>
        <button>CONVERT</button>
        <div>
          <h2>Destination Currency</h2>
          <h5>Pick destination currency:</h5>
          <select>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="CZK">CZK</option>
            <option value="PLN">PLN</option>
          </select>
        </div>
      </div>
      <div className="conversion-row second">
        <h2>Converted Amount</h2>
        <h1>500 EUR</h1>
      </div>
      <div className="conversion-row third">
        <h3>Total USD converted: 17563</h3>
        <h3>Total conversions made: 38</h3>
      </div>
    </div>
  );
};

export default Conversion;
