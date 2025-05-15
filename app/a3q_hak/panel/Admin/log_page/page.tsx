"use client";

import { useEffect, useState } from "react";

type LogEntry = {
  id: string;
  email: string;
  level: string;
  message: string;
  timestamp: string;
};

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/a3q_hak/api/Admin/log/fetch")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setLogs(data.logs.map((log: string) => JSON.parse(log)));
      })
      .catch(() => setError("Failed to fetch logs"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading logs...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 16 }}>🚀 Server Logs - Boss Mode</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "monospace",
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>id</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Level</th>
            <th style={thStyle}>Message</th>
            <th style={thStyle}>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, idx) => (
            <tr
              key={idx}
              style={{
                backgroundColor: idx % 2 === 0 ? "#2d2d2d" : "#252526",
              }}
            >
              <td style={tdStyle}>{log.id}</td>
              <td style={tdStyle}>{log.email}</td>
              <td style={{ ...tdStyle, color: getLevelColor(log.level) }}>{log.level}</td>
              <td style={tdStyle}>{log.message}</td>
              <td style={tdStyle}>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  borderBottom: "2px solid #555",
  padding: "8px 12px",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "8px 12px",
  borderBottom: "1px solid #333",
};

function getLevelColor(level: string) {
  switch (level.toLowerCase()) {
    case "error":
      return "#f44336"; // red
    case "warn":
      return "#ff9800"; // orange
    case "info":
      return "#2196f3"; // blue
    default:
      return "#d4d4d4"; // greyish
  }
}
