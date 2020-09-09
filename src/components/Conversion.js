import React, { useState, useEffect } from "react";

import Loading from "./Loading";
import Modal from "./Modal";

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
    mostPopularCurrency: "-",
  });
  const [loading, setLoading] = useState(true);
  const [selectedCurrencyOption, setSelectedCurrencyOption] = useState();
  const [destinationCurrencyRate, setDestinationCurrencyRate] = useState();
  const [convertedAmount, setConvertedAmont] = useState(0);
  const [convertedCurrency, setConvertedCurrency] = useState();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState();

  // Event handler of input element => responsible for setting value of USD to be converted
  const inputValueHandler = (event) => {
    const value = event.target.value;
    const amount = Math.abs(Number(value));
    setAmountFrom(amount);
  };

  // Hook responsible for getting latest currency data and latest data (total USD converted, total conversion requests made, most popular currency) from database everytime app rerenders
  useEffect(() => {
    //Function for getting supported currencies data
    const getDestinationCurrencyOptions = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "http://localhost:5000/api/currency/currency-data"
        );
        const data = await response.json();
        //State update
        setLatestCurrencyData(data);
        setDestinationCurrencyOptions([...Object.keys(data.latestData)]);
        setSelectedCurrencyOption([...Object.keys(data.latestData)][0]);
        setDestinationCurrencyRate([...Object.values(data.latestData)][0]);
        setLoading(false);
      } catch (err) {
        //=> Catching error
        setShowModal(true);
        setError(err.message);
        console.log(err);
      }
    };
    //Function for getting total stats => total USD converted, total conversion requests made, most popular currency
    const getTotalStats = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/total-stats/");
        const data = await response.json();
        //State update
        setTotalStats({
          totalUsd: data.totalData.totalUsd,
          totalConversions: data.totalData.totalConversions,
          mostPopularCurrency: data.totalData.mostPopularCurrency,
        });
        setLoading(false);
      } catch (err) {
        //=> Catching error
        setShowModal(true);
        setError(err.message);
        console.log(err);
      }
    };
    //Calling functions
    getDestinationCurrencyOptions();
    getTotalStats();
  }, []);

  //Event handler of select element => responsible for setting destination currency and rate used for conversion
  const destinationCurrencyHandler = (event) => {
    const selectedOption = event.target.value;
    setSelectedCurrencyOption(selectedOption);
    setDestinationCurrencyRate(latestCurrencyData.latestData[selectedOption]);
  };

  //Event handler for button element => responsible for sending conversion request and request updating data in database everytime button is clicked
  const conversionButtonHandler = () => {
    //Function for sending conversion request
    const conversionRequest = async () => {
      setLoading(true);
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
        const rounedConvertedAmount = await data.convertedAmount.toFixed(4);
        //State update
        setConvertedAmont(rounedConvertedAmount);
        setConvertedCurrency(data.convertedCurrency);
        setLoading(false);
      } catch (err) {
        //=> Catching error
        setShowModal(true);
        setError(err.message);
        console.log(err);
      }
    };
    //Function for updating values of total USD converted, total conversions requests made and most popular currency
    const updateStatsRequest = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/total-stats/", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: amountFrom,
            currency: selectedCurrencyOption,
          }),
        });
        const data = await response.json();
        //State update
        setTotalStats({
          totalUsd: data.totalStats.totalUsd,
          totalConversions: data.totalStats.totalConversions,
          mostPopularCurrency: data.totalStats.mostPopularCurrency,
        });
        setLoading(false);
      } catch (err) {
        //=> Catching error
        setShowModal(true);
        setError(err.message);
        console.log(err);
      }
    };
    //Calling functions
    conversionRequest();
    updateStatsRequest();
  };

  return (
    <React.Fragment>
      {error ? (
        <Modal show={showModal}>{error}</Modal>
      ) : (
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
                <button
                  disabled={!amountFrom}
                  onClick={conversionButtonHandler}
                >
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
                <div className="total-stat">
                  <h2>{totalStats.totalUsd}</h2>
                  <h4>Total USD converted </h4>
                </div>
                <div className="total-stat">
                  <h2> {totalStats.mostPopularCurrency}</h2>
                  <h4>Most popular currency</h4>
                </div>
                <div className="total-stat">
                  <h2>{totalStats.totalConversions}</h2>
                  <h4>Total conversions made </h4>
                </div>
              </div>
            </React.Fragment>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Conversion;
