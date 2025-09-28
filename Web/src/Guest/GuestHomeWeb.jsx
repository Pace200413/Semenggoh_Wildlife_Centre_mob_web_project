import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function GuestHomeWeb() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, role } = location.state || {};
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    setDropdownOpen(false);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.leftSection}>
          <img src="/images/logo.jpg" alt="Logo" style={styles.logo} />
          <div>
            <h1 style={styles.title}>Semenggoh</h1>
            <h1 style={styles.title}>Wildlife Centre</h1>
          </div>
        </div>
      </header>

      <main style={styles.mainContent}>
        <h2 style={styles.welcome}>Welcome! Visitor</h2>

        <div style={styles.carousel}>
          {["orangutans.jpg", "homepageImage.png", "homepageImage2.png", "homepageImage3.png"].map((img, i) => (
            <img
              key={i}
              src={`/images/${img}`}
              alt={`Slide ${i + 1}`}
              style={styles.slideImg}
            />
          ))}
        </div>

        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>About Semenggoh Wildlife Centre</h3>
          <p>
            Established in 1975, Semenggoh Wildlife Centre serves as a rehabilitation center for rescued and orphaned orangutans...
          </p>
          <h4>🕒 Visiting Hours</h4>
          <ul>
            <li>Morning: 8:00 AM – 10:00 AM</li>
            <li>Afternoon: 2:00 PM – 4:00 PM</li>
          </ul>
          <h4>🍌 Feeding Time</h4>
          <ul>
            <li>Morning: 9:00 AM – 10:00 AM</li>
            <li>Afternoon: 3:00 PM – 4:00 PM</li>
          </ul>
        </section>

        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>🌟 Must Go Places</h3>
          <div style={styles.placeCard}>
            <img src="/images/feedingPlatform.png" style={styles.placeImg} alt="Feeding Platform" />
            <div>
              <strong>Orangutan Feeding Platform</strong>
              <p>See orangutans up close during feeding in the forest.</p>
            </div>
          </div>
          <div style={styles.placeCard}>
            <img src="/images/orchidaceae.jpg" style={styles.placeImg} alt="Orchid Garden" />
            <div>
              <strong>Orchid Garden</strong>
              <p>A peaceful garden near the entrance with native orchids.</p>
            </div>
          </div>
        </section>

        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Getting There</h3>
          <p>By Bus, Taxi or GrabCar – approx. 24 km from Kuching City.</p>
          <p>Trail – 1.6 km walk or 5-min buggy ride from entrance.</p>
        </section>

        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>📍 Location</h3>
          <iframe
            title="Semenggoh Wildlife Centre Map"
            width="100%"
            height="250"
            frameBorder="0"
            style={{ border: 0 }}
            src="https://www.google.com/maps/embed/v1/place?q=Semenggoh+Wildlife+Centre+Kuching&key=YOUR_API_KEY"
            allowFullScreen
          ></iframe>
        </section>

        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Meet Our Guides</h3>
          <p>Search and filter guides before your visit.</p>
          <button onClick={() => navigate('/Screen/UserGuideWeb', { state: { userId, role } })} style={styles.guideBtn}>View Guide List</button>
        </section>

        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>📞 Contact Us</h3>
          <p>📱 +6082-610088</p>
          <p>📧 info@sarawakforestry.com</p>
          <p>📍 KM 20, Borneo Highland Road, 93250 Kuching, Sarawak</p>
        </section>
      </main>

      {dropdownOpen && (
        <div style={styles.dropdownMenu}>
          {[
            { name: 'Introduction to Species', path: '/Screen/SpeciesScreen' },
            { name: 'Totally-Protected Wildlife', path: '/Screen/TotallyProtectedScreen' },
            { name: 'Protected Wildlife', path: '/Screen/ProtectedWildlifeScreen' },
            { name: 'Protected Plants', path: '/Screen/ProtectedPlantsScreen' },
            { name: 'Identify Plant', path: '/Screen/PlantIdentificationScreen' }
          ].map((item, index) => (
            <button
              key={index}
              style={styles.dropdownItem}
              onClick={() => {
                navigate(item.path, { state: { userId, role } });
                setDropdownOpen(false);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      )}

      <div style={styles.bottomNav}>
        <div style={styles.navItem}>
          <button style={styles.speciesButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
            📘<div style={styles.navLabel}>Species</div>
          </button>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/Screen/MapWeb', { state: { userId, role } })}>
          💬<div style={styles.navLabel}>Map</div>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/Screen/UserGuideWeb', { state: { userId, role } })}>
          📅<div style={styles.navLabel}>Guide</div>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/Guest/GuestPersonalWeb', { state: { userId, role } })}>
          🪪<div style={styles.navLabel}>User</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { backgroundColor: '#f8f8f8', fontFamily: 'Segoe UI, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#2f855a', color: '#fff' },
  leftSection: { display: 'flex', alignItems: 'center' },
  logo: { width: 60, height: 80, marginRight: 15 },
  title: { margin: 0, fontSize: 20 },
  mainContent: { padding: 20 },
  welcome: { color: '#2f855a', fontSize: 24, marginBottom: 20 },
  carousel: { display: 'flex', overflowX: 'scroll', gap: 10, paddingBottom: 20 },
  slideImg: { height: 200, width: 300, objectFit: 'cover', borderRadius: 10 },
  card: { backgroundColor: '#fff', padding: 20, marginBottom: 20, borderRadius: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#2f855a' },
  guideBtn: { backgroundColor: '#2f855a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 5, cursor: 'pointer' },
  placeCard: { display: 'flex', alignItems: 'center', marginBottom: 10 },
  placeImg: { width: 100, height: 100, marginRight: 15, objectFit: 'cover', borderRadius: 5 },
  dropdownMenu: {
    position: 'fixed',
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
    zIndex: 1000
  },
  dropdownItem: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    margin: '10px 0',
    color: '#2f855a',
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer'
  },
  bottomNav: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'fixed',
    bottom: 0,
    width: '100%',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #ddd',
    padding: '8px 0',
    boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.05)',
    zIndex: 100,
  },
  navItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '20px',
    color: '#2f855a',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  navLabel: {
    fontSize: '12px',
    marginTop: '4px',
  },
  speciesButton: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    color: '#2f855a',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};
