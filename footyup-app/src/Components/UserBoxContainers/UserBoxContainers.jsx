import { Link } from 'react-router-dom';
import { useState } from 'react';
import './UserBoxContainers.css';

function UserBoxContainers({
  containers,
  searchable = true,
  itemsPerPage = 6,
  linkPrefix = '',
  isClickable = true,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredContainers = containers.filter((box) =>
    box.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastBox = currentPage * itemsPerPage;
  const indexOfFirstbox = indexOfLastBox - itemsPerPage;
  const currentContainers = filteredContainers.slice(indexOfFirstbox, indexOfLastBox);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="box-list-page">
      <main className="box-list-main">
        {searchable && (
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <div className="reusable-container">
          {currentContainers.length === 0 ? (
            <p className="no-matches-message">No Matching Found</p>
          ) : (
            currentContainers.map((box) =>
              isClickable ? (
                <Link
                  to={`/${linkPrefix ? `${linkPrefix}/` : ''}${box.id}`}
                  key={box.id}
                  className="box-container"
                >
              <img src={box.image} alt={box.name} />
              <div className="box-content">
                <h3>{box.name}</h3>
                <div className="box-bottom">
                  {box.date && <p>Date:  {box.date} </p>}
                  {box.time && <p>Time:  {box.time} </p>}
                  {box.venue && <p>Venue: {box.venue}</p>}
                </div>
              </div>
            </Link>
          ) : (
            <div key={box.id} className="box-container">
              <img src={box.image} alt={box.name} />
              <div className="box-content">
                <h3>{box.name}</h3>
                <div className="box-bottom">
                {box.date && <p>Date:  {box.date} </p>}
                {box.time && <p>Time:  {box.time} </p>}
                {box.venue && <p>Venue: {box.venue}</p>}
                </div>
              </div>
            </div>
          )
        ))}
        </div>
        <div className="pagination">
          {Array.from({ length: Math.ceil(filteredContainers.length / itemsPerPage) }, (_, i) => (
            <button key={i} onClick={() => paginate(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}

export default UserBoxContainers;
