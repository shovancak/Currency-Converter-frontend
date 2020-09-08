import React, { useState, useEffect } from "react";

import Loading from "./Loading";

import "./Conversion.css";

const Conversion = () => {
  //State
  const [latestCurrencyData, setLatestCurrencyData] = useState();
  const [amountFrom, setAmountFrom] = useState();
  const [destinationCurrencyOptions, setDestinationCurrencyOptions] = useState(
    []
  );
  const [totalStats, setTotalStats] = useState({
    totalUsd: 0,
    totalConversions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCurrencyOption, setSelectedCurrencyOption] = useState();
  const [destinationCurrencyRate, setDestinationCurrencyRate] = useState();
  const [convertedAmount, setConvertedAmont] = useState(0);
  const [convertedCurrency, setConvertedCurrency] = useState();

  const inputValueHandler = (event) => {
    const value = event.target.value;
    const amount = Math.abs(Number(value));
    setAmountFrom(amount);
  };

  useEffect(() => {
    //Function for getting supported currencies data
    const getDestinationCurrencyOptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/currency/currency-data"
        );
        const data = await response.json();
        setLatestCurrencyData(data);
        setDestinationCurrencyOptions([...Object.keys(data.latestData)]);
        setSelectedCurrencyOption([...Object.keys(data.latestData)][0]);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    //Function for getting total stats => total USD converted, total conversion requests made
    const getTotalStats = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/total-stats/");
        const data = await response.json();
        setTotalStats({
          totalUsd: data.totalData.totalUsd,
          totalConversions: data.totalData.totalConversions,
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    //Calling functions
    getDestinationCurrencyOptions();
    getTotalStats();
  }, []);

  const destinationCurrencyHandler = (event) => {
    const selectedOption = event.target.value;
    setSelectedCurrencyOption(selectedOption);
    setDestinationCurrencyRate(latestCurrencyData.latestData[selectedOption]);
  };

  const conversionButtonHandler = () => {
    const conversionRequest = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/currency/conversion",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: amountFrom,
              rate: destinationCurrencyRate,
              currency: selectedCurrencyOption,
            }),
          }
        );
        const data = await response.json();
        const rounedConvertedAmount = data.convertedAmount.toFixed(4);
        setConvertedAmont(rounedConvertedAmount);
        setConvertedCurrency(data.convertedCurrency);
      } catch (err) {
        console.log(err);
      }
    };
    const updateStatsRequest = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/total-stats/", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountFrom,
          }),
        });
        const data = await response.json();
        setTotalStats({
          totalUsd: data.totalStats.totalUsd,
          totalConversions: data.totalStats.totalConversions,
        });
      } catch (err) {
        console.log(err);
      }
    };
    conversionRequest();
    updateStatsRequest();
  };

  return (
    <div className="conversion">
      {loading ? (
        <Loading />
      ) : (
        <React.Fragment>
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
            <button disabled={!amountFrom} onClick={conversionButtonHandler}>
              CONVERT
            </button>
            <div>
              <h2>Destination Currency</h2>
              <h5>Pick destination currency:</h5>
              <select
                name="destination-currencies"
                onChange={destinationCurrencyHandler}
              >
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
            <h1>
              {convertedAmount} {convertedCurrency}
            </h1>
          </div>
          <div className="conversion-row third">
            <h3>Total USD converted: {totalStats.totalUsd}</h3>
            <h3>Total conversions made: {totalStats.totalConversions}</h3>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default Conversion;
