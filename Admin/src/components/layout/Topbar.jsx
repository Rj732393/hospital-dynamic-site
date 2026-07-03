import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = admin?.username ? admin.username[0].toUpperCase() : "A";

  return (
    <header className="topbar">
      <div className="topbar-left">
  <span className="topbar-brand"><h3><b>Hospital Management System</b></h3></span>   {/* ✅ ye line add karo */}
  <h2 className="topbar-title">{title}</h2>
</div>
      <div className="topbar-right">
        <div className="topbar-admin-wrap" ref={dropdownRef}>
          <div
            className="topbar-admin"
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <div className="topbar-avatar">{initial}</div>
            <span>{admin?.username}</span>
          </div>

          {dropdownOpen && (
            <div className="topbar-dropdown">
              <button className="topbar-dropdown-item" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}