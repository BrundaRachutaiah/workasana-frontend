import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

import {
  Bar,
  Pie
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Reports = () => {
  const [lastWeek, setLastWeek] = useState(0);
  const [pending, setPending] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [byTeam, setByTeam] = useState([]);
  const [byOwner, setByOwner] = useState([]);
  const [byProject, setByProject] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setError("");
        setIsLoading(true);
        const last = await api.get("/report/last-week");
        const pend = await api.get("/report/pending");
        const closed = await api.get("/report/closed-tasks");

        setLastWeek(last.data.count);
        setPending(pend.data.totalDaysPending);
        setPendingCount(pend.data.taskCount || 0);
        setByTeam(closed.data.byTeam);
        setByOwner(closed.data.byOwner);
        setByProject(closed.data.byProject || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  /* ---------------- CHART DATA ---------------- */

  const teamData = {
    labels: byTeam.map(t => t.teamName || "Unknown"),
    datasets: [
      {
        label: "Tasks Closed",
        data: byTeam.map(t => t.count)
      }
    ]
  };

  const ownerData = {
    labels: byOwner.map(o => o.ownerName || "Unknown"),
    datasets: [
      {
        label: "Tasks Closed",
        data: byOwner.map(o => o.count)
      }
    ]
  };

  const projectData = {
    labels: byProject.map(p => p.projectName || "Unknown"),
    datasets: [
      {
        label: "Tasks Closed",
        data: byProject.map(p => p.count)
      }
    ]
  };

  const summaryData = {
    labels: ["Completed (last 7 days)", "Open Tasks"],
    datasets: [
      {
        data: [lastWeek, pendingCount]
      }
    ]
  };

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      {/* TITLE */}
      <h1 style={title}>Workasana Reports</h1>

      {/* SECTION */}
      <div style={container}>
        <h2 style={sectionTitle}>Report Overview</h2>

        {isLoading ? (
          <p style={{ color: "#888" }}>Loading reports...</p>
        ) : error ? (
          <p style={{ color: "#b91c1c" }}>{error}</p>
        ) : null}

        {/* GRID */}
        <div style={grid}>
          
          {/* CARD 1 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Tasks Completed Last Week
            </h3>
            <div style={statBox}>
              <div style={bigStat}>{lastWeek}</div>
              <div style={smallStat}>completed tasks (last 7 days)</div>
            </div>
          </div>

          {/* CARD 2 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Open Work
            </h3>
            <div style={statBox}>
              <div style={bigStat}>{pending}</div>
              <div style={smallStat}>total days pending across {pendingCount} open tasks</div>
            </div>
          </div>

          {/* CARD 3 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Tasks Closed by Team
            </h3>
            <div style={chartBox}>
              {byTeam.length > 0 ? (
                <Bar data={teamData} />
              ) : (
                <p style={{ color: "#888" }}>No completed tasks yet.</p>
              )}
            </div>
          </div>

          {/* CARD 4 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Tasks Closed by Owner
            </h3>
            <div style={chartBox}>
              {byOwner.length > 0 ? (
                <Bar data={ownerData} />
              ) : (
                <p style={{ color: "#888" }}>No completed tasks yet.</p>
              )}
            </div>
          </div>

          {/* CARD 5 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Completed vs Open
            </h3>
            <div style={chartBox}>
              <Pie data={summaryData} />
            </div>
          </div>

          {/* CARD 6 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Tasks Closed by Project
            </h3>
            <div style={chartBox}>
              {byProject.length > 0 ? (
                <Bar data={projectData} />
              ) : (
                <p style={{ color: "#888" }}>No completed tasks yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Reports;

const title = {
  fontSize: "22px",
  fontWeight: 600,
  marginBottom: "20px"
};

const container = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb"
};

const sectionTitle = {
  fontSize: "16px",
  marginBottom: "20px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
};

const card = {
  background: "#f9fafb",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #eee"
};

const cardTitle = {
  fontSize: "14px",
  marginBottom: "10px",
  fontWeight: 500
};

const chartBox = {
  height: "250px"
};

const statBox = {
  height: "250px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px"
};

const bigStat = {
  fontSize: "44px",
  fontWeight: 700,
  color: "#111"
};

const smallStat = {
  fontSize: "12px",
  color: "#6b7280"
};
