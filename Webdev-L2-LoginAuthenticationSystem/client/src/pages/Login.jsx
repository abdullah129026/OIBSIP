import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import SocialButtons from "../components/SocialButtons";
import { EyeIcon, EyeSlashIcon, LockIcon, LoginIcon, UserIcon } from "../components/icons";
import { useAuth } from "../context/AuthContext";
import "../styles/card.css";
import "../styles/form.css";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.identifier || !form.password) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/login", {
        identifier: form.identifier.trim(),
        password: form.password,
      });
      login(data.token, data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("[Login/submit]", err.message);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-layout">
        <div className="card">
          <div className="card-icon">
            <LoginIcon width="22" height="22" />
          </div>
          <h1 className="card-title">Sign in with email</h1>
          <p className="card-subtitle">Welcome back. Enter your details to continue.</p>

          <form className="card-body form" onSubmit={handleSubmit} noValidate>
            {error && <p className="form-error form-error--banner">{error}</p>}

            <div className="field">
              <span className="field-icon">
                <UserIcon />
              </span>
              <input
                className="input"
                type="text"
                name="identifier"
                placeholder="Email or username"
                aria-label="Email or username"
                value={form.identifier}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <span className="field-icon">
                <LockIcon />
              </span>
              <input
                className="input has-toggle"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                aria-label="Password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="input-toggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
              </button>
            </div>

            <a className="forgot-link" href="#">
              Forgot password?
            </a>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Signing in…" : "Get Started"}
            </button>
          </form>

          <div className="divider">Or sign in with</div>
          <SocialButtons />

          <p className="card-footer">
            Don&apos;t have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </div>
    </>
  );
}
