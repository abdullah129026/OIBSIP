import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import Navbar from "../components/Navbar";
import {
  EyeIcon,
  EyeSlashIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  UserPlusIcon,
} from "../components/icons";
import "../styles/card.css";
import "../styles/form.css";

const PASSWORD_RULE = /^(?=.*\d).{8,}$/;

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.username || !form.email || !form.password || !form.confirm) {
      return "All fields are required.";
    }
    if (form.username.trim().length < 3) {
      return "Full name must be at least 3 characters.";
    }
    if (!PASSWORD_RULE.test(form.password)) {
      return "Password must be at least 8 characters and include a number.";
    }
    if (form.password !== form.confirm) {
      return "Passwords do not match.";
    }
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      await api.post("/auth/register", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("[Register/submit]", err.message);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
            <UserPlusIcon width="22" height="22" />
          </div>
          <h1 className="card-title">Create your account</h1>
          <p className="card-subtitle">Sign up to get started with Ebolt.</p>

          <form className="card-body form" onSubmit={handleSubmit} noValidate>
            {error && <p className="form-error form-error--banner">{error}</p>}

            <div className="field">
              <span className="field-icon">
                <UserIcon />
              </span>
              <input
                className="input"
                type="text"
                name="username"
                placeholder="Full name"
                aria-label="Full name"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <span className="field-icon">
                <MailIcon />
              </span>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="Email"
                aria-label="Email"
                value={form.email}
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

            <div className="field">
              <span className="field-icon">
                <LockIcon />
              </span>
              <input
                className="input has-toggle"
                type={showPassword ? "text" : "password"}
                name="confirm"
                placeholder="Confirm password"
                aria-label="Confirm password"
                value={form.confirm}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <p className="card-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
