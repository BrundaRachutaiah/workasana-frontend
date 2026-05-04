import { useState } from "react";
import api, { API_BASE_URL } from "../api/api";

const ProjectModal = ({ onClose, onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    description: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");
    setSubmitting(true);

    try {
      await api.post("/projects", form);
      if (typeof onCreated === "function") onCreated();
      if (typeof onClose === "function") onClose();
    } catch (err) {
      console.error(err);

      const status = err?.response?.status;
      const apiMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create project.";

      setError(
        typeof status === "number"
          ? `${apiMessage}\n\nHTTP ${status}\nAPI: ${API_BASE_URL}`
          : `${apiMessage}\n\nAPI: ${API_BASE_URL}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        
        {/* HEADER */}
        <div style={header}>
          <h2 style={{ fontSize: "16px", fontWeight: 600 }}>
            Create New Project
          </h2>

          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        <div style={divider}></div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          
          <div style={field}>
            <label style={label}>Project Name</label>
            <input
              name="name"
              placeholder="Enter Project Name"
              onChange={handleChange}
              value={form.name}
              required
              style={input}
            />
          </div>

          <div style={field}>
            <label style={label}>Project Description</label>
            <textarea
              name="description"
              placeholder="Enter Project Description"
              onChange={handleChange}
              value={form.description}
              style={{ ...input, height: "80px", resize: "none" }}
            />
          </div>

          {error ? (
            <pre style={errorBox}>{error}</pre>
          ) : null}

          {/* ACTIONS */}
          <div style={actions}>
            <button type="button" onClick={onClose} style={cancelBtn}>
              Cancel
            </button>

            <button
              type="submit"
              style={{
                ...createBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
              disabled={submitting}
            >
              {submitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

/* 🎨 STYLES */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000
};

const modal = {
  width: "420px",
  background: "#fff",
  borderRadius: "10px",
  padding: "20px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const closeBtn = {
  border: "none",
  background: "transparent",
  fontSize: "18px",
  cursor: "pointer",
  color: "#666"
};

const divider = {
  height: "1px",
  background: "#eee",
  margin: "12px 0 16px"
};

const field = {
  marginBottom: "14px",
  display: "flex",
  flexDirection: "column"
};

const label = {
  fontSize: "12px",
  marginBottom: "4px",
  color: "#444"
};

const input = {
  padding: "8px 10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  fontSize: "13px"
};

const actions = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "10px"
};

const errorBox = {
  marginTop: "10px",
  padding: "10px",
  background: "#FEF2F2",
  border: "1px solid #FECACA",
  borderRadius: "8px",
  color: "#991B1B",
  fontSize: "12px",
  whiteSpace: "pre-wrap"
};

const cancelBtn = {
  padding: "6px 12px",
  background: "#6b7280",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};

const createBtn = {
  padding: "6px 12px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
