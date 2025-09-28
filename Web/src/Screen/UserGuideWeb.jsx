// Converted UserGuideScreen.js (React Native) to ReactJS Web (preserving all logic)
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoHomeOutline, IoMapOutline, IoPersonOutline, IoSearch } from 'react-icons/io5';
import { FaLeaf } from 'react-icons/fa';
import { API_URL } from '../config';

export default function UserGuideWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, role } = location.state || {};
  useEffect(() => {
      window.scrollTo(0, 0);
    }, [location]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [allGuides, setAllGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
    setDropdownOpen(false);
    setSearchText('');
  }, []);

  const fetchGuides = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/guides`);
      if (!response.ok) throw new Error('Fetch failed');
      const data = await response.json();
      const unique = data.guides.reduce((acc, g) => {
        if (!acc.find(x => x.guide_id === g.guide_id)) acc.push(g);
        return acc;
      }, []);
      const sorted = unique.sort((a, b) => b.rating - a.rating);
      setAllGuides(sorted);
      setFilteredGuides(sorted);
    } catch (error) {
      alert('Failed to fetch guides. Check your server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (!text.trim()) {
      setFilteredGuides(allGuides);
    } else {
      setFilteredGuides(
        allGuides.filter((g) => g.name.toLowerCase().includes(text.toLowerCase()))
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.buttonRow}>
        <button style={styles.button} onClick={() => navigate('/Guest/ActivitiesWeb', { state: { userId, role } })}>Activities</button>
      </div>

      <div style={styles.search}>
        <input
          placeholder="Search guides..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={styles.searchInput}
        />
        <IoSearch size={20} color="#666" />
      </div>

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading guides...</p>
        </div>
      ) : (
        <div style={styles.list}>
          {filteredGuides.map((item) => (
            <div key={item.guide_id} style={styles.itemContainer}>
              <img
                src={item.profile_image_url || (item.gender === 'male'
                  ? 'https://cdn-icons-png.flaticon.com/512/147/147144.png'
                  : 'https://cdn-icons-png.flaticon.com/512/147/147142.png')}
                alt="Guide"
                style={styles.image}
              />
              <div style={styles.info}>
                <p style={styles.name}>{item.name}</p>
                <p style={styles.phone}>Phone: {item.phone_no}</p>
                <p style={styles.availableSlots}>Available Slots: {item.available_slots || '0'}</p>
                <p style={styles.phone}>Rating: {item.rating}</p>
              </div>
              <button
                style={styles.bookButton}
                onClick={() => userId
                  ? navigate('/Screen/BookScreen', { state: { guide: item, userId } })
                  : alert('Please login before placing a booking.')}
              >
                Book
              </button>
            </div>
          ))}
        </div>
      )}

      {dropdownOpen && (
        <div style={styles.dropdownMenu}>
          {[['Introduction to Species', 'Species'], ['Totally-Protected Wildlife', 'TotallyProtected'], ['Protected Wildlife', 'ProtectedWildlife'], ['Protected Plants', 'ProtectedPlants'], ['Identify Plant', 'PlantIdentification']].map(([label, path]) => (
            <button key={path} onClick={() => { setDropdownOpen(false); navigate(`/${path}`); }} style={styles.dropdownItem}>{label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', paddingBottom: 80 },
  buttonRow: { textAlign: 'center', padding: '20px 10px 10px' },
  button: { backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: 5, border: 'none', fontWeight: 'bold' },
  search: { display: 'flex', alignItems: 'center', padding: 10, borderBottom: '1px solid #eee', margin: '0 10px' },
  searchInput: { flex: 1, padding: 10, fontSize: 16, border: 'none', outline: 'none' },
  list: { padding: '0 10px' },
  itemContainer: { display: 'flex', alignItems: 'center', padding: 15, borderBottom: '1px solid #eee' },
  image: { width: 80, height: 80, borderRadius: '50%', marginRight: 15, objectFit: 'cover' },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  phone: { fontSize: 14, color: '#666', marginBottom: 3 },
  availableSlots: { fontSize: 14, color: '#4CAF50', fontWeight: 'bold' },
  bookButton: { backgroundColor: '#4CAF50', color: 'white', padding: 10, borderRadius: 5, marginLeft: 10, border: 'none', cursor: 'pointer' },
  loadingContainer: { textAlign: 'center', padding: 30 },
  loadingText: { color: '#4CAF50', fontSize: 16 },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-around', padding: '10px 0', borderTop: '1px solid #eee', backgroundColor: '#fff', zIndex: 999 },
  navItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer' },
  navText: { fontSize: 12, color: '#666', marginTop: 5 },
  dropdownMenu: { position: 'fixed', bottom: 70, left: 0, right: 0, backgroundColor: '#fff', padding: 20, boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', zIndex: 1000 },
  dropdownItem: { fontSize: 16, padding: '10px 0', background: 'none', border: 'none', textAlign: 'left', color: '#276749', width: '100%', cursor: 'pointer' }
};
