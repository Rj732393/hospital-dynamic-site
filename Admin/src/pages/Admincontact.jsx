import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/layout/AdminLayout";
import "../styles/AdminList.css";

export default function AdminContacts() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMessages();
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

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.get("/contacts");
      setMessages(res.data);
    } catch (err) {
      console.error("fetchMessages error:", err);
      showMessage(err.response?.data?.message || "Messages load nahi ho paaye", true);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axiosClient.patch(`/contacts/${id}/read`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
      );
      showMessage("Message read marked");
    } catch (err) {
      console.error("handleMarkAsRead error:", err);
      showMessage(err.response?.data?.message || "Mark as read fail hua", true);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap sach me is message ko delete karna chahte hain?")) return;
    try {
      await axiosClient.delete(`/contacts/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showMessage("Message delete ho gaya");
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
            <h1>Messages</h1>
            <p className="subtitle">Contact form se aaye hue messages yahan dekhein</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="list-table-wrap">
          {loading ? (
            <p className="empty-msg">Loading...</p>
          ) : messages.length === 0 ? (
            <p className="empty-msg">Abhi tak koi message nahi hai.</p>
          ) : (
            <table className="list-table">
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div>{m.cName}</div>
                      <div className="cell-sub">{m.cEmail}</div>
                      {m.cPhone && <div className="cell-sub">{m.cPhone}</div>}
                    </td>
                    <td>{m.cSubject || "—"}</td>
                    <td className="message-preview">{m.cMessage}</td>
                    <td>
                      <span className={`badge ${m.isRead ? "confirmed" : "pending"}`}>
                        {m.isRead ? "Read" : "Unread"}
                      </span>
                    </td>
                    <td>
                      {!m.isRead && (
                        <button className="btn-edit" onClick={() => handleMarkAsRead(m.id)}>
                          Mark Read
                        </button>
                      )}
                      <button className="btn-delete" onClick={() => handleDelete(m.id)}>
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
