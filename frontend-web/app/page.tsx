import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/sport-locations`)
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <div>
      <h1>Liste des lieux sportifs</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
