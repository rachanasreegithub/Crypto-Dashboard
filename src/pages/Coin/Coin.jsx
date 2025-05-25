import React, { useContext, useEffect, useState } from 'react';
import './Coin.css';
import { useParams } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const Coin = () => {
  const { coinId } = useParams();
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const { currency } = useContext(CoinContext);

  const fetchCoinData = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-3i2VKSwbZiWw37dR6P8z1SH3'
      }
    };

    try {
      const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const data = await res.json();
      setCoinData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCoinChart = async () => {
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name.toLowerCase()}&days=7`
      );
      const data = await res.json();
      setChartData(data.prices);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoinData();
    fetchCoinChart();
  }, [coinId, currency]);

  if (!coinData) {
    return <div className="spinner"><div className="spin">Loading...</div></div>;
  }

  const data = {
    labels: chartData.map(item => new Date(item[0]).toLocaleDateString()),
    datasets: [
      {
        label: `${coinData.name} Price (last 7 days)`,
        data: chartData.map(item => item[1]),
        fill: false,
        borderColor: 'deepskyblue',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className='coin'>
      <div className="coin-name">
        <img src={coinData.image.large} alt={coinData.name} />
        <p><b>{coinData.name} ({coinData.symbol.toUpperCase()})</b></p>
      </div>

      <div className="coin-info">
        <ul>
          <li><strong>Current Price:</strong> {currency.symbol}{coinData.market_data.current_price[currency.name.toLowerCase()].toLocaleString()}</li>
          <li><strong>Market Cap:</strong> {currency.symbol}{coinData.market_data.market_cap[currency.name.toLowerCase()].toLocaleString()}</li>
          <li><strong>24h Volume:</strong> {currency.symbol}{coinData.market_data.total_volume[currency.name.toLowerCase()].toLocaleString()}</li>
          <li><strong>Price Change 24h:</strong> 
            <span style={{ color: coinData.market_data.price_change_percentage_24h >= 0 ? 'limegreen' : 'red' }}>
              {coinData.market_data.price_change_percentage_24h.toFixed(2)}%
            </span>
          </li>
          <li><strong>Circulating Supply:</strong> {coinData.market_data.circulating_supply.toLocaleString()}</li>
          <li><strong>Total Supply:</strong> {coinData.market_data.total_supply ? coinData.market_data.total_supply.toLocaleString() : 'N/A'}</li>
        </ul>
      </div>

      <div className="coin-chart">
        <h3>{coinData.name} Price Chart (7 Days)</h3>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Coin;
