import { useEffect, useState } from "react";
import api from "../api/api";

const AddMemberModal = ({ teamId, onClose, onAdded }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  // ✅ Fetch users
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

    try {
      await api.patch(`/teams/${teamId}/add-member`, {
        userId: selectedUser
      });

      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        
        {/* HEADER */}
        <div style={header}>
          <h3>Add New Member</h3>
          <span style={close} onClick={onClose}>×</span>
        </div>

        <div style={divider}></div>

        {/* FORM */}
        <form onSubmit={handleSubmit} style={form}>
          <label>Select User</label>

          <select
            style={input}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Select User</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>

          <div style={buttons}>
            <button type="button" onClick={onClose} style={cancelBtn}>
              Cancel
            </button>
            <button type="submit" style={addBtn}>
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modal = {
  width: "400px",
  background: "#fff",
  borderRadius: "10px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  overflow: "hidden"
};

const header = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px"
};

const close = {
  cursor: "pointer"
};

const divider = {
  height: "1px",
  background: "#eee"
};

const form = {
  padding: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const input = {
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "8px"
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
  padding: "6px 12px",
  borderRadius: "6px"
};

const addBtn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px"
};