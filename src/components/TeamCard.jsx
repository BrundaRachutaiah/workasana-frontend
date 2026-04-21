import { useNavigate } from "react-router-dom";

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/teams/${team._id}`)}  // ✅ navigation
      style={{
        background: "#f9fafb",
        borderRadius: "12px",
        padding: "16px",
        width: "260px",
        border: "1px solid #eee",
        cursor: "pointer"
      }}
    >
      <h3 style={{
        fontSize: "15px",
        fontWeight: 600,
        marginBottom: "10px"
      }}>
        {team.name}
      </h3>

      {/* Dummy avatars (UI like design) */}
      <div style={{ display: "flex", gap: "6px" }}>
        {[1,2,3].map((i) => (
          <div key={i} style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: "#fde68a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 600
          }}>
            U
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCard;