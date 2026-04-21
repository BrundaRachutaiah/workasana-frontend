import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";
import TaskForm from "../components/TaskForm";

const ProjectView = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchData = async () => {
    try {
      const projRes = await api.get(`/projects/${id}`);
      const taskRes = await api.get(`/tasks?project=${id}`);

      setProject(projRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const filteredTasks = statusFilter
  ? tasks.filter(t => t.status === statusFilter)
  : tasks;

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
            <button key={i} style={chipBtn}>{s}</button>
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
              <th style={th}>STATUS</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((t) => (
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
                  <span style={priorityBadge("Medium")}>
                    Medium
                  </span>
                </td>

                {/* DATE */}
                <td style={td}>
                  {t.dueDate
                    ? new Date(t.dueDate).toDateString()
                    : "-"}
                </td>

                {/* STATUS */}
                <td style={td}>
                  <span style={statusBadge(t.status)}>
                    {t.status}
                  </span>
                </td>
              </tr>
            ))}
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

const chipBtn = {
  padding: "5px 10px",
  border: "1px solid #e5e7eb",
  borderRadius: "20px",
  background: "#fff",
  fontSize: "12px",
  cursor: "pointer"
};

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
    status === "Completed" ? "#dcfce7" : "#fef3c7",
  color:
    status === "Completed" ? "#166534" : "#92400e"
});