import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/layout/AdminLayout";
import "../styles/AdminList.css";

const STATUS_OPTIONS = ["pending", "confirmed", "cancelled"];

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(""), 6000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("fetchAppointments error:", err);
      showMessage(err.response?.data?.message || "Appointments load nahi ho paaye", true);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axiosClient.patch(`/appointments/${id}`, { status });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      showMessage("Status update ho gaya");
    } catch (err) {
      console.error("handleStatusChange error:", err);
      showMessage(err.response?.data?.message || "Status update nahi ho paaya", true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap sach me is appointment ko delete karna chahte hain?")) return;
    try {
      await axiosClient.delete(`/appointments/${id}`);
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      showMessage("Appointment delete ho gaya");
    } catch (err) {
      console.error("handleDelete error:", err);
      showMessage(err.response?.data?.message || "Delete nahi ho paaya", true);
    }
  };

  return (
    <AdminLayout title="">
      <div className="admin-wrapper">
        <div className="admin-header">
          <div>
            <h1>Appointments</h1>
            <p className="subtitle">Website se aaye hue appointment requests yahan manage karein</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="list-table-wrap">
          {loading ? (
            <p className="empty-msg">Loading...</p>
          ) : appointments.length === 0 ? (
            <p className="empty-msg">Abhi tak koi appointment nahi hai.</p>
          ) : (
            <table className="list-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Department</th>
                  <th>Date &amp; Time</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <div>{a.fullName}</div>
                      <div className="cell-sub">{a.phone}</div>
                    </td>
                    <td>{a.dept}</td>
                    <td>
                      <div>{new Date(a.appt_date).toLocaleDateString("en-IN")}</div>
                      <div className="cell-sub">{a.appt_time}</div>
                    </td>
                    <td className="message-preview">{a.description || "—"}</td>
                    <td>
                      <select
                        className="status-select"
                        value={a.status}
                        onChange={(e) => handleStatusChange(a.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <div style={{ marginTop: 6 }}>
                        <span className={`badge ${a.status}`}>{a.status}</span>
                      </div>
                    </td>
                    <td>
                      <button className="btn-delete" onClick={() => handleDelete(a.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
