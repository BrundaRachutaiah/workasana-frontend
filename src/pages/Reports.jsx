import { useCallback, useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import styles from "./Reports.module.css";
import LoadingOverlay from "../components/LoadingOverlay";

import { Bar, Pie } from "react-chartjs-2";

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

const PRIMARY = "#4f46e5";
const GRID = "rgba(15, 23, 42, 0.08)";

const ellipsize = (value, max = 14) => {
  const str = String(value ?? "");
  if (str.length <= max) return str;
  return `${str.slice(0, Math.max(0, max - 1))}…`;
};

const Reports = () => {
  const [lastWeek, setLastWeek] = useState(0);
  const [pendingDays, setPendingDays] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [byTeam, setByTeam] = useState([]);
  const [byOwner, setByOwner] = useState([]);
  const [byProject, setByProject] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setError("");
      setIsLoading(true);

      const [last, pend, closed] = await Promise.all([
        api.get("/report/last-week"),
        api.get("/report/pending"),
        api.get("/report/closed-tasks")
      ]);

      setLastWeek(last.data.count || 0);
      setPendingDays(pend.data.totalDaysPending || 0);
      setPendingCount(pend.data.taskCount || 0);
      setByTeam(closed.data.byTeam || []);
      setByOwner(closed.data.byOwner || []);
      setByProject(closed.data.byProject || []);
      setLastUpdatedAt(new Date());
    } catch (err) {
      console.error(err);
      setError("Failed to load reports.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const totalKnownTasks = lastWeek + pendingCount;
  const closureRate =
    totalKnownTasks > 0 ? Math.round((lastWeek / totalKnownTasks) * 100) : 0;
  const avgPendingDays =
    pendingCount > 0 ? Math.round((pendingDays / pendingCount) * 10) / 10 : 0;

  const barBaseOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          padding: 10,
          titleColor: "#fff",
          bodyColor: "#fff",
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: "#64748b",
            maxRotation: 0,
            callback: function (val) {
              return ellipsize(this.getLabelForValue(val), 14);
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: { color: GRID },
          ticks: { color: "#64748b", precision: 0 }
        }
      }
    }),
    []
  );

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: { color: "#64748b", boxWidth: 10, boxHeight: 10 }
        },
        tooltip: {
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          padding: 10,
          titleColor: "#fff",
          bodyColor: "#fff"
        }
      }
    }),
    []
  );

  const teamData = useMemo(
    () => ({
      labels: byTeam.map((t) => t.teamName || "Unknown"),
      datasets: [
        {
          label: "Tasks Closed",
          data: byTeam.map((t) => t.count || 0),
          backgroundColor: "rgba(79, 70, 229, 0.22)",
          borderColor: PRIMARY,
          borderWidth: 2,
          borderRadius: 10,
          maxBarThickness: 46
        }
      ]
    }),
    [byTeam]
  );

  const ownerData = useMemo(
    () => ({
      labels: byOwner.map((o) => o.ownerName || "Unknown"),
      datasets: [
        {
          label: "Tasks Closed",
          data: byOwner.map((o) => o.count || 0),
          backgroundColor: "rgba(99, 102, 241, 0.22)",
          borderColor: "#6366f1",
          borderWidth: 2,
          borderRadius: 10,
          maxBarThickness: 46
        }
      ]
    }),
    [byOwner]
  );

  const projectData = useMemo(
    () => ({
      labels: byProject.map((p) => p.projectName || "Unknown"),
      datasets: [
        {
          label: "Tasks Closed",
          data: byProject.map((p) => p.count || 0),
          backgroundColor: "rgba(20, 184, 166, 0.22)",
          borderColor: "#14b8a6",
          borderWidth: 2,
          borderRadius: 10,
          maxBarThickness: 46
        }
      ]
    }),
    [byProject]
  );

  const summaryData = useMemo(
    () => ({
      labels: ["Completed (last 7 days)", "Open Tasks"],
      datasets: [
        {
          data: [lastWeek, pendingCount],
          backgroundColor: ["rgba(79, 70, 229, 0.85)", "rgba(148, 163, 184, 0.7)"],
          borderColor: ["#4f46e5", "#94a3b8"],
          borderWidth: 2
        }
      ]
    }),
    [lastWeek, pendingCount]
  );

  const lastUpdatedLabel = lastUpdatedAt
    ? lastUpdatedAt.toLocaleString()
    : "—";

  return (
    <Layout>
      <LoadingOverlay show={isLoading} label="Loading reports…" />
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Reports</h1>
            <p className={styles.subtitle}>
              Quick insights into team performance, owners, and projects.
            </p>
          </div>

          <div className={styles.actions}>
            <span className={styles.meta}>Last updated: {lastUpdatedLabel}</span>
            <button
              className={styles.button}
              onClick={fetchReports}
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className={styles.surface}>
          <div className={styles.statusRow}>
            {isLoading ? (
              <span>Loading reports…</span>
            ) : error ? (
              <span className={styles.error}>{error}</span>
            ) : (
              <span>Overview for the last 7 days and open work.</span>
            )}
          </div>

          <div className={styles.kpis}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Completed (last 7 days)</div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>{lastWeek}</div>
                <div className={styles.kpiHint}>tasks</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Open tasks</div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>{pendingCount}</div>
                <div className={styles.kpiHint}>active</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Total pending days</div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>{pendingDays}</div>
                <div className={styles.kpiHint}>days</div>
              </div>
            </div>

            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Closure rate</div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>{closureRate}%</div>
                <div className={styles.kpiHint}>
                  avg pending: {avgPendingDays || 0}d
                </div>
              </div>
            </div>
          </div>

          <div className={styles.charts}>
            <div className={styles.chartCard}>
              <div className={styles.chartTitleRow}>
                <h3 className={styles.chartTitle}>Tasks closed by team</h3>
                <span className={styles.chartNote}>Top 14 chars shown</span>
              </div>
              <div className={styles.chartBox}>
                {byTeam.length > 0 ? (
                  <Bar data={teamData} options={barBaseOptions} />
                ) : (
                  <p className={styles.empty}>No completed tasks yet.</p>
                )}
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitleRow}>
                <h3 className={styles.chartTitle}>Tasks closed by owner</h3>
                <span className={styles.chartNote}>Hover for exact values</span>
              </div>
              <div className={styles.chartBox}>
                {byOwner.length > 0 ? (
                  <Bar data={ownerData} options={barBaseOptions} />
                ) : (
                  <p className={styles.empty}>No completed tasks yet.</p>
                )}
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitleRow}>
                <h3 className={styles.chartTitle}>Completed vs open</h3>
                <span className={styles.chartNote}>Last 7 days</span>
              </div>
              <div className={styles.chartBox}>
                <Pie data={summaryData} options={pieOptions} />
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartTitleRow}>
                <h3 className={styles.chartTitle}>Tasks closed by project</h3>
                <span className={styles.chartNote}>Scrollable labels</span>
              </div>
              <div className={styles.chartBox}>
                {byProject.length > 0 ? (
                  <Bar data={projectData} options={barBaseOptions} />
                ) : (
                  <p className={styles.empty}>No completed tasks yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
