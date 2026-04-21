import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);

  // 🔹 Fetch Task
  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  // 🔹 Mark complete
  const markComplete = async () => {
    try {
      await api.patch(`/tasks/${id}`, { status: "Completed" });
      fetchTask();
    } catch (err) {
      console.error(err);
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

  if (!task) return <Layout>Loading...</Layout>;

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

        <Row label="Status" value={<Status status={task.status} />} />
        <Row label="Time Remaining" value={getRemainingDays()} />

        {/* BUTTON */}
        {task.status !== "Completed" && (
          <button onClick={markComplete} style={completeBtn}>
            Mark as Complete
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

const Status = ({ status }) => (
  <span style={statusStyle(status)}>
    {status}
  </span>
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

const statusStyle = (status) => ({
  padding: "3px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  background:
    status === "Completed"
      ? "#dcfce7"
      : status === "In Progress"
      ? "#fef3c7"
      : "#eee",
  color:
    status === "Completed"
      ? "#166534"
      : "#92400e"
});