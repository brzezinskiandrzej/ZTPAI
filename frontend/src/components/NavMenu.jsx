// src/components/NavMenu.jsx
import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./NavMenu.module.css";

/**
 * @param {Object}   props
 * @param {"scroll"|"hash"} props.mode      – jak reagować na klik (domyślnie "scroll")
 * @param {Function} props.scrollTo         – funkcja scroll(id) z LandingPage
 * @param {Function} props.navigate         – react-router navigate
 * @param {Object=}  props.user             – auth context
 * @param {boolean=} props.isMenuOpen       – do burgera
 * @param {Function=} props.toggleMenu
 */
export default function NavMenu({
  mode      = "scroll",
  scrollTo,
  navigate,
  user,
  isMenuOpen = false,
  toggleMenu = () => {}
}) {
  const loc = useLocation();

  /** wspólna obsługa kliknięć */
  const handleNavClick = (id) => {
    toggleMenu();               // zawsze zamykamy menu mobilne

    if (mode === "scroll") {
      scrollTo(id);             // płynny scroll
    } else {
      // jeżeli już jesteśmy na “/”, po hash-change nie przeładuje się
      if (loc.pathname === "/") {
        window.location.hash = id;
      } else {
        navigate(`/#${id}`);
      }
    }
  };

  return (
    <nav
      className={`${styles.navMenu} ${isMenuOpen ? styles.menuOpen : ""}`}
    >
      <div className={styles.navItem} onClick={() => handleNavClick("home")}>
        Home
      </div>
      <div className={styles.navItem} onClick={() => handleNavClick("features")}>
        Features
      </div>
      <div className={styles.navItem} onClick={() => handleNavClick("how")}>
        How&nbsp;It&nbsp;Works
      </div>
      <div className={styles.navItem} onClick={() => handleNavClick("contact")}>
        Contact
      </div>

      {user?.role === "admin" && (
        <div
          className={`${styles.navItem} ${styles.adminItem}`}
          onClick={() => { toggleMenu(); navigate("/admin"); }}
        >
          Admin&nbsp;panel
        </div>
      )}
    </nav>
  );
}
