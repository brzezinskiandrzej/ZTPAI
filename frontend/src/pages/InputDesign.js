import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./InputDesign.css";

function InputDesign() {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState([
    {
      id: "emotions",
      title: "Emotions",
      description: `What exactly do you feel at this moment

"I feel joy, I am happy"`,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2F3737a7bdb7af4a8bb3d1c68157df39ba",
    },
    {
      id: "stories",
      title: "Stories",
      description: `Tell me about something that happened to you today

"I went to the gym and fell in love with a guy who worked out there"`,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2Fdb6ea667c7504a2b8b57268ff04927b8",
    },
    {
      id: "situation",
      title: "Situation",
      description: `Close your eyes and describe to us what you see, in what climate your imagination painted the picture

"I'm on the beach on vacation, dreams come true"`,
      image:
        "https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2F3737a7bdb7af4a8bb3d1c68157df39ba",
    },
  ]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  useEffect(() => {
    // Update scroll buttons state
    setCanScrollPrev(currentSlide > 0);
    setCanScrollNext(currentSlide < items.length - 1);
  }, [currentSlide, items.length]);

  function scrollNext() {
    setCurrentSlide((currentSlide + 1) % items.length);
  }

  function scrollPrev() {
    setCurrentSlide(currentSlide === 0 ? items.length - 1 : currentSlide - 1);
  }

  function scrollTo(index) {
    setCurrentSlide(index % items.length);
  }

  function handleTouchStart(e) {
    setTouchStart(e.touches[0].clientX);
    setIsDragging(true);
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    setTouchEnd(e.touches[0].clientX);
  }

  function handleTouchEnd() {
    setIsDragging(false);
    const swipeThreshold = 50;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        scrollNext();
      } else {
        scrollPrev();
      }
    }
  }

  function toggleMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function handleSubmit() {
    if (!inputValue.trim() || submitted) return;
    setSubmitted(true);
    setInputValue("");
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  }

  function adjustHeight() {
    const textarea = document.querySelector(".mood-textarea");
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height =
        Math.min(Math.max(textarea.scrollHeight, 56), 200) + "px";
    }
  }

  return (
    <div className="input-design">
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.30.0/tabler-icons.min.css"
        rel="stylesheet"
      />

      {/* Header */}
      <div className="header">
        <div className="logo">Logo</div>
        <nav className="nav-menu">
          <div className="nav-item">Home</div>
          <div className="nav-item">Features</div>
          <div className="nav-item">How It Works</div>
          <div className="nav-item">Contact</div>
        </nav>
        <button
          className="menu-toggle"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMenu}
        >
          <div className="hamburger">
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "rotate-down" : ""}`}
            ></span>
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "hidden" : ""}`}
            ></span>
            <span
              className={`hamburger-line ${isMobileMenuOpen ? "rotate-up" : ""}`}
            ></span>
          </div>
        </button>
        <div
          className="mobile-menu"
          style={{
            transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)",
          }}
        >
          <div className="mobile-menu-content">
            <div className="mobile-nav-item">Home</div>
            <div className="mobile-nav-item">Features</div>
            <div className="mobile-nav-item">How It Works</div>
            <div className="mobile-nav-item">Contact</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className="type-box"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="mood-box">
          <div className="mood-title">
            <div className="find-music-button">
              <span className="find-music-text">Find Your Music</span>
            </div>
            <span className="mood-subtitle">
              Describe how are you feeling today!
            </span>
            <div className="mood-description">
              Talk about your mood in as much detail as possible
            </div>
          </div>
          <div className="input-container">
            <div className="input-wrapper">
              <div className="textarea-container">
                <div className="textarea-container">
                  <textarea
                    className="mood-textarea"
                    placeholder="Tell me what you feel!"
                    value={inputValue}
                    disabled={submitted}
                    onInput={(event) => {
                      setInputValue(event.target.value);
                      adjustHeight();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSubmit();
                      }
                    }}
                  />
                  <button
                    className="submit-button"
                    disabled={submitted}
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: submitted
                        ? "transparent"
                        : "rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {submitted ? (
                      <div className="loading-indicator" />
                    ) : (
                      <i
                        className="ti ti-corner-up-right submit-icon"
                        style={{
                          opacity: inputValue ? "1" : "0.3",
                        }}
                      />
                    )}
                  </button>
                </div>
                <p className="status-text">
                  {submitted ? (
                    <span>AI is thinking...</span>
                  ) : (
                    <span>Ready to submit!</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop examples section */}
      <section className="examples-section">
        <div className="examples-container">
          <div className="examples-content">
            <div className="examples-box">
              <div className="examples-title-container">
                <h2 className="examples-title">What can you enter?</h2>
              </div>
              <div className="examples-grid">
                <div className="examples-row">
                  <div className="example-column">
                    <div className="example-box example-box-one">
                      <div className="example-content">
                        <div className="example-text">
                          <h5 className="example-title">Emotions</h5>
                          <p className="example-description">
                            <div>
                              <span>
                                What exactly do you feel at this moment
                              </span>
                              <br />
                              <br />
                            </div>
                            <div>"I feel joy, I am happy"</div>
                          </p>
                        </div>
                        <div className="example-image-container">
                          <img
                            alt="Emotions example"
                            src="https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2F3737a7bdb7af4a8bb3d1c68157df39ba"
                            className="example-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="example-column">
                    <div className="example-box example-box-two">
                      <div className="example-content">
                        <div className="example-text">
                          <h5 className="example-title">Stories</h5>
                          <p className="example-description">
                            <div>
                              Tell me about something that happened to you today
                            </div>
                            <div>
                              <br />
                            </div>
                            <div>
                              "I went to the gym and fell in love with a guy who
                              worked out there"
                            </div>
                          </p>
                        </div>
                        <div className="example-image-container">
                          <img
                            alt="Stories example"
                            src="https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2Fdb6ea667c7504a2b8b57268ff04927b8"
                            className="example-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="example-column">
                    <div className="example-box example-box-three">
                      <div className="example-content">
                        <div className="example-text">
                          <h5 className="example-title">Situation</h5>
                          <p className="example-description">
                            <div>
                              Close your eyes and describe to us what you see,
                              in what climate your imagination painted the
                              picture
                            </div>
                            <div>
                              <br />
                            </div>
                            <div>
                              "I'm on the beach on vacation, dreams come true"
                            </div>
                          </p>
                        </div>
                        <div className="example-image-container">
                          <img
                            alt="Situation example"
                            src="https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2F3737a7bdb7af4a8bb3d1c68157df39ba"
                            className="example-image"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-box"></div>
              <span className="circle-icon"></span>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile examples section */}
      <section className="mobile-examples-section">
        <div className="mobile-examples-container">
          <div className="mobile-examples-header">
            <div className="mobile-examples-title-container">
              <h2 className="mobile-examples-title">What can you enter?</h2>
              <p className="mobile-examples-description">
                Determine how it will be most convenient for you to describe
                your mood today. We do not limit ourselves to just one template,
                it is up to you to decide how to convey in words what you feel.
                If you do not know, below is a small hint of what forms of
                inquiry are most welcome for us!
              </p>
            </div>
            <div className="carousel-controls">
              <button
                className="carousel-button"
                disabled={!canScrollPrev}
                onClick={scrollPrev}
              >
                <i className="ti ti-arrow-left carousel-icon" />
              </button>
              <button
                className="carousel-button"
                disabled={!canScrollNext}
                onClick={scrollNext}
              >
                <i className="ti ti-arrow-right carousel-icon" />
              </button>
            </div>
          </div>
        </div>
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {items.map((item) => (
              <div key={item.id} className="carousel-slide">
                <div className="carousel-slide-content">
                  <img
                    className="carousel-image"
                    src={item.image}
                    alt={item.title}
                  />
                  <div className="carousel-overlay" />
                  <div className="carousel-text">
                    <div className="carousel-title">{item.title}</div>
                    <div className="carousel-description">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="carousel-indicators">
            {items.map((_, index) => (
              <button
                key={index}
                className="carousel-indicator"
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => scrollTo(index)}
                style={{
                  backgroundColor:
                    currentSlide === index
                      ? "rgba(255, 255, 255, 1)"
                      : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-links">
          <a href="#" className="footer-link">
            Terms & Conditions
          </a>
          <a href="#" className="footer-link">
            Support
          </a>
          <a href="#" className="footer-link">
            Log In
          </a>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-social">
          <a href="#" className="social-link">
            <i className="ti ti-brand-instagram"></i>
          </a>
          <a href="#" className="social-link">
            <i className="ti ti-brand-tiktok"></i>
          </a>
          <a href="#" className="social-link">
            <i className="ti ti-brand-youtube"></i>
          </a>
          <a href="#" className="social-link">
            <i className="ti ti-brand-facebook"></i>
          </a>
        </div>
      </footer>
    </div>
  );
}

export default InputDesign;
