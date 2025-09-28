import React, { useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect } from "react";
import "./MapScreen.css";

// Your pins array, with image imports resolved
const pins = [
  {
  id: 1,
  x: 0.18,
  y: 0.74,
  title: "Entry",
  description: "Welcome to the park! Stop by the ticket booth to get your entry pass, visit the guard house for safety assistance, and check out the nearby store for refreshments or souvenirs.",
  image: require("../assets/images/entry.png"),
  type: "Entry",
  color: "red"
},
{
  id: 1.9,
  x: 0.24,
  y: 1,
  title: "Mixed Planting Garden",
  description: "A diverse showcase of local and exotic plant species planted together, promoting biodiversity and demonstrating sustainable gardening practices.",
  image: require("../assets/images/mix.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 3,
  x: 0.21,
  y: 0.64,
  title: "Nepenthes & Wild Orchids Garden",
  description: "Discover Malaysia’s native pitcher plants and beautiful wild orchids in this specialized garden dedicated to rare and endangered plant species.",
  image: require("../assets/images/orchid.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 4,
  x: 0.47,
  y: 0.35,
  title: "Arboretum",
  description: "An educational space featuring a collection of tree species from across the region, offering insight into forest ecology and tree identification.",
  image: require("../assets/images/tree.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 5,
  x: 0.38,
  y: 0.63,
  title: "Ethnobotanical Garden",
  description: "Learn about traditional knowledge and the cultural uses of native plants by local communities, especially in medicine, cooking, and rituals.",
  image: require("../assets/images/water.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 6,
  x: 0.42,
  y: 0.87,
  title: "Ferns & Aroids Garden",
  description: "Wander through lush displays of ferns and aroids, showcasing ancient plant groups that thrive in Malaysia’s humid rainforest environment.",
  image: require("../assets/images/palm.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 7,
  x: 0.54,
  y: 0.7,
  title: "Bamboo & Ficus Garden",
  description: "Explore the versatility of bamboo and the impressive variety of ficus trees, including those that are ecologically important to local wildlife.",
  image: require("../assets/images/bamboo.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 8,
  x: 0.74,
  y: 1.08,
  title: "Wild Fruit Garden",
  description: "Get to know the wild fruit species that grow in Malaysia’s forests—many are important food sources for animals and even local communities.",
  image: require("../assets/images/fruit.png"),
  type: "Natural",
  color: '#7fff00'
},
{
  id: 9,
  x: 0.97,
  y: 0.94,
  title: "Park Shop & Cafe",
  description: "Relax with refreshments or shop for nature-themed gifts, books, and locally made souvenirs. A great place to take a break during your visit.",
  image: require("../assets/images/cafe.png"),
  type: "Building",
  color: '#b22222'
},
{
  id: 10,
  x: 1.17,
  y: 0.87,
  title: "Customer Service Centre & Mini Gallery",
  description: "Need help or more information? Friendly staff are here to assist with maps, lost items, bookings, and general inquiries.",
  image: require("../assets/images/gallery.png"),
  type: "Building",
  color: '#b22222'
},
{
  id: 11,
  x: 1.07,
  y: 0.45,
  title: "Orangutan Main Feeding Area",
  description: "A key location where you can watch semi-wild orangutans being fed. Learn about conservation efforts and observe their natural behaviors up close.",
  image: require("../assets/images/mainfeed.png"),
  type: "Feeding Area",
  color: '#ffa500'
},
{
  id: 12,
  x: 1.47,
  y: 0.96,
  title: "Orangutan Feeding Platform",
  description: "An elevated platform providing a safe and unobtrusive viewing area for observing orangutans during their feeding sessions in a forest-like environment.",
  image: require("../assets/images/feeding.png"),
  type: "Feeding Area",
  color: '#ffa500'
},
  
];

export default function InteractiveMap() {
  const [containerSize, setContainerSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [selectedPin, setSelectedPin] = useState(null);
  const [minScale, setMinScale] = useState(1);
  const [showPins, setShowPins] = useState(true); // 👈 toggle for pin visibility

  const onImageLoad = (e) => {
    const imgWidth = e.target.naturalWidth;
    const imgHeight = e.target.naturalHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scaleX = viewportWidth / imgWidth;
    const scaleY = viewportHeight / imgHeight;
    const newMinScale = Math.max(scaleX, scaleY);
    setImgSize({ width: imgWidth, height: imgHeight });
    setMinScale(newMinScale);
  };

  useEffect(() => {
    const scaleX = containerSize.width / imgSize.width;
    const scaleY = containerSize.height / imgSize.height;
    setMinScale(Math.max(scaleX, scaleY));
  }, [containerSize, imgSize]);

  const globalStyles = `
    html, body, #root {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
    }
  `;

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ width: "100vw", height: "100vh", overflow: "hidden" }}>
        <TransformWrapper
          wheel={{ step: 50 }}
          minScale={minScale}
          centerOnInit
          limitToBounds
        >
          {({ zoomIn, zoomOut }) => (
            <>
              {/* 🔘 Zoom & Toggle Buttons */}
              <div style={{
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <button onClick={() => setShowPins(!showPins)}>
                  {showPins ? "Hide Pins" : "Show Pins"}
                </button>
              </div>

              <TransformComponent>
                <div
                  style={{
                    position: "relative",
                    width: "100vw",
                    height: "100vh",
                    userSelect: "none",
                  }}
                >
                  <img
                    src="/images/map.jpg"
                    alt="Map"
                    onLoad={onImageLoad}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                    }}
                  />

                  {showPins && imgSize.width > 0 && pins.map((pin) => {
                    const left = pin.x * imgSize.width;
                    const top = pin.y * imgSize.height;
                    return (
                      <div
                        key={pin.id}
                        title={`${pin.title}: ${pin.description}`}
                        style={{
                          position: "absolute",
                          left,
                          top,
                          transform: "translate(-50%, -100%)",
                          cursor: "pointer",
                          zIndex: 10,
                        }}
                        onClick={() => setSelectedPin(pin)}
                      >
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            backgroundColor: pin.color,
                            borderRadius: "50%",
                            border: "2px solid white",
                            boxShadow: `0 0 5px ${pin.color}`,
                          }}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* 📌 Modal */}
      {selectedPin && (
        <div className="overlay" onClick={() => setSelectedPin(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="closeButton" onClick={() => setSelectedPin(null)}>&times;</button>
            <h2 className="modalTitle">{selectedPin.title}</h2>
            <img src={selectedPin.image} alt={selectedPin.title} className="modalImage" />
            <p className="modalType">{selectedPin.type}</p>
            <p className="modalDescription">{selectedPin.description}</p>
          </div>
        </div>
      )}
    </>
  );
}