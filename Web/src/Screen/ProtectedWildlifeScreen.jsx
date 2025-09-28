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
import './ProtectedWildlifeScreen.css';

// Import wildlife images
import macaqueImage from '../assets/images/rajah_brooke\'s_birdwing.jpg';
import monitorImage from '../assets/images/monitor.jpg';
import pigeonImage from '../assets/images/metallic_pigeon_pergam.jpg';
import sunBearImage from '../assets/images/sun_bear_tongue.avif';

const speciesData = [
  { 
    id: '5', 
    name: 'Pig-tailed Macaque', 
    image: macaqueImage, 
    description: 'Common monkey often seen along trails.',
    conservation: 'Protected under Sarawak Wild Life Protection Ordinance.'
  },
  { 
    id: '6', 
    name: 'Monitor Lizard', 
    image: monitorImage, 
    description: 'Large reptiles basking near water and forest edges.',
    conservation: 'Protected due to declining populations from habitat loss and hunting.'
  },
  { 
    id: '7', 
    name: 'Metallic Pigeon Pergam', 
    image: pigeonImage, 
    description: 'A forest raptor often soaring above the trees.',
    conservation: 'Protected status helps maintain healthy forest ecosystems.'
  },
  { 
    id: '8', 
    name: 'Sun Bear (Beruang)', 
    image: sunBearImage, 
    description: 'The smallest bear species, native to the forests of Southeast Asia.',
    conservation: 'Protected species facing threats from habitat loss and poaching.'
  },
];

export default function ProtectedWildlifeScreen() {
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
        <p className="species-conservation">{item.conservation}</p>
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
    <div className="protected-wildlife-container">
      <header className="protected-wildlife-header">
        <h1>Protected Wildlife</h1>
      </header>
      
      <main className="protected-wildlife-content">
        <div className="protected-wildlife-intro">
          <p>
            Protected wildlife species have legal protection status that regulates their hunting, capture, 
            and trade. These animals are important for ecosystem health but are not considered at immediate 
            risk of extinction, unlike totally protected species.
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
              handleNavigate('/protected-plants');
            }}
          >
            Protected Plants
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
