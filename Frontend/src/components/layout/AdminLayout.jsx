import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/admin.css";

export default function AdminLayout({ title, children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar title={title} />
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}