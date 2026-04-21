import { useNavigate } from "react-router-dom";

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      style={{
        background: "#f9fafb",
        borderRadius: "12px",
        padding: "16px",
        width: "280px",
        border: "1px solid #eee",
        cursor: "pointer"
      }}
    >
      {/* STATUS */}
      <span style={{
        fontSize: "11px",
        background: "#fef3c7",
        color: "#92400e",
        padding: "4px 8px",
        borderRadius: "6px",
        fontWeight: 500
      }}>
        In Progress
      </span>

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