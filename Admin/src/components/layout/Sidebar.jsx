import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/appointments", label: "Appointments", icon: "📅" },
  { to: "/contacts", label: "Messages", icon: "✉️" },
  { to: "/services", label: "Services", icon: "🏥" },
  { to: "/programs", label: "Programs", icon: "🧘" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏥</div>
        <div className="sidebar-logo-text">
          <h2>Gopal Hospital</h2>
          <span>Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      {/* <div className="sidebar-section-label">Main Menu</div> */}
      <nav className="sidebar-nav">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              "sidebar-link" + (isActive ? " active" : "")
            }
          >
            <div className="sidebar-link-icon">{l.icon}</div>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}