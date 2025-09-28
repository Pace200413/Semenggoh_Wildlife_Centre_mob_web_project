import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faLeaf,
  faMap,
  faBook,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import './SpeciesScreen.css';

export default function SpeciesScreen() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
        window.scrollTo(0, 0);
      }, [location]);

  // ——— read persisted user context ———
  const qs        = new URLSearchParams(location.search);
  const userId    = qs.get('userId') ?? localStorage.getItem('userId');
  const userRole  = qs.get('role')   ?? localStorage.getItem('userRole');

  const push = (path) =>
    navigate(path, { state: { userId, userRole }, search: `?userId=${userId}&role=${userRole}` });

  /* auto-close dropdown on route change */
  useEffect(() => {
    const unlisten = navigate.listen?.(() => setDropdownOpen(false));
    return () => unlisten && unlisten();
  }, [navigate]);

  return (
    <div className="species-container">
      {/* ——— header ——— */}
      <header className="species-header">
        <h1>Discover Wildlife in Semenggoh</h1>
      </header>

      {/* ——— scrollable body ——— */}
      <main className="species-content">
        {/* intro */}
        <section className="species-intro">
          <p>
            Semenggoh Wildlife Centre is a sanctuary of biodiversity in Sarawak, Malaysia.
            Home to some of the region&rsquo;s rarest species, it serves as a haven for
            wildlife preservation and education.
          </p>
        </section>

        {/* categories */}
        <section className="species-section">
          <h2>Categories</h2>

          <article className="category-card">
            <h3>Totally-Protected Wildlife</h3>
            <p>
              Under the highest protection. Examples include Orangutan, Hornbill, Clouded Leopard.
            </p>
            <button className="category-button" onClick={() => push('../Screen/TotallyProtectedScreen')}>
              View Totally-Protected Wildlife
            </button>
          </article>

          <article className="category-card">
            <h3>Protected Wildlife</h3>
            <p>
              Species protected to ensure sustainable populations – Pig-tailed Macaque, Monitor
              Lizard, Sun Bear&hellip;
            </p>
            <button className="category-button" onClick={() => push('../Screen/ProtectedWildlifeScreen')}>
              View Protected Wildlife
            </button>
          </article>

          <article className="category-card">
            <h3>Protected Plants</h3>
            <p>
              Rare flora such as Tongkat Ali, Cyrtandra spp., Nepenthes are safeguarded
              under conservation law.
            </p>
            <button className="category-button" onClick={() => push('../Screen/ProtectedPlantsScreen')}>
              View Protected Plants
            </button>
          </article>
        </section>

        {/* policy / info sections */}
        {[
          ['Fines & Legal Implications', `Violators face fines up to RM100,000 or imprisonment
            under the Sarawak Wildlife Protection Ordinance.`],
          ['Wildlife Policy', `Sarawak Forestry Corporation enforces strict policies with
            patrols and public awareness campaigns.`],
          ['What You Can Do', `Report illegal activities, avoid wildlife products, educate
            others about biodiversity.`],
          ['Why It Matters', `Protecting wildlife preserves ecosystems, Malaysian heritage,
            and eco-tourism opportunities.`],
          ['Get Involved', `Volunteer, donate, or join programs run by SFC and local NGOs.`],
        ].map(([title, text]) => (
          <section key={title} className="species-section">
            <h2>{title}</h2>
            <p>{text}</p>
          </section>
        ))}
      </main>

      {/* ——— dropdown ——— */}
      {dropdownOpen && (
        <div className="dropdown-menu">
          {[
            ['/totally-protected', 'Totally-Protected Wildlife'],
            ['/protected-wildlife', 'Protected Wildlife'],
            ['/protected-plants', 'Protected Plants'],
            ['/plant-identification', 'Identify Plant'],
          ].map(([path, label]) => (
            <button
              key={path}
              className="dropdown-item"
              onClick={() => push(path)}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
