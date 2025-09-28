import React, { useState,useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, 
  faLeaf, 
  faMap, 
  faBook, 
  faUser,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import './ProtectedPlantsScreen.css';

// Import plant images
import birisImage from '../assets/images/biris_licuala_orbicularis.jpg';
import orchidImage from '../assets/images/orchidaceae.jpg';
import tongkatAliImage from '../assets/images/tongkat_ali_eurycoma_longifolia.jpg';
import cyrtandraImage from '../assets/images/cyrtandra.jpg';
const speciesData = [
  {
    id: '9',
    name: 'Biris (Licuala orbicularis)',
    image: birisImage,
    description: 'A rare fan palm species native to the rainforests of Borneo.'
  },
  {
    id: '10',
    name: 'Orchid (Orchidaceae family)',
    image: orchidImage,
    description: 'All native orchid species from the Orchidaceae family.'
  },
  {
    id: '11',
    name: 'Tongkat Ali (Eurycoma longifolia)',
    image: tongkatAliImage,
    description: 'A medicinal plant used traditionally for vitality and wellness.'
  },
  {
    id: '12',
    name: 'Melebab (Cyrtandra spp.)',
    image: cyrtandraImage,
    description: 'Includes all Cyrtandra species, often found in moist tropical forests.'
  },
];

export default function ProtectedPlantsScreen() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);
  
  // Extract user info from URL params or localStorage
  const userId = new URLSearchParams(location.search).get('userId') || localStorage.getItem('userId');
  const userRole = new URLSearchParams(location.search).get('role') || localStorage.getItem('userRole');

  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < speciesData.length; i += 2) {
      rows.push(
        <div key={i} className="species-row">
          {renderItem(speciesData[i])}
          {speciesData[i + 1] ? renderItem(speciesData[i + 1]) : <div className="species-card empty-card" />}
        </div>
      );
    }
    return rows;
  };

  const renderItem = (item) => (
    <div key={item.id} className="species-card">
      <div className="species-image-container">
        <img src={item.image} alt={item.name} className="species-image" />
      </div>
      <div className="species-content">
        <h3 className="species-name">{item.name}</h3>
        <p className="species-description">{item.description}</p>
      </div>
    </div>
  );

  const handleNavigate = (path) => {
    navigate(path, { 
      state: { userId, userRole },
      search: `?userId=${userId}&role=${userRole}`
    });
  };

  return (
    <div className="protected-plants-container">
      <header className="protected-plants-header">
        <h1>Protected Plants</h1>
      </header>
      
      <main className="protected-plants-content">
        <div className="protected-plants-intro">
          <p>
            Protected plants are species that have legal protection due to their ecological significance, 
            rarity, or vulnerability to extinction. In Sarawak, these plants are protected under the Wildlife 
            Protection Ordinance.
          </p>
        </div>
        
        <div className="species-grid">
          {renderGrid()}
        </div>
      </main>
      
      {dropdownOpen && (
        <div className="dropdown-menu">
          <button 
            className="dropdown-item" 
            onClick={() => { 
              setDropdownOpen(false); 
              handleNavigate('/species');
            }}
          >
            Introduction to Species
          </button>
          <button 
            className="dropdown-item" 
            onClick={() => { 
              setDropdownOpen(false); 
              handleNavigate('/totally-protected');
            }}
          >
            Totally-Protected Wildlife
          </button>
          <button 
            className="dropdown-item" 
            onClick={() => { 
              setDropdownOpen(false); 
              handleNavigate('/protected-wildlife');
            }}
          >
            Protected Wildlife
          </button>
          <button 
            className="dropdown-item" 
            onClick={() => { 
              setDropdownOpen(false); 
              handleNavigate('/plant-identification');
            }}
          >
            Identify Plant
          </button>
        </div>
      )}
      
    </div>
  );
}
