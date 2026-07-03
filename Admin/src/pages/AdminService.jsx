import React, { useEffect, useState } from "react";
import "../styles/AdminService.css";
<<<<<<< HEAD

// Apna backend URL yahan set karein
const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/services`;

const initialForm = { title: "", shortDescription: "", description: "", image: null };
=======
import AdminLayout from "../components/layout/AdminLayout";   // ✅ add karo

const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/services`;

const QUICK_ICONS = ["🌿", "🧘", "💆", "🏃", "👐", "🔬", "❤️", "🩺", "💊", "🏥", "🤰", "🌱"];

const CATEGORIES = [
  { value: "nature", label: "🌿 Nature Care & Holistic Services" },
  { value: "medical", label: "🏥 Medical Services" },
  { value: "other", label: "✨ Other / General" },
];

const initialForm = { title: "", icon: "🌿", badge: "", description: "", category: "other" };

// Purani services jinme actual image file upload hui thi (path /uploads/... se shuru
// hota hai ya http se), unhe photo maano. Chhota text (emoji) ho to icon maano.
function isImagePath(val) {
  if (!val) return false;
  if (/^https?:\/\//i.test(val)) return true;
  if (val.startsWith("/uploads/")) return true;
  if (/\.(png|jpe?g|webp|gif|svg)$/i.test(val)) return true;
  return false;
}

function resolveImage(imageUrl) {
  if (!imageUrl) return null;
  const fullUrl = /^https?:\/\//i.test(imageUrl) ? imageUrl : `${BASE_URL}${imageUrl}`;
  return encodeURI(fullUrl);
}

async function parseResponse(res) {
  const rawText = await res.text();
  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`Server ne JSON nahi bheja (status ${res.status}). Raw response: ${rawText.slice(0, 300)}`);
  }
  if (!res.ok || !data.success) {
    throw new Error(`(${res.status}) ${data.message || "Request fail hua"}`);
  }
  return data;
}
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93

export default function AdminService() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
<<<<<<< HEAD
  const [preview, setPreview] = useState(null);
=======
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

<<<<<<< HEAD
  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success) setServices(data.data);
    } catch (err) {
      setError("Services load nahi ho paye. Server check karein.");
=======
  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(""), 6000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(encodeURI(API_URL));
      const data = await parseResponse(res);
      setServices(data.data);
    } catch (err) {
      console.error("fetchServices error:", err);
      showMessage("FETCH ERROR: " + err.message, true);
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(initialForm);
    setPreview(null);
=======
  const resetForm = () => {
    setForm(initialForm);
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
    setEditId(null);
    setShowForm(false);
  };

<<<<<<< HEAD
  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setTimeout(() => setError(""), 4000);
    } else {
      setSuccess(msg);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

=======
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.description.trim()) {
      showMessage("Title aur Description dena zaroori hai", true);
      return;
    }

    const fd = new FormData();
<<<<<<< HEAD
    fd.append("title", form.title);
    fd.append("shortDescription", form.shortDescription);
    fd.append("description", form.description);
    if (form.image) fd.append("image", form.image);
=======
    fd.append("title", form.title.trim());
    fd.append("shortDescription", form.badge.trim());
    fd.append("description", form.description.trim());
    fd.append("imageUrlText", form.icon.trim() || "🌿");
    fd.append("category", form.category);
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93

    setLoading(true);
    try {
      const url = editId ? `${API_URL}/${editId}` : API_URL;
      const method = editId ? "PUT" : "POST";
<<<<<<< HEAD
      const res = await fetch(url, { method, body: fd });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      showMessage(data.message);
      await fetchServices();
      resetForm();
    } catch (err) {
      showMessage(err.message || "Kuch galat ho gaya", true);
=======
      const res = await fetch(encodeURI(url), { method, body: fd });
      const data = await parseResponse(res);

      showMessage(data.message || (editId ? "Service update ho gaya" : "Service add ho gaya"));
      await fetchServices();
      resetForm();
    } catch (err) {
      console.error("handleSubmit error:", err);
      showMessage("SAVE ERROR: " + err.message, true);
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service) => {
    setEditId(service.ServiceId);
    setForm({
<<<<<<< HEAD
      title: service.Title,
      shortDescription: service.ShortDescription || "",
      description: service.Description || "",
      image: null,
    });
    setPreview(service.ImageUrl ? `${BASE_URL}${service.ImageUrl}` : null);
=======
      title: service.Title || "",
      icon: !isImagePath(service.ImageUrl) && service.ImageUrl ? service.ImageUrl : "🌿",
      badge: service.ShortDescription || "",
      description: service.Description || "",
      category: service.Category || "other",
    });
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Kya aap sach me is service ko delete karna chahte hain?")) return;
    setLoading(true);
    try {
<<<<<<< HEAD
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      showMessage(data.message);
      await fetchServices();
    } catch (err) {
      showMessage(err.message, true);
=======
      const res = await fetch(encodeURI(`${API_URL}/${id}`), { method: "DELETE" });
      const data = await parseResponse(res);
      showMessage(data.message || "Service delete ho gaya");
      await fetchServices();
    } catch (err) {
      console.error("handleDelete error:", err);
      showMessage("DELETE ERROR: " + err.message, true);
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  return (
=======
  const categoryLabel = (val) => CATEGORIES.find((c) => c.value === val)?.label || "✨ Other";

  return (
    <AdminLayout title="">
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
    <div className="admin-wrapper">
      <div className="admin-header">
        <div>
          <h1>Services Admin Panel</h1>
<<<<<<< HEAD
          <p className="subtitle">Services add, edit aur delete karein</p>
=======
          <p className="subtitle">Category chuno — usi section me card user side (services.html) par dikhega</p>
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
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
<<<<<<< HEAD
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Service ka title"
=======
            <label>Section (Category) *</label>
            <select name="category" value={form.category} onChange={handleChange} className="category-select">
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group icon-group">
              <label>Icon</label>
              <input
                type="text"
                name="icon"
                value={form.icon}
                onChange={handleChange}
                maxLength={4}
                className="icon-input"
                placeholder="🌿"
              />
              <div className="icon-picker">
                {QUICK_ICONS.map((ic) => (
                  <button
                    type="button"
                    key={ic}
                    className={`icon-chip ${form.icon === ic ? "active" : ""}`}
                    onClick={() => setForm((prev) => ({ ...prev, icon: ic }))}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group flex-1">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Service ka naam, jaise Yoga Therapy"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Badge / Tag</label>
            <input
              type="text"
              name="badge"
              value={form.badge}
              onChange={handleChange}
              placeholder="Card par chhota tag, jaise 🧘 Wellness"
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
            />
          </div>

          <div className="form-group">
<<<<<<< HEAD
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
=======
            <label>Description *</label>
            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              placeholder="Service ka poora detail"
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
            />
          </div>

          <div className="form-group">
<<<<<<< HEAD
            <label>Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="preview" className="img-preview" />}
=======
            <label>Live Preview</label>
            <div className="preview-card">
              <div className="preview-icon-box">{form.icon || "🌿"}</div>
              <h3>{form.title || "Service Title"}</h3>
              <p>{form.description || "Service description yahan dikhega..."}</p>
              {form.badge && <span className="preview-badge">{form.badge}</span>}
            </div>
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
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
<<<<<<< HEAD
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
=======
          <p className="empty-msg">Abhi tak koi service add nahi hui hai.</p>
        )}

        {services.map((s) => {
          const imgPath = isImagePath(s.ImageUrl);
          return (
            <div className="service-card" key={s.ServiceId}>
              {imgPath ? (
                <img
                  className="service-photo"
                  src={resolveImage(s.ImageUrl)}
                  alt={s.Title}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="service-icon-box">{s.ImageUrl || "🌿"}</div>
              )}
              <span className="category-tag">{categoryLabel(s.Category)}</span>
              <h3>{s.Title}</h3>
              <p>{s.Description}</p>
              {s.ShortDescription && <span className="service-badge">{s.ShortDescription}</span>}
              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleEdit(s)}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(s.ServiceId)}>
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
                  Delete
                </button>
              </div>
            </div>
<<<<<<< HEAD
          </div>
        ))}
      </div>
    </div>
=======
          );
        })}
      </div>
    </div>
    </AdminLayout>
>>>>>>> 5172f6ff05b3d0ceb44a5765b4d86a86c1e89a93
  );
}
