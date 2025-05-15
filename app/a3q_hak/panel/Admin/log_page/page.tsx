import { useEffect, useState } from "react";

export default function LogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/logs")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setLogs(data.logs);
        }
      })
      .catch(() => setError("Failed to fetch logs"))
      .finally(() => setLoading(false));
  }, []);

  function getColor(line: string) {
    if (line.toLowerCase().includes("error")) return "red";
    if (line.toLowerCase().includes("warn")) return "orange";
    if (line.toLowerCase().includes("info")) return "blue";
    return "black";
  }

  if (loading) return <div>Loading logs...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ fontFamily: "monospace", whiteSpace: "pre-wrap", padding: 20, maxHeight: "80vh", overflowY: "scroll", backgroundColor: "#f4f4f4" }}>
      {logs.map((line, i) => (
        <div key={i} style={{ color: getColor(line), borderBottom: "1px solid #ddd", padding: "4px 0" }}>
          {line}
        </div>
      ))}
    </div>
  );
}
