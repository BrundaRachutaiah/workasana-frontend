import { useNavigate } from "react-router-dom";

const getInitials = (member) => {
  if (!member) return "?";
  if (typeof member === "string") return "U";

  const raw = member.name || member.email || "";
  const first = raw.trim().charAt(0);
  return first ? first.toUpperCase() : "U";
};

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  const members = Array.isArray(team?.members) ? team.members : [];
  const visible = members.slice(0, 3);
  const remaining = Math.max(0, members.length - visible.length);

  return (
    <div
      onClick={() => navigate(`/teams/${team._id}`)}
      style={{
        background: "#f9fafb",
        borderRadius: "12px",
        padding: "16px",
        width: "260px",
        border: "1px solid #eee",
        cursor: "pointer"
      }}
    >
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 600,
          marginBottom: "10px"
        }}
      >
        {team.name}
      </h3>

      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {visible.map((m, idx) => (
          <div
            key={m?._id || m?.id || `${team?._id || "team"}-m-${idx}`}
            title={typeof m === "object" ? m.name || m.email || "" : ""}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#fde68a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 600
            }}
          >
            {getInitials(m)}
          </div>
        ))}

        {remaining > 0 && (
          <div
            title={`${remaining} more`}
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "#e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "#374151"
            }}
          >
            +{remaining}
          </div>
        )}

        {members.length === 0 && (
          <span style={{ color: "#9ca3af", fontSize: "12px" }}>
            No members
          </span>
        )}
      </div>
    </div>
  );
};

export default TeamCard;
