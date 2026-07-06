import { useAuth } from "../context/AuthContext";
import { ArrowMarkIcon } from "./icons";

export default function Navbar({ showLogout = false }) {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="brand">
        <span className="brand-mark">
          <ArrowMarkIcon />
        </span>
        Ebolt
      </div>

      {showLogout && (
        <button type="button" className="btn-logout" onClick={logout}>
          Log out
        </button>
      )}
    </nav>
  );
}
