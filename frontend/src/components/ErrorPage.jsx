import React from "react";
import styles from "./ErrorPage.module.css";
import { useNavigate } from "react-router-dom";

export default function ErrorPage({ code = 404, message = "Page not found" }) {
  const navigate = useNavigate();

  const friendly = {
    403: "Forbidden – you don’t have permission to view this page.",
    404: "Page not found.",
    500: "Unexpected server error.",
  }[code] ?? message;

  return (
    <div className={styles.wrapper}>
      <div className={styles.box}>
        <span className={styles.code}>{code}</span>
        <span className={styles.msg}>{friendly}</span>
        <button className={styles.btn} onClick={() => navigate("/")}>
          ← Back home
        </button>
      </div>
    </div>
  );
}
