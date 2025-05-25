import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { CoinContext } from '../../context/CoinContext';

const Home = () => {
  const { allCoin, currency } = useContext(CoinContext);
  const [displayCoin, setDisplayCoin] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const coinsPerPage = 10;

  useEffect(() => {
    const filteredCoins = allCoin.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayCoin(filteredCoins);
    setPage(1); // reset to first page on new search
  }, [allCoin, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const startIndex = (page - 1) * coinsPerPage;
  const endIndex = startIndex + coinsPerPage;
  const paginatedCoins = displayCoin.slice(startIndex, endIndex);

  return (
    <div className="home">
      <div className="hero">
        <h1>Largest <br /> Crypto MarketPlace</h1>
        <p>Welcome to the world's largest cryptocurrency marketplace.</p>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Search crypto..." 
            value={searchTerm} 
            onChange={handleSearchChange} 
          />
          <button type="submit">Search</button>
        </form>
      </div>

      <div className="crypto-table">
        <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{ textAlign: "center" }}>24H Change</p>
          <p className="market-cap">Market Cap</p>
        </div>

        {paginatedCoins.length > 0 ? (
          paginatedCoins.map((item) => (
            <div className="table-layout" key={item.id}>
              <p>{item.market_cap_rank}</p>
              <p>
                <Link 
                  to={`/coin/${item.id}`} 
                  style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }}
                  />
                  {item.name}
                </Link>
              </p>
              <p>{currency.symbol}{item.current_price.toLocaleString()}</p>
              <p
                style={{
                  textAlign: "center",
                  color: item.price_change_percentage_24h >= 0 ? 'limegreen' : 'red'
                }}
              >
                {item.price_change_percentage_24h.toFixed(2)}%
              </p>
              <p className="market-cap">{currency.symbol}{item.market_cap.toLocaleString()}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: '20px' }}>No coins found.</p>
        )}
      </div>

      <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          style={{ marginRight: '10px', padding: '8px 16px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage(prev => (endIndex < displayCoin.length ? prev + 1 : prev))}
          disabled={endIndex >= displayCoin.length}
          style={{ marginLeft: '10px', padding: '8px 16px', cursor: endIndex >= displayCoin.length ? 'not-allowed' : 'pointer' }}
        >
          Next
        </button>
      </div>

      <footer className="footer">
        <p>© 2025 CryptoMarketPlace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
