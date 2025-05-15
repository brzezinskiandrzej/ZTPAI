import React from "react";
import { useAuth } from "../context/AuthContext";

export default function SessionIndicator() {
  const { user, token } = useAuth();
  React.useEffect(() => {
    if (user) console.log("✅ Sesja aktywna", user.username, "len =", token?.length);
    else      console.log("⛔ Brak sesji (user == null)");
  }, [user, token]);

  return (
    <div style={{
      position:"fixed",right:10,bottom:10,
      fontSize:12,padding:"4px 8px",
      background:user?"#4caf50":"#ff5252",
      color:"#fff",borderRadius:4,zIndex:9999
    }}>
      {user ? `👤 ${user.username}` : "🔒 offline"}
    </div>
  );
}
