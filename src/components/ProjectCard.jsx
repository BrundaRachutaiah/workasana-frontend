import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const deriveStatus = () => {
    if (project?.status) return project.status;
    if (typeof project?.totalTasks === "number") {
      if (project.totalTasks <= 0) return "Not Started";
      if ((project.completedTasks || 0) >= project.totalTasks) return "Completed";
      return "In Progress";
    }
    return "Not Started";
  };

  const status = deriveStatus();

  const statusStyle = {
    fontSize: "11px",
    padding: "4px 8px",
    borderRadius: "6px",
    fontWeight: 500,
    background:
      status === "Completed"
        ? "#dcfce7"
        : status === "Not Started"
          ? "#e5e7eb"
          : "#fef3c7",
    color:
      status === "Completed"
        ? "#166534"
        : status === "Not Started"
          ? "#374151"
          : "#92400e",
  };

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      style={{
        background: "#f9fafb",
        borderRadius: "12px",
        padding: "16px",
        width: "100%",
        maxWidth: "320px",
        flex: "1 1 280px",
        border: "1px solid #eee",
        cursor: "pointer"
      }}
    >
      {/* STATUS */}
      <span style={statusStyle}>{status}</span>

      <h3 style={{
        marginTop: "10px",
        fontSize: "15px",
        fontWeight: 600
      }}>
        {project.name}
      </h3>

      <p style={{
        fontSize: "12px",
        color: "#888",
        marginTop: "6px",
        lineHeight: "1.5"
      }}>
        {project.description || "No description"}
      </p>
    </div>
  );
};

export default ProjectCard;
