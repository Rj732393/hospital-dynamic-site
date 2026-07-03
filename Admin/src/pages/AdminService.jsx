import React, { useEffect, useState } from "react";
import "../styles/AdminService.css";

// Apna backend URL yahan set karein
const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/services`;

const initialForm = { title: "", shortDescription: "", description: "", image: null };

export default function AdminService() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) {
      setError("Services load nahi ho paye. Server check karein.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(initialForm);
    setPreview(null);
    setEditId(null);
    setShowForm(false);
  };

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(""), 4000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      showMessage("Title aur Description dena zaroori hai", true);
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("shortDescription", form.shortDescription);
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);

    setLoading(true);
    try {
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      showMessage(data.message);
      await fetchServices();
      resetForm();
    } catch (err) {
      showMessage(err.message || "Kuch galat ho gaya", true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditId(service.ServiceId);
    setForm({
      title: service.Title,
      shortDescription: service.ShortDescription || "",
      description: service.Description || "",
      image: null,
    });
    setPreview(service.ImageUrl ? `${BASE_URL}${service.ImageUrl}` : null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap sach me is service ko delete karna chahte hain?")) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      showMessage(data.message);
      await fetchServices();
    } catch (err) {
      showMessage(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-wrapper">
      <div className="admin-header">
        <div>
          <h1>Services Admin Panel</h1>
          <p className="subtitle">Services add, edit aur delete karein</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Naya Service
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Service Edit Karein" : "Naya Service Add Karein"}</h2>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Service ka title"
            />
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <input
              type="text"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              placeholder="Card par dikhne wala chhota description"
            />
          </div>

          <div className="form-group">
            <label>Full Description *</label>
            <textarea
              name="description"
              rows="6"
              value={form.description}
              onChange={handleChange}
              placeholder="Poora detail - 'Read More' click karne par yahi dikhega"
            />
          </div>

          <div className="form-group">
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="preview" className="img-preview" />}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : editId ? "Update Karein" : "Add Karein"}
            </button>
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="service-grid">
        {loading && services.length === 0 && <p className="empty-msg">Loading...</p>}
        {!loading && services.length === 0 && (
          <p className="empty-msg">Abhi tak koi service add nahi hua hai.</p>
        )}

        {services.map((p) => (
          <div className="service-card" key={p.ServiceId}>
            {p.ImageUrl ? (
              <img src={`${BASE_URL}${p.ImageUrl}`} alt={p.Title} />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <div className="service-card-body">
              <h3>{p.Title}</h3>
              <p>{p.ShortDescription}</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(p.ServiceId)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
