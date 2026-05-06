import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import TeamModal from "../components/TeamModal";
import TeamCard from "../components/TeamCard";
import { useSearch } from "../context/SearchContext";
import LoadingOverlay from "../components/LoadingOverlay";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { searchTerm } = useSearch();

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const term = searchTerm.trim().toLowerCase();
  const visibleTeams = term
    ? teams.filter((t) => {
        const memberNames = (t.members || []).map((m) => m?.name || "").join(" ");
        return `${t.name || ""} ${t.description || ""} ${memberNames}`
          .toLowerCase()
          .includes(term);
      })
    : teams;

  return (
    <Layout>
      <LoadingOverlay show={isLoading} label="Loading teams…" />
      {/* HEADER */}
      <div style={header}>
        <h1 style={title}>Teams</h1>

        <button style={newBtn} onClick={() => setShowModal(true)}>
          + New Team
        </button>
      </div>

      <div style={grid}>
        {visibleTeams.length > 0 ? (
          visibleTeams.map((team) => (
            <TeamCard key={team._id} team={team} />
          ))
        ) : (
          <p style={{ color: "#888" }}>
            {term ? "No teams match your search." : "No teams yet."}
          </p>
        )}
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
