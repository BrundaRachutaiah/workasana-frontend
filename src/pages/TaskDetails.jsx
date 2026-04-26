import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Fetch Task
  const fetchTask = async () => {
    try {
      setError("");
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load task.");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  // 🔹 Mark complete
  const markComplete = async () => {
    try {
      setIsUpdating(true);
      await api.patch(`/tasks/${id}`, { status: "Completed" });
      fetchTask();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      setIsUpdating(true);
      await api.patch(`/tasks/${id}`, { status });
      fetchTask();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // 🔹 Calculate remaining days
  const getRemainingDays = () => {
    if (!task?.dueDate) return "-";

    const today = new Date();
    const due = new Date(task.dueDate);

    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    return diff > 0 ? `${diff} days` : "Overdue";
  };

  if (!task) return <Layout>{error || "Loading..."}</Layout>;

  const history = [...(task.statusHistory || [])].sort(
    (a, b) => new Date(b.changedAt || 0) - new Date(a.changedAt || 0)
  );
  const lastChange = history[0];
  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  return (
    <Layout>
      {/* TITLE */}
      <h1 style={{ fontSize: "20px", fontWeight: 600 }}>
        Task: {task.name}
      </h1>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(`/projects/${task.project?._id}`)}
        style={backBtn}
      >
        ← Back to Project
      </button>

      {/* CARD */}
      <div style={card}>
        <h3 style={sectionTitle}>Task Details</h3>

        <Row label="Project" value={task.project?.name} />
        <Row label="Team" value={task.team?.name} />
        <Row label="Priority" value={task.priority || "Medium"} />
        <Row
          label="Owners"
          value={task.owners?.map(o => o.name).join(", ") || "-"}
        />
        <Row label="Tags" value={task.tags?.join(", ") || "-"} />
        <Row
          label="Due Date"
          value={
            task.dueDate
              ? new Date(task.dueDate).toDateString()
              : "-"
          }
        />

        <hr style={{ margin: "15px 0" }} />

        <Row
          label="Status"
          value={
            <select
              value={task.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={isUpdating}
              style={statusSelect}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
            </select>
          }
        />
        <Row
          label="Last Status Change"
          value={
            lastChange
              ? `${formatDateTime(lastChange.changedAt)}${
                  lastChange.changedBy?.name ? ` by ${lastChange.changedBy.name}` : ""
                }`
              : "-"
          }
        />
        <Row label="Time Remaining" value={getRemainingDays()} />

        {history.length > 0 ? (
          <div style={historyBox}>
            <div style={historyTitle}>Status History</div>
            <div style={historyList}>
              {history.slice(0, 8).map((h, i) => (
                <div key={i} style={historyRow}>
                  <span style={historyStatus}>{h.status}</span>
                  <span style={historyMeta}>
                    {formatDateTime(h.changedAt)}
                    {h.changedBy?.name ? ` • ${h.changedBy.name}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* BUTTON */}
        {task.status !== "Completed" && (
          <button onClick={markComplete} style={completeBtn} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Mark as Complete"}
          </button>
        )}
      </div>
    </Layout>
  );
};

export default TaskDetails;

/* 🔹 SMALL COMPONENTS */

const Row = ({ label, value }) => (
  <div style={row}>
    <span>{label}:</span>
    <b>{value}</b>
  </div>
);

/* 🔹 STYLES */

const card = {
  marginTop: "20px",
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  maxWidth: "600px"
};

const sectionTitle = {
  fontSize: "14px",
  marginBottom: "10px",
  fontWeight: 600
};

const row = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  fontSize: "14px"
};

const backBtn = {
  marginTop: "10px",
  padding: "6px 10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  background: "#fff",
  cursor: "pointer"
};

const completeBtn = {
  marginTop: "15px",
  padding: "8px 14px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const statusSelect = {
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "4px 8px",
  fontSize: "12px",
  background: "#fff"
};

const historyBox = {
  marginTop: "10px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  padding: "10px",
  background: "#f9fafb",
};

const historyTitle = {
  fontSize: "12px",
  fontWeight: 600,
  marginBottom: "8px",
  color: "#111",
};

const historyList = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const historyRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  fontSize: "12px",
};

const historyStatus = {
  fontWeight: 600,
  color: "#111",
};

const historyMeta = {
  color: "#6b7280",
  textAlign: "right",
};
