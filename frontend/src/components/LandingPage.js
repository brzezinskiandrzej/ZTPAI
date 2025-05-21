// src/components/LandingPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./LandingPage.module.css";
import { useAuth }        from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(-1);
  const navigate = useNavigate();
  const { user }     = useAuth(); 

  const accordionItems = [
    {
      title: "AI",
      content:
        "Our AI analyzes your mood and preferences, crafting playlists that resonate with your feelings. It's like having a DJ who knows you better than your best friend—minus the awkward small talk.",
    },
    {
      title: "Map",
      content:
        "Explore our interactive sound map, where each click reveals a new musical adventure. It's like Google Maps, but instead of directions, you get the soundtrack to your life's epic moments.",
    },
    {
      title: "Smart",
      content:
        "Our recommendations get smarter with every listen. The more you jam, the better we get at serving up tracks that make your heart sing and your feet dance.",
    },
    {
      title: "Account",
      content:
        "Create an account to save your favorite tracks and playlists. No more searching for that one song you loved last week—it's all right there, waiting for you.",
    },
    {
      title: "Dashboard",
      content:
        "Manage your mood-based recommendations with ease. Our dashboard is your personal control center for all things musical, ensuring you never miss a beat.",
    },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleAccordion = (idx) =>
    setActiveAccordion(activeAccordion === idx ? -1 : idx);

  return (
    <div className={styles.landingPage}>
      {/*  fonty + ikony  */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.30.0/tabler-icons.min.css"
        rel="stylesheet"
      />

      <div className={styles.appContainer}>
        {/* ---------------- HEADER ---------------- */}
        <header className={styles.mainHeader}>
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

          <nav
            className={`${styles.navMenu} ${
              isMenuOpen ? styles.menuOpen : ""
            }`}
          >
            <div className={styles.navItem}>Home</div>
            <div className={styles.navItem}>Features</div>
            <div className={styles.navItem}>How It Works</div>
            <div className={styles.navItem}>Contact</div>
          </nav>

          <button
            className={styles.menuToggle}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <div className={styles.hamburger}>
              <span
                className={`${styles.hamburgerLine} ${
                  isMenuOpen ? styles.rotateDown : ""
                }`}
              />
              <span
                className={`${styles.hamburgerLine} ${
                  isMenuOpen ? styles.hidden : ""
                }`}
              />
              <span
                className={`${styles.hamburgerLine} ${
                  isMenuOpen ? styles.rotateUp : ""
                }`}
              />
            </div>
          </button>

          {user ? (
            
            <div className={styles.ctaButton} onClick={() => navigate("/account")}>
              {user.username}
            </div>
          ) : (
            
            <div className={styles.ctaButton} onClick={() => navigate("/login")}>
              Get&nbsp;Started
            </div>
          )}
        </header>

        {/* ---------------- HERO ---------------- */}
        <section className={styles.heroSection}>
          <div className={styles.heroOverlay} />
          <div className={styles.heroContent}>
            <div className={styles.heroTagline}>Feel the Beat</div>
            <h1 className={styles.heroTitle}>Mood Music</h1>
            <p className={styles.heroDescription}>
              Immerse yourself in a world of sound that resonates with your
              feelings. Ready to vibe?
            </p>
            <div className={styles.heroCtaContainer}>
              <Link to="/input" className={styles.heroCtaButton}>
                Find Music
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- PLAYLISTS ---------------- */}
        <section className={styles.playlistsSection}>
          <div className={styles.playlistsContainer}>
            <div className={styles.playlistsContent}>
              <h2 className={styles.playlistsTitle}>
                <span className={styles.titleLarge}>Personalized Playlists</span>
                <strong>
                  <span className={styles.cursor} />
                </strong>
              </h2>

              <p className={styles.playlistsDescription}>
                Experience playlists crafted by AI that understands your mood.
                Whether you're feeling ecstatic or melancholic, we've got the
                tunes to match. Get ready to jam!
              </p>

              <button className={styles.exploreButton}>Explore Now</button>
            </div>

            <div className={styles.playlistsImageContainer}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2F3737a7bdb7af4a8bb3d1c68157df39ba"
                alt="Collection of musical instruments"
                className={styles.playlistsImage}
              />
            </div>
          </div>
        </section>

        {/* ---------------- MOOD BANNER ---------------- */}
        <section className={styles.moodSection}>
          <div className={styles.moodTitle}>Your Mood, Your Music</div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section className={styles.howSection}>
          <div className={styles.howBackground} />
          <div className={styles.howContainer}>
            <div className={styles.howContent}>
              <div className={styles.howCard}>
                <div className={styles.howHeader}>
                  <i className="ti ti-settings" />
                  <h3 className={styles.howTitle}>How It Works</h3>
                </div>
                <p className={styles.howDescription}>
                  AI magic for your musical experience.
                </p>

                {/*  ACCORDION  */}
                <div className={styles.accordionContainer}>
                  {accordionItems.map((item, idx) => (
                    <div key={idx} className={styles.accordionItem}>
                      <button
                        onClick={() => toggleAccordion(idx)}
                        className={styles.accordionButton}
                      >
                        <span>{item.title}</span>
                        <i
                          className={`ti ti-chevron-${
                            activeAccordion === idx ? "up" : "down"
                          }`}
                        />
                      </button>

                      <div
                        className={`${styles.accordionContent} ${
                          activeAccordion === idx ? styles.active : ""
                        }`}
                      >
                        <p className={styles.accordionText}>{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* /accordion */}
              </div>
            </div>

            <div className={styles.howImageContainer}>
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2Fdb6ea667c7504a2b8b57268ff04927b8"
                alt="Person enjoying music"
                className={styles.howImage}
              />
            </div>
          </div>
        </section>

        {/* ---------------- TESTIMONIALS ---------------- */}
        <section className={styles.testimonialsSection}>
          <div className={styles.testimonialsBackground} />
          <div className={styles.testimonialsContainer}>
            <div className={styles.testimonialsContent}>
              <div className={styles.testimonialsList}>
                {[
                  {
                    image:
                      "https://r.mobirisesite.com/1250704/assets/images/photo-1681075401974-907cc62a4373.jpeg",
                    name: "Emily Stone",
                    role: "Mollitia Accusamus",
                    text: "This platform changed my life! I finally found the perfect playlist for my coffee‑fueled existential crises.",
                  },
                  {
                    image:
                      "https://r.mobirisesite.com/1250704/assets/images/photo-1535026406642-530e01750ad7.jpeg",
                    name: "Jake Rivers",
                    role: "Mollitia Accusamus",
                    text: "I never knew I needed a sound map until now. It's like a treasure hunt for my ears!",
                  },
                  {
                    image:
                      "https://r.mobirisesite.com/1250704/assets/images/photo-1525614686090-7a3108e3758e.jpeg",
                    name: "Olivia Hart",
                    role: "Mollitia Accusamus",
                    text: "The AI recommendations are spot on! It's like my own personal DJ, but way cooler.",
                  },
                ].map((t, i) => (
                  <div key={i} className={styles.testimonialCard}>
                    <div className={styles.testimonialWrapper}>
                      <div className={styles.testimonialImg}>
                        <div className={styles.imageWrap}>
                          <img
                            src={t.image}
                            alt={t.name}
                            className={styles.testimonialAvatar}
                          />
                        </div>
                        <div className={styles.nameWrapper}>
                          <p className={styles.testimonialName}>{t.name}</p>
                          <p className={styles.testimonialRole}>{t.role}</p>
                        </div>
                      </div>
                      <p className={styles.testimonialText}>{t.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ---------------- CONTACT ---------------- */}
      <section className={styles.contactSection}>
        <div className={styles.contactContainer}>
          {/* FORM */}
          <div className={styles.contactFormContainer}>
            <div className={styles.contactHeader}>
              <div className={styles.contactIconCircle}>
                <i className="ti ti-mail" />
              </div>
              <h3 className={styles.contactTitle}>Get In Touch</h3>
            </div>

            <form className={styles.contactForm}>
              <input
                type="text"
                placeholder="Name"
                className={styles.contactInput}
              />
              <input
                type="email"
                placeholder="Email"
                className={styles.contactInput}
              />
              <textarea
                placeholder="Message"
                className={styles.contactTextarea}
              />
              <button type="submit" className={styles.contactSubmit}>
                Send Message
              </button>
            </form>
          </div>

          {/* INFO */}
          <div className={styles.contactInfoContainer}>
            <div className={styles.contactHeader}>
              <div className={styles.contactIconCircle}>
                <i className="ti ti-phone" />
              </div>
              <h3 className={styles.contactTitle}>Contact Us</h3>
            </div>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <i className={`ti ti-phone ${styles.contactItemIcon}`} />
                <span>+1 (555) 123‑4567</span>
              </li>
              <li className={styles.contactItem}>
                <i className={`ti ti-mail ${styles.contactItemIcon}`} />
                <span>contact@moodmusic.com</span>
              </li>
              <li className={styles.contactItem}>
                <i className={`ti ti-map-pin ${styles.contactItemIcon}`} />
                <span>123 Music Street, Harmony City, MC 12345</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
