import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(-1);
  const [accordionItems] = useState([
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
  ]);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function toggleAccordion(index) {
    setActiveAccordion(activeAccordion === index ? -1 : index);
  }

  return (
    <div className="landing-page">
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.30.0/tabler-icons.min.css"
        rel="stylesheet"
      />
      <div className="app-container">
        <header className="main-header">
          <div className="logo">Logo</div>
          <nav className={`nav-menu ${isMenuOpen ? "menu-open" : ""}`}>
            <div className="nav-item">Home</div>
            <div className="nav-item">Features</div>
            <div className="nav-item">How It Works</div>
            <div className="nav-item">Contact</div>
          </nav>
          <button
            className="menu-toggle"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <div className="hamburger">
              <span
                className={`hamburger-line ${isMenuOpen ? "rotate-down" : ""}`}
              ></span>
              <span
                className={`hamburger-line ${isMenuOpen ? "hidden" : ""}`}
              ></span>
              <span
                className={`hamburger-line ${isMenuOpen ? "rotate-up" : ""}`}
              ></span>
            </div>
          </button>
          <div className="cta-button">Get Started</div>
        </header>

        <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-tagline">Feel the Beat</div>
            <h1 className="hero-title">Mood Music</h1>
            <div className="hero-description">
              Immerse yourself in a world of sound that resonates with your
              feelings. Ready to vibe?
            </div>
            <div className="hero-cta-container">
              <Link to="/input" className="hero-cta-button">
                Find Music
              </Link>
            </div>
          </div>
        </section>

        <section className="playlists-section">
          <div className="playlists-container">
            <div className="playlists-content">
              <h2 className="playlists-title">
                <p className="title-text">
                  <span className="title-large">Personalized Playlists</span>
                  <strong>
                    <span className="cursor"></span>
                  </strong>
                </p>
              </h2>
              <p className="playlists-description">
                Experience playlists crafted by AI that understands your mood.
                Whether you're feeling ecstatic or melancholic, we've got the
                tunes to match. Get ready to jam!
              </p>
              <div className="explore-button">Explore Now</div>
            </div>
            <div className="playlists-image-container">
              <img
                alt="Collection of musical instruments"
                src="https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2F3737a7bdb7af4a8bb3d1c68157df39ba"
                className="playlists-image"
              />
            </div>
          </div>
        </section>

        <section className="mood-section">
          <div className="mood-title">Your Mood, Your Music</div>
        </section>

        <section className="how-section">
          <div className="how-background"></div>
          <div className="how-container">
            <div className="how-content">
              <div className="how-card">
                <div className="how-header">
                  <i className="ti ti-settings"></i>
                  <h3 className="how-title">How It Works</h3>
                </div>
                <p className="how-description">
                  AI magic for your musical experience.
                </p>
                <div className="accordion-container">
                  {accordionItems.map((item, index) => (
                    <div key={index} className="accordion-item">
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="accordion-button"
                      >
                        <span>{item.title}</span>
                        <i
                          className={`ti ti-chevron-${
                            activeAccordion === index ? "up" : "down"
                          }`}
                        ></i>
                      </button>
                      <div
                        className={`accordion-content ${
                          activeAccordion === index ? "active" : ""
                        }`}
                      >
                        <p className="accordion-text">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="how-image-container">
              <img
                alt="Person enjoying music"
                src="https://cdn.builder.io/api/v1/image/assets%2Fbba7ad93b6cd465bbcc9098b789c5ec9%2Fdb6ea667c7504a2b8b57268ff04927b8"
                className="how-image"
              />
            </div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="testimonials-background"></div>
          <div className="testimonials-container">
            <div className="testimonials-content">
              <div className="testimonials-list">
                {[
                  {
                    image:
                      "https://r.mobirisesite.com/1250704/assets/images/photo-1681075401974-907cc62a4373.jpeg",
                    name: "Emily Stone",
                    role: "Mollitia Accusamus",
                    text: "This platform changed my life! I finally found the perfect playlist for my coffee-fueled existential crises.",
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
                    name: "Jake Rivers",
                    role: "Mollitia Accusamus",
                    text: "The AI recommendations are spot on! It's like my own personal DJ, but way cooler.",
                  },
                ].map((testimonial, index) => (
                  <div key={index} className="testimonial-card">
                    <div className="testimonial-wrapper">
                      <div className="testimonial-img">
                        <div className="image-wrap">
                          <img
                            src={testimonial.image}
                            className="testimonial-avatar"
                          />
                        </div>
                        <div className="name-wrapper">
                          <p className="testimonial-name">{testimonial.name}</p>
                          <p className="testimonial-role">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="testimonial-content">
                        <p className="testimonial-text">{testimonial.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-form-container">
            <div className="contact-header">
              <div className="contact-icon-circle">
                <i className="ti ti-mail"></i>
              </div>
              <h3 className="contact-title">Get In Touch</h3>
            </div>
            <form className="contact-form">
              <input type="text" placeholder="Name" className="contact-input" />
              <input
                type="email"
                placeholder="Email"
                className="contact-input"
              />
              <textarea
                placeholder="Message"
                className="contact-textarea"
              ></textarea>
              <button className="contact-submit">Send Message</button>
            </form>
          </div>
          <div className="contact-info-container">
            <div className="contact-header">
              <div className="contact-icon-circle">
                <i className="ti ti-phone"></i>
              </div>
              <h3 className="contact-title">Contact Us</h3>
            </div>
            <ul className="contact-list">
              <li className="contact-item">
                <i className="ti ti-phone contact-item-icon"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="contact-item">
                <i className="ti ti-mail contact-item-icon"></i>
                <span>contact@moodmusic.com</span>
              </li>
              <li className="contact-item">
                <i className="ti ti-map-pin contact-item-icon"></i>
                <span>123 Music Street, Harmony City, MC 12345</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
