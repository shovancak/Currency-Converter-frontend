import React, { useState, useEffect } from "react";

import "./Conversion.css";

const Conversion = () => {
  //State
  const [amountFrom, setAmountFrom] = useState();
  const [destinationCurrencyOptions, setDestinationCurrencyOptions] = useState(
    []
  );
  const [totalStats, setTotalStats] = useState({
    totalUsd: 0,
    totalConversions: 0,
  });

  const inputValueHandler = (event) => {
    const value = event.target.value;
    const amount = Math.abs(Number(value));
    setAmountFrom(amount);
  };

  useEffect(() => {
    //Function for getting supported currency names
    const getDestinationCurrencyOptions = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/currency/currency-data"
        );
        const data = await response.json();
        setDestinationCurrencyOptions([...Object.keys(data.latestData)]);
      } catch (err) {
        console.log(err);
      }
    };
    //Function for getting total stats => total USD converted, total conversion requests made
    const getTotalStats = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/total-stats/");
        const data = await response.json();
        setTotalStats({
          totalUsd: data.totalData.totalUsd,
          totalConversions: data.totalData.totalConversions,
        });
      } catch (err) {
        console.log(err);
      }
    };
    //Calling functions
    getDestinationCurrencyOptions();
    getTotalStats();
  }, []);

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
        <button disabled={!amountFrom || amountFrom === 0}>CONVERT</button>
        <div>
          <h2>Destination Currency</h2>
          <h5>Pick destination currency:</h5>
          <select>
            {destinationCurrencyOptions.map((currencyOption) => (
              <option key={currencyOption} value={currencyOption}>
                {currencyOption}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="conversion-row second">
        <h2>Converted Amount</h2>
        <h1>500 EUR</h1>
      </div>
      <div className="conversion-row third">
        <h3>Total USD converted: {totalStats.totalUsd}</h3>
        <h3>Total conversions made: {totalStats.totalConversions}</h3>
      </div>
    </div>
  );
};

export default Conversion;
