import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";

import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 600 }}>
          Projects
        </h1>

        <button
          onClick={() => setShowModal(true)}
          style={{
            padding: "6px 12px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          + New Project
        </button>
      </div>

      {/* Project List */}
      <div style={{
        display: "flex",
        gap: "12px",
        marginTop: "20px",
        flexWrap: "wrap"
      }}>
        {projects.length > 0 ? (
          projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))
        ) : (
          <p style={{ color: "#888" }}>No projects yet.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProjectModal
          onClose={() => setShowModal(false)}
          onCreated={fetchProjects}
        />
      )}
    </Layout>
  );
};

export default Projects;