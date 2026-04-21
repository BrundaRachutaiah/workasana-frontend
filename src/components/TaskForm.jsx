import { useEffect, useState } from "react";
import api from "../api/api";

const TaskForm = ({ onClose, onCreated, projectId }) => {
  const [form, setForm] = useState({
    name: "",
    project: projectId || "",
    team: "",
    owners: [],
    tags: "",
    dueDate: "",
    timeToComplete: ""
  });

  const [projects, setProjects] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  // ✅ Auto set projectId
  useEffect(() => {
    if (projectId) {
      setForm(prev => ({ ...prev, project: projectId }));
    }
  }, [projectId]);

  // ✅ Fetch dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const proj = await api.get("/projects");
        const team = await api.get("/teams");
        const users = await api.get("/users"); // ⚠️ make sure backend exists

        setProjects(proj.data);
        setTeams(team.data);
        setUsers(users.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.owners.length === 0) {
  return alert("Please select at least one owner");
}

    try {
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(",").map(t => t.trim())
          : []
      };

      await api.post("/tasks", payload);

setForm({
  name: "",
  project: projectId || "",
  team: "",
  owners: [],
  tags: "",
  dueDate: "",
  timeToComplete: ""
});

onCreated();
onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>

        {/* HEADER */}
        <div style={header}>
          <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
            Create New Task{" "}
            {projectId &&
              `| ${
                projects.find(p => p._id === projectId)?.name || ""
              }`}
          </h3>
          <span style={closeBtn} onClick={onClose}>×</span>
        </div>

        <div style={divider}></div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={formStyle}>

          {/* PROJECT */}
          <div style={field}>
            <label style={label}>Select Project</label>
            <select
              name="project"
              value={form.project}
              onChange={handleChange}
              disabled={!!projectId}
              style={input}
              required
            >
              {projectId ? (
                <option value={projectId}>
                  {projects.find(p => p._id === projectId)?.name || "Selected Project"}
                </option>
              ) : (
                <>
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* TASK NAME */}
          <div style={field}>
            <label style={label}>Task Name</label>
            <input
              name="name"
              placeholder="Enter Task Name"
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* TEAM */}
          <div style={field}>
            <label style={label}>Select Team</label>
            <select name="team" onChange={handleChange} style={input} required>
              <option value="">Select Team</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>

          {/* OWNERS */}
<div style={field}>
  <label style={label}>Select Owners</label>

  <select
    multiple
    size={4}
    value={form.owners}
    onChange={(e) => {
      const ids = [...e.target.selectedOptions].map(o => o.value);
      setForm({ ...form, owners: ids });
    }}
    style={input}
  >
    {users.map(u => (
      <option key={u._id} value={u._id}>
        {u.name} ({u.email})
      </option>
    ))}
  </select>
</div>

          {/* DATE + TIME */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Select Due date</label>
              <input
                type="date"
                name="dueDate"
                onChange={handleChange}
                style={input}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label style={label}>Estimated Time</label>
              <input
                name="timeToComplete"
                type="number"
                placeholder="Enter Time in Days"
                onChange={handleChange}
                style={input}
              />
            </div>
          </div>

          {/* BUTTONS */}
          <div style={buttonRow}>
            <button type="button" onClick={onClose} style={cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={createBtn}>
              Create
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default TaskForm;

/* 🎨 STYLES */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
};

const modalStyle = {
  width: "420px",
  background: "#fff",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px 20px"
};

const closeBtn = {
  cursor: "pointer",
  fontSize: "18px",
  color: "#666"
};

const divider = {
  height: "1px",
  background: "#eee"
};

const formStyle = {
  padding: "15px 20px",
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: "5px"
};

const label = {
  fontSize: "12px",
  color: "#555"
};

const input = {
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "8px",
  fontSize: "13px"
};

const buttonRow = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "10px"
};

const cancelBtn = {
  padding: "7px 12px",
  borderRadius: "6px",
  border: "none",
  background: "#e5e7eb",
  cursor: "pointer"
};

const createBtn = {
  padding: "7px 14px",
  borderRadius: "6px",
  border: "none",
  background: "#4f46e5",
  color: "#fff",
  cursor: "pointer"
};