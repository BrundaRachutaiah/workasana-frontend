import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import api from "../api/api";

import ProjectCard from "../components/ProjectCard";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm"; // ✅ ADD THIS
import ProjectModal from "../components/ProjectModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { searchTerm } = useSearch();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false); // ✅ modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectStatusFilter, setProjectStatusFilter] = useState("");
  const [showProjectFilter, setShowProjectFilter] = useState(false);

  // Fetch data function (reusable)
  const fetchData = async () => {
    try {
      const projRes = await api.get("/projects");
      const taskUrl = user?._id ? `/tasks?owner=${user._id}` : "/tasks";
      const taskRes = await api.get(taskUrl);

      setProjects(projRes.data);
      setTasks(taskRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial load
  useEffect(() => {
    if (!user?._id) return;
    fetchData();
  }, [user?._id]);

  const term = searchTerm.trim().toLowerCase();
  const projectsAfterStatus = projectStatusFilter
    ? projects.filter((p) => p.status === projectStatusFilter)
    : projects;

  const visibleProjects = term
    ? projectsAfterStatus.filter((p) =>
        `${p.name || ""} ${p.description || ""} ${p.status || ""}`
          .toLowerCase()
          .includes(term)
      )
    : projectsAfterStatus;

  const visibleTasks = term
    ? tasks.filter((t) =>
        [
          t.name || "",
          t.status || "",
          t.project?.name || "",
          t.team?.name || "",
          (t.owners || []).map((o) => o?.name || "").join(" "),
          (t.tags || []).join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(term)
      )
    : tasks;

  return (
    <Layout>
      {/* Header */}
      <h1 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "5px" }}>
        Welcome back, {user?.name} 👋
      </h1>
      <p style={{ color: "#888", fontSize: "14px", marginBottom: "20px" }}>
        Here’s what’s happening with your projects today.
      </p>

      {/* Projects Section */}
      <div style={{ marginBottom: "30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
  <h2 style={{ fontSize: "16px", fontWeight: 600 }}>Projects</h2>

  <button onClick={() => setShowProjectFilter((v) => !v)} style={{
    padding: "4px 10px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#fff",
    fontSize: "12px",
    cursor: "pointer"
  }}>
    {projectStatusFilter ? `Filter: ${projectStatusFilter}` : "Filter"}
  </button>

  {showProjectFilter ? (
    <div style={filterMenu}>
      {["", "Not Started", "In Progress", "Completed"].map((status) => (
        <button
          key={status || "all"}
          type="button"
          onClick={() => {
            setProjectStatusFilter(status);
            setShowProjectFilter(false);
          }}
          style={filterOption(projectStatusFilter === status)}
        >
          {status || "All"}
        </button>
      ))}
    </div>
  ) : null}
</div>

          {/* (Project modal will be added later) */}
          <button
  onClick={() => setShowProjectModal(true)}
  style={{
    padding: "6px 12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  }}
>
  + New Project
</button>
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "12px", flexWrap: "wrap" }}>
          {visibleProjects.length > 0 ? (
            visibleProjects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))
          ) : (
            <p style={{ color: "#888", fontSize: "13px" }}>
              {term ? "No projects match your search." : "No projects yet."}
            </p>
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 600 }}>My Tasks</h2>

          {/* ✅ OPEN MODAL */}
          <button
            onClick={() => setShowTaskModal(true)}
            style={{
              padding: "6px 12px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + New Task
          </button>
        </div>

        <div style={{
  display: "flex",
  gap: "12px",
  marginTop: "12px",
  flexWrap: "wrap"
}}>
          {visibleTasks.length > 0 ? (
            visibleTasks.map((t) => (
              <TaskCard key={t._id} task={t} />
            ))
          ) : (
            <p style={{ color: "#888", fontSize: "13px" }}>
              {term ? "No tasks match your search." : "No tasks yet."}
            </p>
          )}
        </div>
      </div>

      {/* ✅ TASK MODAL */}
      {showTaskModal && (
        <TaskForm
          onClose={() => setShowTaskModal(false)}
          onCreated={fetchData} // 🔥 refresh without reload
        />
      )}

      {/* ✅ PROJECT MODAL (MISSING BEFORE) */}
{showProjectModal && (
  <ProjectModal
    onClose={() => setShowProjectModal(false)}
    onCreated={fetchData}
  />
)}
    </Layout>
  );
};

export default Dashboard;

const filterMenu = {
  position: "absolute",
  top: "32px",
  left: "70px",
  minWidth: "170px",
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  padding: "6px",
  zIndex: 20,
};

const filterOption = (active) => ({
  width: "100%",
  textAlign: "left",
  padding: "8px 10px",
  border: "none",
  borderRadius: "6px",
  background: active ? "#EEF2FF" : "transparent",
  color: active ? "#3730A3" : "#111827",
  cursor: "pointer",
  fontSize: "12px",
});
