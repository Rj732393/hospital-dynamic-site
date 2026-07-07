import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AdminLayout from "../components/layout/AdminLayout";
import "../styles/AdminDoctors.css";

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", specialization: "", experience: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/doctors");
      setDoctors(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm({ name: "", specialization: "", experience: "" });
    setPhotoFile(null);
    setPreview(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.specialization.trim()) {
      setMessage("Name aur Specialization required hain");
      return;
    }

    try {
      setSaving(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("specialization", form.specialization);
      fd.append("experience", form.experience || 0);
      if (photoFile) fd.append("photo", photoFile);

      if (editingId) {
        await axiosClient.put(`/doctors/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Doctor update ho gaya");
      } else {
        await axiosClient.post("/doctors", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Doctor add ho gaya");
      }

      resetForm();
      fetchDoctors();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Kuch galat ho gaya");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (doc) => {
    setEditingId(doc.DoctorID);
    setForm({
      name: doc.Name,
      specialization: doc.Specialization,
      experience: doc.Experience,
    });
    setPreview(doc.ImageUrl ? `http://localhost:5000${doc.ImageUrl}` : null);
    setPhotoFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Do You Want to Delete This Doctor?")) return;
    try {
      await axiosClient.delete(`/doctors/${id}`);
      setMessage("Doctor Removed");
      fetchDoctors();
    } catch (err) {
      console.error(err);
      setMessage("Not Deleted");
    }
  };

  return (
    <AdminLayout title="">
      <div className="admin-doctors">
        <h2 className="admin-title">Manage Doctors</h2>
        {message && <div className="admin-message">{message}</div>}

        <form className="doctor-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Amit Kumar"
              />
            </div>
            <div className="form-group">
              <label>Specialization</label>
              <input
                type="text"
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="Senior Cardiologist"
              />
            </div>
            <div className="form-group">
              <label>Experience (Years)</label>
              <input
                type="number"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g. 5"
                min="0"
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Doctor Photo (optional)</label>
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
            {preview ? (
              <img src={preview} alt="preview" className="photo-preview" />
            ) : (
              <div className="photo-preview default-avatar">👤</div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Doctor" : "Add Doctor"}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        <div className="doctor-list">
          {loading ? (
            <p>Loading...</p>
          ) : doctors.length === 0 ? (
            <p>Doctor not added</p>
          ) : (
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.DoctorID}>
                    <td>
                      {doc.ImageUrl ? (
                        <img
                          src={`http://localhost:5000${doc.ImageUrl}`}
                          alt={doc.Name}
                          className="table-photo"
                        />
                      ) : (
                        <div className="default-avatar small">👤</div>
                      )}
                    </td>
                    <td>{doc.Name}</td>
                    <td>{doc.Specialization}</td>
                    <td>{doc.Experience}+ Yrs</td>
                    <td className="actions-cell">
                      <button className="btn-edit" onClick={() => handleEdit(doc)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(doc.DoctorID)}>Delete</button>
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