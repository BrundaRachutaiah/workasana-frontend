import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";
import TaskForm from "../components/TaskForm";
import { useSearch } from "../context/SearchContext";

const ProjectView = () => {
  const { id } = useParams();
  const { searchTerm } = useSearch();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [sortMode, setSortMode] = useState("Newest First");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const projRes = await api.get(`/projects/${id}`);
      const taskRes = await api.get(`/tasks?project=${id}`);

      setProject(projRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const updateTaskStatus = async (taskId, status) => {
    let previousTask;
    try {
      setUpdatingTaskId(taskId);

      // Optimistic UI update (feels instant)
      setTasks((prev) =>
        prev.map((t) => {
          if (t._id !== taskId) return t;
          previousTask = t;
          const nextHistory = [
            ...(t.statusHistory || []),
            {
              status,
              changedAt: new Date().toISOString(),
              changedBy: { name: "You" },
            },
          ];
          return {
            ...t,
            status,
            statusHistory: nextHistory,
            updatedAt: new Date().toISOString(),
          };
        })
      );

      const res = await api.patch(`/tasks/${taskId}`, { status });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.data : t)));
    } catch (err) {
      console.error(err);
      alert("Failed to update task status");
      if (previousTask) {
        setTasks((prev) => prev.map((t) => (t._id === taskId ? previousTask : t)));
      }
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const getLastStatusChange = (task) => {
    const history = task?.statusHistory || [];
    if (history.length === 0) return null;
    return history.reduce((latest, entry) => {
      const latestTime = new Date(latest?.changedAt || 0).getTime();
      const entryTime = new Date(entry?.changedAt || 0).getTime();
      return entryTime > latestTime ? entry : latest;
    }, history[0]);
  };

  const formatDateTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
  };

  const getUpdatedTimestamp = (task) => {
    const last = getLastStatusChange(task);
    return last?.changedAt || task?.updatedAt || task?.createdAt || null;
  };

  const term = searchTerm.trim().toLowerCase();
  const filteredTasks = tasks
    .filter((t) => (statusFilter ? t.status === statusFilter : true))
    .filter((t) => {
      if (!term) return true;
      const ownerNames = (t.owners || []).map((o) => o?.name || "").join(" ");
      return `${t.name || ""} ${ownerNames}`.toLowerCase().includes(term);
    });

  const priorityWeight = (p) => (p === "High" ? 3 : p === "Medium" ? 2 : 1);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortMode === "Priority Low-High") {
      return priorityWeight(a.priority || "Medium") - priorityWeight(b.priority || "Medium");
    }
    if (sortMode === "Priority High-Low") {
      return priorityWeight(b.priority || "Medium") - priorityWeight(a.priority || "Medium");
    }
    if (sortMode === "Oldest First") {
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    }
    // Default: Newest First
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  return (
    <Layout>
      {/* TITLE */}
      <h1 style={{ fontSize: "20px", fontWeight: 600 }}>
        {project?.name}
      </h1>

      {/* DESCRIPTION */}
      <p style={desc}>
        {project?.description}
      </p>

      {/* TOP CONTROLS */}
      <div style={topControls}>
        {/* SORT BUTTONS */}
        <div style={{ display: "flex", gap: "8px" }}>
          {[
            "Priority Low-High",
            "Priority High-Low",
            "Newest First",
            "Oldest First"
          ].map((s, i) => (
            <button
              key={i}
              style={chipBtn(sortMode === s)}
              onClick={() => setSortMode(s)}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", gap: "10px" }}>
          <select
  style={filterBtn}
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="">All</option>
  <option value="To Do">To Do</option>
  <option value="In Progress">In Progress</option>
  <option value="Blocked">Blocked</option>
  <option value="Completed">Completed</option>
</select>
          <button
  style={newTaskBtn}
  onClick={() => setShowTaskModal(true)}
>
  + New Task
</button>
        </div>
      </div>

      {/* TABLE */}
      <div style={tableContainer}>
        <table style={table}>
          <thead>
            <tr style={thead}>
              <th style={th}>TASKS</th>
              <th style={th}>OWNER</th>
              <th style={th}>PRIORITY</th>
              <th style={th}>DUE ON</th>
              <th style={th}>CREATED</th>
              <th style={th}>UPDATED</th>
              <th style={th}>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr style={row}>
                <td style={{ ...td, color: "#888", textAlign: "center" }} colSpan={7}>
                  Loading tasks...
                </td>
              </tr>
            ) : sortedTasks.length > 0 ? (
              sortedTasks.map((t) => (
                <tr key={t._id} style={row}>
                {/* TASK */}
                <td style={td}>{t.name}</td>

                {/* OWNER */}
                <td style={td}>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {t.owners?.map((o, i) => (
                      <div key={i} style={avatar}>
                        {o.name?.charAt(0)}
                      </div>
                    ))}
                  </div>
                </td>

                {/* PRIORITY */}
                <td style={td}>
                  <span style={priorityBadge(t.priority || "Medium")}>
                    {t.priority || "Medium"}
                  </span>
                </td>

                {/* DATE */}
                <td style={td}>
                  {t.dueDate
                    ? new Date(t.dueDate).toDateString()
                    : "-"}
                </td>

                {/* CREATED */}
                <td style={td}>{t.createdAt ? formatDateTime(t.createdAt) : "-"}</td>

                {/* UPDATED */}
                <td style={td}>
                  {(() => {
                    const ts = getUpdatedTimestamp(t);
                    const text = ts ? formatDateTime(ts) : "-";
                    return text || "-";
                  })()}
                </td>

                {/* STATUS */}
                <td style={td}>
                  {(() => {
                    const last = getLastStatusChange(t);
                    const lastText = last
                      ? `${formatDateTime(last.changedAt)}${last.changedBy?.name ? ` • ${last.changedBy.name}` : ""}`
                      : "";
                    return (
                  <select
                    value={t.status}
                    disabled={updatingTaskId === t._id}
                    onChange={(e) => updateTaskStatus(t._id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    style={statusSelect(t.status)}
                    title={lastText || undefined}
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Completed">Completed</option>
                  </select>
                    );
                  })()}
                  {(() => {
                    const last = getLastStatusChange(t);
                    const text = last ? formatDateTime(last.changedAt) : "";
                    return text ? <div style={statusMeta}>{text}</div> : null;
                  })()}
                </td>
                </tr>
              ))
            ) : (
              <tr style={row}>
                <td style={{ ...td, color: "#888", textAlign: "center" }} colSpan={7}>
                  {term || statusFilter
                    ? "No tasks match your current filters."
                    : "No tasks added for this project"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showTaskModal && (
  <TaskForm
    onClose={() => setShowTaskModal(false)}
    onCreated={fetchData}
    projectId={id}   // 🔥 important
  />
)}
    </Layout>
  );
};

export default ProjectView;

/* 🎨 STYLES */

const desc = {
  fontSize: "13px",
  color: "#6b7280",
  marginBottom: "15px",
  maxWidth: "900px"
};

const topControls = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px"
};

const chipBtn = (active) => ({
  padding: "5px 10px",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  background: active ? "#eef2ff" : "#fff",
  color: active ? "#4f46e5" : "#111",
  fontSize: "12px",
  cursor: "pointer"
});

const filterBtn = {
  padding: "6px 10px",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  background: "#fff",
  fontSize: "12px",
  cursor: "pointer"
};

const newTaskBtn = {
  padding: "6px 12px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer"
};

const tableContainer = {
  background: "#fff",
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  overflow: "hidden"
};

const table = {
  width: "100%",
  borderCollapse: "collapse"
};

const thead = {
  background: "#f3f4f6",
  textAlign: "left"
};

const th = {
  padding: "10px",
  fontSize: "12px",
  color: "#6b7280"
};

const td = {
  padding: "10px",
  fontSize: "13px"
};

const row = {
  borderBottom: "1px solid #f1f5f9"
};

const avatar = {
  width: "26px",
  height: "26px",
  borderRadius: "50%",
  background: "#fde68a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "11px",
  fontWeight: 600
};

const priorityBadge = (p) => ({
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  background:
    p === "High" ? "#fee2e2" :
    p === "Low" ? "#e0f2fe" :
    "#ede9fe",
  color:
    p === "High" ? "#991b1b" :
    p === "Low" ? "#0369a1" :
    "#5b21b6"
});

const statusBadge = (status) => ({
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  background:
    status === "Completed"
      ? "#dcfce7"
      : status === "Blocked"
      ? "#fee2e2"
      : status === "In Progress"
      ? "#fef3c7"
      : "#e5e7eb",
  color:
    status === "Completed"
      ? "#166534"
      : status === "Blocked"
      ? "#991b1b"
      : status === "In Progress"
      ? "#92400e"
      : "#374151"
});

const statusSelect = (status) => ({
  ...statusBadge(status),
  border: "1px solid #e5e7eb",
  cursor: "pointer"
});

const statusMeta = {
  marginTop: "4px",
  fontSize: "11px",
  color: "#6b7280",
  whiteSpace: "nowrap",
};
