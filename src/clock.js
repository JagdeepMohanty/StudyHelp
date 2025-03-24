import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", fontSize: "2rem", marginTop: "20%" }}>
      <h1>{time.toLocaleTimeString()}</h1>
    </div>
  );
}
