import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Auth.module.css";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>workasana</div>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.subtitle}>Start managing tasks with your team.</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
  <label>Password</label>

  <div className={styles.passwordWrapper}>
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className={styles.passwordInput}
    />

    <span
      className={styles.eyeIcon}
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "🙈" : "👁️"}
    </span>
  </div>
</div>
          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className={styles.link}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;