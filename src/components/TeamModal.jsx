import { useState, useEffect } from "react";
import api from "../api/api";

const TeamModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!name.trim()) {
  return alert("Team name is required");
}

if (selectedUsers.length === 0) {
  return alert("Please select at least one member");
}

  try {
    await api.post("/teams", {
      name,
      members: selectedUsers   // ✅ correct
    });

    onCreated();
    onClose();
  } catch (err) {
    alert(err.response?.data?.message || "Failed to create team");
  }
};

  return (
    <div style={overlay}>
      <div style={modal}>

        {/* HEADER */}
        <div style={header}>
          <h3 style={title}>Create New Team</h3>
          <span style={close} onClick={onClose}>×</span>
        </div>

        <div style={divider}></div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={form}>

          {/* TEAM NAME */}
          <div style={field}>
            <label style={label}>Team Name</label>
            <input
              style={input}
              placeholder="Enter Team Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* MEMBERS */}
          <div style={field}>
            <label style={label}>Add Members</label>

            <select
  multiple
  size={4}
  value={selectedUsers}
  onChange={(e) => {
    const ids = [...e.target.selectedOptions].map(o => o.value);
    setSelectedUsers(ids);
  }}
  style={input}
>
  {users.map((u) => (
    <option key={u._id} value={u._id}>
      {u.name} ({u.email})
    </option>
  ))}
</select>
          </div>

          {/* BUTTONS */}
          <div style={buttons}>
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

export default TeamModal;

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modal = {
  width: "420px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  overflow: "hidden"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 18px"
};

const title = {
  fontSize: "15px",
  fontWeight: 600
};

const close = {
  cursor: "pointer",
  fontSize: "16px",
  color: "#777"
};

const divider = {
  height: "1px",
  background: "#eee"
};

const form = {
  padding: "16px 18px",
  display: "flex",
  flexDirection: "column",
  gap: "14px"
};

const field = {
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const label = {
  fontSize: "12px",
  color: "#555"
};

const input = {
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "8px 10px",
  fontSize: "13px",
  outline: "none"
};

const buttons = {
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px",
  marginTop: "10px"
};

const cancelBtn = {
  background: "#e5e7eb",
  border: "none",
  padding: "7px 12px",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer"
};

const createBtn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "7px 14px",
  borderRadius: "6px",
  fontSize: "13px",
  cursor: "pointer"
};