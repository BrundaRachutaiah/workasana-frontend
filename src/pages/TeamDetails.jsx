import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../api/api";
import AddMemberModal from "../components/AddMemberModal";
import { useSearch } from "../context/SearchContext";
import LoadingOverlay from "../components/LoadingOverlay";

const getInitials = (member) => {
  if (!member) return "?";
  if (typeof member === "string") return "U";

  const raw = member.name || member.email || "";
  const first = raw.trim().charAt(0);
  return first ? first.toUpperCase() : "U";
};

const getDisplayName = (member) => {
  if (!member) return "Unknown user";
  if (typeof member === "string") return "Unknown user";
  return member.name || member.email || "Unknown user";
};

const TeamDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { searchTerm } = useSearch();

  const [team, setTeam] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/teams/${id}`);
      setTeam(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!team) {
    return (
      <Layout>
        <LoadingOverlay show={isLoading} label="Loading team…" />
        <div style={{ color: "#64748b" }}>Loading…</div>
      </Layout>
    );
  }

  const term = searchTerm.trim().toLowerCase();
  const members = Array.isArray(team.members) ? team.members : [];
  const visibleMembers = term
    ? members.filter((m) =>
        `${m?.name || ""} ${m?.email || ""}`.toLowerCase().includes(term)
      )
    : members;

  return (
    <Layout>
      <LoadingOverlay show={isLoading} label="Loading team…" />
      <button style={backBtn} onClick={() => navigate("/teams")}>
        ← Back to Teams
      </button>

      <h1 style={title}>{team.name}</h1>

      <h4 style={section}>MEMBERS</h4>

      <div style={memberList}>
        {visibleMembers.length > 0 ? (
          visibleMembers.map((m, idx) => (
            <div key={m?._id || m?.id || `m-${idx}`} style={memberItem}>
              <div style={avatar} title={m?.email || ""}>
                {getInitials(m)}
              </div>
              <span>{getDisplayName(m)}</span>
            </div>
          ))
        ) : (
          <p style={{ color: "#888" }}>
            {term ? "No members match your search." : "No members yet"}
          </p>
        )}
      </div>

      <button style={addBtn} onClick={() => setShowModal(true)}>
        + Member
      </button>

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
