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
import './TotallyProtectedScreen.css';

// Import wildlife images
import orangutanImage from '../assets/images/orangutans.jpg';
import squirrelImage from '../assets/images/giant_squirrel.jpg';
import hornbillImage from '../assets/images/hornbill.jpg';
import leopardImage from '../assets/images/clouded_leopard.jpg';

const speciesData = [
  {
    id: '1',
    name: 'Orangutan',
    image: orangutanImage,
    description: 'Endangered great apes native to Borneo, known for intelligence and tree-dwelling habits.',
    status: 'Critically endangered species with declining populations due to habitat loss.'
  },
  {
    id: '2',
    name: 'Giant Squirrel',
    image: squirrelImage,
    description: 'Large forest squirrel with bushy tail, active in the treetops.',
    status: 'Totally-protected due to habitat fragmentation and hunting pressures.'
  },
  {
    id: '3',
    name: 'Hornbill',
    image: hornbillImage,
    description: 'Large birds with curved beaks and casque, symbol of Sarawak.',
    status: 'All hornbill species are totally-protected in Sarawak.'
  },
  {
    id: '4',
    name: 'Clouded Leopard',
    image: leopardImage,
    description: 'Elusive and nocturnal wild cat with distinctive cloud-like spots.',
    status: 'Vulnerable species facing severe threats from poaching and deforestation.'
  },
];

export default function TotallyProtectedScreen() {
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
        <p className="species-status">{item.status}</p>
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
    <div className="totally-protected-container">
      <header className="totally-protected-header">
        <h1>Totally-Protected Wildlife</h1>
      </header>
      
      <main className="totally-protected-content">
        <div className="totally-protected-intro">
          <p>
            Totally-Protected Wildlife species receive the highest level of legal protection in Sarawak.
            Hunting, keeping, killing, or trading these species is strictly prohibited by law. These species
            are considered rare, endangered, or critical to the ecosystem's health.
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
              handleNavigate('/protected-plants');
            }}
          >
            Protected Plants
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
