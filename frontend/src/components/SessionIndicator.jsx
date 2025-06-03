import React from "react";
import { useAuth } from "../context/AuthContext";

export default function SessionIndicator() {
  const { user, token, signout } = useAuth();
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) ;
      else ;
    }, 500); 

    return () => clearTimeout(timeout);
  }, [user, token]);

  return (
    <div style={{
      position:"fixed",right:10,bottom:10,
      fontSize:12,padding:"4px 8px",
      background:user?"#4caf50":"#ff5252",
      color:"#fff",borderRadius:4,zIndex:9999
    }}>
      {user ? (
        <>
          👤 {user.username}
          <button onClick={signout} style={{
            marginLeft: 10,
            background: "#fff",
            color: "#4caf50",
            border: "none",
            borderRadius: 4,
            padding: "2px 6px",
            cursor: "pointer"
          }}>
            Wyloguj
          </button>
        </>
      ) : "🔒 offline"}
    </div>
  );
}
