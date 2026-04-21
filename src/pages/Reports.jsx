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
  const [byTeam, setByTeam] = useState([]);
  const [byOwner, setByOwner] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const last = await api.get("/report/last-week");
        const pend = await api.get("/report/pending");
        const closed = await api.get("/report/closed-tasks");

        setLastWeek(last.data.count);
        setPending(pend.data.totalDaysPending);
        setByTeam(closed.data.byTeam);
        setByOwner(closed.data.byOwner);
      } catch (err) {
        console.error(err);
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

  const summaryData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [lastWeek, pending]
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

        {/* GRID */}
        <div style={grid}>
          
          {/* CARD 1 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Total Work Done Last Week
            </h3>
            <div style={chartBox}>
              <Bar data={teamData} />
            </div>
          </div>

          {/* CARD 2 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Total Days of Work Pending
            </h3>
            <div style={chartBox}>
              <Pie data={summaryData} />
            </div>
          </div>

          {/* CARD 3 */}
          <div style={card}>
            <h3 style={cardTitle}>
              Tasks Closed by Team
            </h3>
            <div style={chartBox}>
              <Bar data={teamData} />
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