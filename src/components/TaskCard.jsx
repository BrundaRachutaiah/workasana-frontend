import { useNavigate } from "react-router-dom";

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  const isCompleted = task.status === "Completed";

  return (
    <div
      onClick={() => navigate(`/tasks/${task._id}`)}
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
        background: isCompleted ? "#dcfce7" : "#fef3c7",
        color: isCompleted ? "#166534" : "#92400e",
        padding: "4px 8px",
        borderRadius: "6px",
        fontWeight: 500
      }}>
        {task.status}
      </span>

      <h4 style={{
        marginTop: "10px",
        fontSize: "14px",
        fontWeight: 600
      }}>
        {task.name}
      </h4>

      {/* Due date */}
      {task.dueDate && (
        <p style={{
          fontSize: "12px",
          color: "#888",
          marginTop: "6px"
        }}>
          Due on: {new Date(task.dueDate).toDateString()}
        </p>
      )}

      {/* Owners */}
      <div style={{ marginTop: "10px", display: "flex", gap: "6px" }}>
        {task.owners?.slice(0, 3).map((o, i) => (
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
            {o.name?.charAt(0)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;