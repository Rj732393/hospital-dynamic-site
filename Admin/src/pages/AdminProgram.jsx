import React, { useEffect, useState } from "react";
import "../styles/AdminProgram.css";
import AdminLayout from "../components/layout/AdminLayout";

// Apna backend URL yahan set karein
const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/programs`;

const initialForm = { title: "", shortDescription: "", description: "", image: null };

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function resolveImage(imageUrl) {
  if (!imageUrl) return null;
  const fullUrl = /^https?:\/\//i.test(imageUrl) ? imageUrl : `${BASE_URL}${imageUrl}`;
  return encodeURI(fullUrl);
}

export default function AdminProgram() {
  const [programs, setPrograms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch(encodeURI(API_URL));
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Server ne JSON nahi bheja (status ${res.status}). Raw response: ${rawText.slice(0, 300)}`);
      }
      if (!res.ok || !data.success) {
        throw new Error(`(${res.status}) ${data.message || "Programs fetch nahi ho paye"}`);
      }
      setPrograms(data.data);
      console.log("Fetched programs:", data.data);
    } catch (err) {
      console.error("fetchPrograms error:", err);
      showMessage("FETCH ERROR: " + err.message, true);
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
    fd.append("title", form.title.trim());
    fd.append("shortDescription", form.shortDescription.trim());
    fd.append("description", form.description.trim());
    if (form.image) fd.append("image", form.image);

    setLoading(true);
    try {
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "PUT" : "POST";
      const res = await fetch(encodeURI(url), { method, body: fd });
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Server ne JSON nahi bheja (status ${res.status}). Raw response: ${rawText.slice(0, 300)}`);
      }
      if (!res.ok || !data.success) {
        throw new Error(`(${res.status}) ${data.message || "Save fail hua"}`);
      }

      showMessage(data.message || (editId ? "Program update ho gaya" : "Program add ho gaya"));
      await fetchPrograms();
      resetForm();
    } catch (err) {
      console.error("handleSubmit error:", err);
      showMessage("SAVE ERROR: " + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (program) => {
    setEditId(program.ProgramId);
    setForm({
      title: program.Title,
      shortDescription: program.ShortDescription || "",
      description: program.Description || "",
      image: null,
    });
    setPreview(resolveImage(program.ImageUrl));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap sach me is program ko delete karna chahte hain?")) return;
    setLoading(true);
    try {
      const res = await fetch(encodeURI(`${API_URL}/${id}`), { method: "DELETE" });
      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Server ne JSON nahi bheja (status ${res.status}). Raw response: ${rawText.slice(0, 300)}`);
      }
      if (!res.ok || !data.success) {
        throw new Error(`(${res.status}) ${data.message || "Delete fail hua"}`);
      }
      showMessage(data.message || "Program delete ho gaya");
      await fetchPrograms();
    } catch (err) {
      console.error("handleDelete error:", err);
      showMessage("DELETE ERROR: " + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (

    <AdminLayout title=""> 
    <div className="admin-wrapper">
      <div className="admin-header">
        <div>
          <h1></h1>
          <p className="subtitle">Programs add, edit aur delete karein — jo bhi save hoga, wo neeche cards me turant dikhega</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Naya Program
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>{editId ? "Program Edit Karein" : "Naya Program Add Karein"}</h2>

          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Program ka title"
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

      <div className="program-grid">
        {loading && programs.length === 0 && <p className="empty-msg">Loading...</p>}
        {!loading && programs.length === 0 && (
          <p className="empty-msg">Abhi tak koi program add nahi hua hai.</p>
        )}

        {programs.map((p) => (
          <div className="program-card" key={p.ProgramId}>
            {p.ImageUrl ? (
              <img src={resolveImage(p.ImageUrl)} alt={p.Title} onError={(e) => { e.target.style.display = "none"; }} />
            ) : (
              <div className="no-image">No Image</div>
            )}
            <div className="program-card-body">
              <div className="card-meta">
                {p.UpdatedAt && (
                  <span className="badge-updated">Last updated: {formatDate(p.UpdatedAt)}</span>
                )}
              </div>
              <h3>{p.Title}</h3>
              <p>{p.ShortDescription || (p.Description || "").slice(0, 90)}</p>
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(p.ProgramId)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </AdminLayout>
  );
}