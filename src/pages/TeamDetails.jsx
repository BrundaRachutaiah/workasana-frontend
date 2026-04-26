import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";
import AddMemberModal from "../components/AddMemberModal";
import { useSearch } from "../context/SearchContext";

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchTerm } = useSearch();

  const [team, setTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchTeam = async () => {
    try {
      const res = await api.get(`/teams/${id}`);
      setTeam(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, [id]);

  if (!team) return <Layout>Loading...</Layout>;

  const term = searchTerm.trim().toLowerCase();
  const visibleMembers = term
    ? (team.members || []).filter((m) =>
        `${m?.name || ""} ${m?.email || ""}`.toLowerCase().includes(term)
      )
    : team.members || [];

  return (
    <Layout>
      {/* BACK */}
      <button style={backBtn} onClick={() => navigate("/teams")}>
        ← Back to Teams
      </button>

      {/* TITLE */}
      <h1 style={title}>{team.name}</h1>

      {/* MEMBERS */}
      <h4 style={section}>MEMBERS</h4>

      <div style={memberList}>
  {visibleMembers.length > 0 ? (
    visibleMembers.map((m) => (
      <div key={m._id} style={memberItem}>
        
        {/* Avatar */}
        <div style={avatar}>
          {m.name?.charAt(0).toUpperCase()}
        </div>

        {/* Name */}
        <span>{m.name}</span>
      </div>
    ))
  ) : (
    <p style={{ color: "#888" }}>
      {term ? "No members match your search." : "No members yet"}
    </p>
  )}
</div>

      {/* ADD BUTTON */}
      <button style={addBtn} onClick={() => setShowModal(true)}>
        + Member
      </button>

      {/* MODAL */}
      {showModal && (
        <AddMemberModal
          teamId={id}
          onClose={() => setShowModal(false)}
          onAdded={fetchTeam}
        />
      )}
    </Layout>
  );
};

export default TeamDetails;

const backBtn = {
  border: "none",
  background: "none",
  color: "#4f46e5",
  cursor: "pointer",
  marginBottom: "10px"
};

const title = {
  fontSize: "22px",
  fontWeight: 600,
  marginBottom: "20px"
};

const section = {
  fontSize: "12px",
  color: "#888",
  marginBottom: "10px"
};

const memberList = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const memberItem = {
  display: "flex",
  alignItems: "center",
  gap: "10px"
};

const avatar = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#fde68a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: 600
};

const addBtn = {
  marginTop: "15px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer"
};
