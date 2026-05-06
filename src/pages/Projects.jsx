import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api/api";
import { useSearch } from "../context/SearchContext";

import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import LoadingOverlay from "../components/LoadingOverlay";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { searchTerm } = useSearch();

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const term = searchTerm.trim().toLowerCase();
  const visibleProjects = term
    ? projects.filter((p) =>
        `${p.name || ""} ${p.description || ""} ${p.status || ""}`
          .toLowerCase()
          .includes(term)
      )
    : projects;

  return (
    <Layout>
      <LoadingOverlay show={isLoading} label="Loading projects…" />
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
        {visibleProjects.length > 0 ? (
          visibleProjects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))
        ) : (
          <p style={{ color: "#888" }}>
            {term ? "No projects match your search." : "No projects yet."}
          </p>
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
