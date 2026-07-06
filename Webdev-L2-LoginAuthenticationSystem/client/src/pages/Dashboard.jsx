import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

function formatDate(value) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <Navbar showLogout />
      <div className="dashboard-layout">
        <div className="dashboard-card">
          <h1 className="dashboard-greeting">
            Welcome back, {user?.username || "there"}!
          </h1>
          <p className="dashboard-subtitle">You are signed in to your Ebolt account.</p>

          <div className="dashboard-info">
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Username</span>
              <span className="dashboard-info-value">{user?.username || "—"}</span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Email</span>
              <span className="dashboard-info-value">{user?.email || "—"}</span>
            </div>
            <div className="dashboard-info-row">
              <span className="dashboard-info-label">Member since</span>
              <span className="dashboard-info-value">{formatDate(user?.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
