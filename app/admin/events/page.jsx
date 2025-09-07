"use client";
import { useState, useEffect } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  async function fetchEvents(q = "") {
    const res = await fetch(`/admin/events/route.js?q=${q}`);
    const data = await res.json();
    setEvents(data.events || []);
  }

  useEffect(() => { fetchEvents(); }, []);

  async function replay(id) {
    await fetch(`/admin/events/route.js?replay=${id}`, { method: "POST" });
    fetchEvents();
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Events Dashboard</h1>
      <input
        placeholder="Search by event_id"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <button onClick={() => fetchEvents(search)}>Search</button>
      <ul>
        {events.map(ev => (
          <li key={ev.event_id}>
            {ev.event_id} — {ev.status}
            {ev.status === "failed" && (
              <button onClick={() => replay(ev.event_id)}>Replay</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
