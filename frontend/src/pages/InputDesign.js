import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";
import styles from "./InputDesign.module.css";

function InputDesign() {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [items] = useState([
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
      diff > 0 ? scrollNext() : scrollPrev();
    }
  }

  function toggleMenu() {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  function handleSubmit() {
    if (!inputValue.trim() || submitted) return;
    setSubmitted(true);
    setInputValue("");
    setTimeout(() => setSubmitted(false), 3000);
  }

  function adjustHeight() {
    const textarea = document.querySelector(`.${styles.moodTextarea}`);
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height =
        Math.min(Math.max(textarea.scrollHeight, 56), 200) + "px";
    }
  }

  return (
    <div className={styles.inputDesign}>
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.30.0/tabler-icons.min.css"
        rel="stylesheet"
      />

      {/* Header */}
      <div className={styles.header}>
        <div
          className="logo"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <img
            src="/logo_mood_music.png"
            alt="Mood Music Logo"
            style={{ height: "40px", objectFit: "contain" }}
          />
        </div>
        <nav className={styles.navMenu}>
          <div className={styles.navItem} onClick={() => navigate("/#home")} >Home</div>
          <div className={styles.navItem} onClick={() => navigate("/#features")}>Features</div>
          <div className={styles.navItem} onClick={() => navigate("/#how")}>How It Works</div>
          <div className={styles.navItem} onClick={() => navigate("/#contact")}>Contact</div>
        </nav>
        <button
          className={styles.menuToggle}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={toggleMenu}
        >
          <div className={styles.hamburger}>
            <span
              className={`${styles.hamburgerLine} ${
                isMobileMenuOpen ? styles.rotateDown : ""
              }`}
            />
            <span
              className={`${styles.hamburgerLine} ${
                isMobileMenuOpen ? styles.hidden : ""
              }`}
            />
            <span
              className={`${styles.hamburgerLine} ${
                isMobileMenuOpen ? styles.rotateUp : ""
              }`}
            />
          </div>
        </button>
        <div
          className={styles.mobileMenu}
          style={{
            transform: isMobileMenuOpen
              ? "translateX(0)"
              : "translateX(100%)",
          }}
        >
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileNavItem}>Home</div>
            <div className={styles.mobileNavItem} onClick={() => {navigate("/#features"); setIsMobileMenuOpen(false);}}>Features</div>
            <div className={styles.mobileNavItem} onClick={() => {navigate("/#how"); setIsMobileMenuOpen(false);}}>How It Works</div>
            <div className={styles.mobileNavItem} onClick={() => {navigate("/#contact"); setIsMobileMenuOpen(false);}}>Contact</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={styles.typeBox}
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className={styles.moodBox}>
          <div className={styles.moodTitle}>
            <div className={styles.findMusicButton}>
              <span className={styles.findMusicText}>Find Your Music</span>
            </div>
            <span className={styles.moodSubtitle}>
              Describe how are you feeling today!
            </span>
            <div className={styles.moodDescription}>
              Talk about your mood in as much detail as possible
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
              <div className={styles.textareaContainer}>
                <textarea
                  className={styles.moodTextarea}
                  placeholder="Tell me what you feel!"
                  value={inputValue}
                  disabled={submitted}
                  onInput={(e) => {
                    setInputValue(e.target.value);
                    adjustHeight();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                />
                <button
                  className={styles.submitButton}
                  disabled={submitted}
                  onClick={handleSubmit}
                  style={{
                    backgroundColor: submitted
                      ? "transparent"
                      : "rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {submitted ? (
                    <div className={styles.loadingIndicator} />
                  ) : (
                    <i
                      className={`ti ti-corner-up-right ${styles.submitIcon}`}
                      style={{ opacity: inputValue ? 1 : 0.3 }}
                    />
                  )}
                </button>
              </div>
              <p className={styles.statusText}>
                {submitted ? (<span>AI is thinking...</span>) : (<span>Ready to submit!</span>)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop examples */}
      <section className={styles.examplesSection}>
        <div className={styles.examplesContainer}>
          <div className={styles.examplesContent}>
            <div className={styles.examplesBox}>
              <div className={styles.examplesTitleContainer}>
                <h2 className={styles.examplesTitle}>What can you enter?</h2>
              </div>
              <div className={styles.examplesGrid}>
                {items.map((item) => (
                  <div key={item.id} className={styles.exampleColumn}>
                    <div
                      className={
                        item.id === "emotions"
                          ? styles.exampleBoxOne
                          : item.id === "stories"
                          ? styles.exampleBoxTwo
                          : styles.exampleBoxThree
                      }
                    >
                      <div className={styles.exampleContent}>
                        <div className={styles.exampleText}>
                          <h5 className={styles.exampleTitle}>{item.title}</h5>
                          <p className={styles.exampleDescription}>
                            {item.description.split("\n").map((line, i) => (
                              <React.Fragment key={i}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </p>
                        </div>
                        <div className={styles.exampleImageContainer}>
                          <img
                            src={item.image}
                            alt={item.title}
                            className={styles.exampleImage}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.borderBox} />
              <span className={styles.circleIcon} />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile examples */}
      <section className={styles.mobileExamplesSection}>
        <div className={styles.mobileExamplesContainer}>
          <div className={styles.mobileExamplesHeader}>
            <div className={styles.mobileExamplesTitleContainer}>
              <h2 className={styles.mobileExamplesTitle}>
                What can you enter?
              </h2>
              <p className={styles.mobileExamplesDescription}>
                Determine how it will be most convenient for you to describe
                your mood today. We do not limit ourselves to just one template,
                it is up to you to decide how to convey in words what you feel.
                If you do not know, below is a small hint of what forms of
                inquiry are most welcome for us!
              </p>
            </div>
            <div className={styles.carouselControls}>
              <button
                className={styles.carouselButton}
                disabled={!canScrollPrev}
                onClick={scrollPrev}
              >
                <i className={`ti ti-arrow-left ${styles.carouselIcon}`} />
              </button>
              <button
                className={styles.carouselButton}
                disabled={!canScrollNext}
                onClick={scrollNext}
              >
                <i className={`ti ti-arrow-right ${styles.carouselIcon}`} />
              </button>
            </div>
          </div>
        </div>
        <div className={styles.carouselContainer}>
          <div
            className={styles.carouselTrack}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {items.map((item) => (
              <div key={item.id} className={styles.carouselSlide}>
                <div className={styles.carouselSlideContent}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.carouselImage}
                  />
                  <div className={styles.carouselOverlay} />
                  <div className={styles.carouselText}>
                    <div className={styles.carouselTitle}>{item.title}</div>
                    <div className={styles.carouselDescription}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.carouselIndicators}>
            {items.map((_, idx) => (
              <button
                key={idx}
                className={styles.carouselIndicator}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => scrollTo(idx)}
                style={{
                  backgroundColor:
                    currentSlide === idx ? "rgba(255,255,255,1)" : "transparent",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="#" className={styles.footerLink}>
            Terms &amp; Conditions
          </a>
          <a href="#" className={styles.footerLink}>
            Support
          </a>
          <a href="#" className={styles.footerLink}>
            Log In
          </a>
        </div>
        <div className={styles.footerDivider} />
        <div className={styles.footerSocial}>
          {["instagram", "tiktok", "youtube", "facebook"].map((network) => (
            <a key={network} href="#" className={styles.socialLink}>
              <i className={`ti ti-brand-${network}`} />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default InputDesign;
