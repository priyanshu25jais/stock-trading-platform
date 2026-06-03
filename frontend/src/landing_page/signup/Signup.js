import React, { useEffect } from "react";

function Signup() {
  useEffect(() => {
    window.location.href = "https://stock-tradingdashboard.netlify.app";
  }, []);

  return <h2>Redirecting to Dashboard...</h2>;
}

export default Signup;