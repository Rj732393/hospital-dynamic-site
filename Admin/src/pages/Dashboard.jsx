import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/layout/AdminLayout";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const [apptRes, msgRes] = await Promise.all([
          axiosClient.get("/appointments"),
          axiosClient.get("/contacts"),
        ]);
        setAppointments(apptRes.data);
        setMessages(msgRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const pendingCount   = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "confirmed").length;
  const unreadCount    = messages.filter((m) => !m.isRead).length;

  return (
    <AdminLayout title="">
      {loading ? (
        <div className="loader-wrap">
          <div className="loader-spinner"></div>
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Welcome Banner */}
          <div className="welcome-banner">
            <div className="welcome-text">
              <h1>Welcome  {admin?.username} </h1>
              <p>Here's what's happening at Gopal Hospital today.</p>
            </div>
            <div className="welcome-emoji">🏥</div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">📅</div>
              <div className="stat-info">
                <div className="stat-value">{appointments.length}</div>
                <div className="stat-label">Total Appointments</div>
                <div className="stat-change">↑ All time</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">⏳</div>
              <div className="stat-info">
                <div className="stat-value">{pendingCount}</div>
                <div className="stat-label">Pending</div>
                <div className="stat-change" style={{ color: "#c2700a" }}>Action required</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✅</div>
              <div className="stat-info">
                <div className="stat-value">{confirmedCount}</div>
                <div className="stat-label">Confirmed</div>
                <div className="stat-change">Appointments done</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon red">✉️</div>
              <div className="stat-info">
                <div className="stat-value">{unreadCount}</div>
                <div className="stat-label">Unread Messages</div>
                <div className="stat-change" style={{ color: "#b91c1c" }}>
                  {messages.length} total
                </div>
              </div>
            </div>
          </div>

          {/* Recent Sections */}
          <div className="dash-grid">
            <div className="dash-section">
              <div className="dash-section-header">
                <div className="dash-section-title">
                  <span>📅</span> Recent Appointments
                </div>
                <Link to="/appointments" className="view-all">View All →</Link>
              </div>
              {appointments.length === 0 ? (
                <div className="empty-state">📭<p>No appointments yet</p></div>
              ) : (
                appointments.slice(0, 5).map((a) => (
                  <div className="recent-row" key={a.id}>
                    <div className="recent-avatar">
                      {a.fullName?.[0]?.toUpperCase() || "P"}
                    </div>
                    <div className="recent-info">
                      <div className="recent-name">{a.fullName}</div>
                      <div className="recent-sub">
                        {a.dept} • {new Date(a.appt_date).toLocaleDateString("en-IN")} at {a.appt_time}
                      </div>
                    </div>
                    <span className={`badge ${a.status}`}>{a.status}</span>
                  </div>
                ))
              )}
            </div>

            <div className="dash-section">
              <div className="dash-section-header">
                <div className="dash-section-title">
                  <span>✉️</span> Recent Messages
                </div>
                <Link to="/contacts" className="view-all">View All →</Link>
              </div>
              {messages.length === 0 ? (
                <div className="empty-state">📭<p>No messages yet</p></div>
              ) : (
                messages.slice(0, 5).map((m) => (
                  <div className="recent-row" key={m.id}>
                    <div className="recent-avatar">
                      {m.cName?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="recent-info">
                      <div className="recent-name">{m.cName}</div>
                      <div className="recent-sub">
                        {m.cSubject || "No subject"} • {m.cEmail}
                      </div>
                    </div>
                    <span className={`badge ${m.isRead ? "confirmed" : "pending"}`}>
                      {m.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}