import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import TeamModal from "../components/TeamModal";
import TeamCard from "../components/TeamCard";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <Layout>
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>Teams</h1>

        <button style={newBtn} onClick={() => setShowModal(true)}>
          + New Team
        </button>
      </div>

      <div style={grid}>
        {teams.map(team => (
          <TeamCard key={team._id} team={team} />
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <TeamModal
          onClose={() => setShowModal(false)}
          onCreated={fetchTeams}
        />
      )}
    </Layout>
  );
};

export default Teams;

const header = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const title = {
  fontSize: "20px",
  fontWeight: 600
};

const newBtn = {
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer"
};

const grid = {
  display: "flex",
  gap: "20px",
  marginTop: "20px",
  flexWrap: "wrap"
};

const card = {
  background: "#f9fafb",
  padding: "15px",
  borderRadius: "10px",
  width: "250px",
  border: "1px solid #eee"
};

const teamName = {
  fontSize: "14px",
  fontWeight: 600,
  marginBottom: "10px"
};

const avatars = {
  display: "flex",
  gap: "5px"
};

const avatar = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: "#e0e7ff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px"
};