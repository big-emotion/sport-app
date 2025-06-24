// app/page.tsx ou pages/index.tsx
'use client'

import { useEffect, useState } from "react";

export default function Home() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/todos/1`;
        console.log("Requesting:", apiUrl);

        fetch(apiUrl)
            .then(res => {
                console.log("Response status:", res.status); 
                return res.json();
            })
            .then(data => {
                console.log("Data received:", data);
                setData(data);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });
    }, []);



    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">API Response</h1>
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
