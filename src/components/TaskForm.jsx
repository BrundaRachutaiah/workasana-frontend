import { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../api/api";
import { useAuth } from "../context/AuthContext";

const TaskForm = ({ onClose, onCreated, projectId }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    project: projectId || "",
    team: "",
    priority: "Medium",
    status: "To Do",
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

  // Preselect current user as owner (so task creation works out-of-the-box)
  useEffect(() => {
    const myId = user?._id;
    if (!myId) return;
    setForm((prev) => {
      if (prev.owners.length > 0) return prev;
      return { ...prev, owners: [myId] };
    });
  }, [user?._id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.owners.length === 0) {
      setError("Please select at least one owner.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        ...form,
        tags: form.tags
          ? form.tags.split(",").map(t => t.trim())
          : []
      };

      if (!payload.dueDate) delete payload.dueDate;
      if (payload.timeToComplete === "" || payload.timeToComplete === null) {
        delete payload.timeToComplete;
      }

      await api.post("/tasks", payload);

      setForm({
        name: "",
        project: projectId || "",
        team: "",
        priority: "Medium",
        status: "To Do",
        owners: user?._id ? [user._id] : [],
        tags: "",
        dueDate: "",
        timeToComplete: ""
      });

      await onCreated?.();
      onClose?.();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create task";
      const details = err.response?.data?.error;
      const status = err.response?.status;
      const apiMessage = details ? `${message}: ${details}` : message;
      alert(
        status
          ? `${apiMessage}\n\nHTTP ${status}\nAPI: ${API_BASE_URL}`
          : `${apiMessage}\n\nAPI: ${API_BASE_URL}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleOwner = (ownerId) => {
    setForm((prev) => {
      const current = prev.owners || [];
      const next = current.includes(ownerId)
        ? current.filter((id) => id !== ownerId)
        : [...current, ownerId];
      return { ...prev, owners: next };
    });
  };

  const hasName = form.name.trim().length > 0;
  const hasProjects = Boolean(projectId) || projects.length > 0;
  const hasTeams = teams.length > 0;
  const hasUsers = users.length > 0 || Boolean(user?._id);
  const ownerOptions = users.length > 0 ? users : user?._id ? [user] : [];
  const canSubmit =
    hasProjects &&
    hasTeams &&
    hasUsers &&
    Boolean(form.project) &&
    Boolean(form.team) &&
    hasName &&
    form.owners.length > 0 &&
    !isSubmitting;

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
          {error ? (
            <div style={errorBox}>
              {error}
            </div>
          ) : null}

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
            {!hasProjects ? (
              <span style={helperText}>No projects found. Create a project first.</span>
            ) : null}
          </div>

          {/* TASK NAME */}
          <div style={field}>
            <label style={label}>Task Name</label>
            <input
              name="name"
              placeholder="Enter Task Name"
              value={form.name}
              onChange={handleChange}
              style={input}
              required
            />
          </div>

          {/* TEAM */}
          <div style={field}>
            <label style={label}>Select Team</label>
            <select name="team" value={form.team} onChange={handleChange} style={input} required>
              <option value="">Select Team</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
            {!hasTeams ? (
              <span style={helperText}>No teams found. Create a team first.</span>
            ) : null}
          </div>

          {/* PRIORITY */}
          <div style={field}>
            <label style={label}>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} style={input}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* STATUS */}
          <div style={field}>
            <label style={label}>Status</label>
            <select name="status" value={form.status} onChange={handleChange} style={input}>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Blocked">Blocked</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* OWNERS */}
          <div style={field}>
            <label style={label}>Select Owners</label>
            {!hasUsers ? (
              <span style={helperText}>No users found.</span>
            ) : (
              <div style={ownersList}>
                {ownerOptions.map((u) => {
                  const checked = form.owners.includes(u._id);
                  return (
                    <label key={u._id} style={ownerItem}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOwner(u._id)}
                      />
                      <span>
                        {u.name} <span style={{ color: "#888" }}>({u.email})</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* TAGS */}
          <div style={field}>
            <label style={label}>Tags (comma separated)</label>
            <input
              name="tags"
              placeholder="eg: frontend, bug, urgent"
              value={form.tags}
              onChange={handleChange}
              style={input}
            />
          </div>

          {/* DATE + TIME */}
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label style={label}>Select Due date</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
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
                value={form.timeToComplete}
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
            <button type="submit" style={createBtn} disabled={!canSubmit}>
              {isSubmitting ? "Creating..." : "Create"}
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

const helperText = {
  fontSize: "11px",
  color: "#888"
};

const ownersList = {
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  maxHeight: "130px",
  overflowY: "auto"
};

const ownerItem = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  fontSize: "13px"
};

const errorBox = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#991b1b",
  padding: "8px 10px",
  borderRadius: "8px",
  fontSize: "12px"
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
