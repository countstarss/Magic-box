"use client";

import { useState, useEffect } from "react";

interface Email {
  id: string;
  snippet: string;
  payload: {
    headers: { name: string; value: string }[];
  };
}

export default function EmailList() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEmails() {
      try {
        const response = await fetch("/api/gmail");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEmails(data.emails || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEmails();
  }, []);

  if (loading) return <p>Loading emails...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {emails.map((email) => (
        <div key={email.id} className="border p-4 mb-4">
          <h3 className="font-bold">
            {
              email.payload.headers.find((header) => header.name === "Subject")
                ?.value
            }
          </h3>
          <p>{email.snippet}</p>
        </div>
      ))}
    </div>
  );
}
