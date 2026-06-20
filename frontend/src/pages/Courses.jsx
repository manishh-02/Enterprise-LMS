import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ title: '', category: '', price: '', description: '' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get('http://localhost:5000/api/courses', config);
      setCourses(response.data.data);
    } catch (err) {
      console.error('Failed to fetch courses');
    } finally {
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormData({ 
      title: course.title, 
      category: course.category, 
      price: course.price, 
      description: course.description 
    });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(`http://localhost:5000/api/courses/${editingCourse._id}`, formData, config);
      
      // Update local state instantly
      setCourses(courses.map(c => c._id === editingCourse._id ? response.data.data : c));
      setIsModalOpen(false);
      alert('Course updated successfully!');
    } catch (err) {
      alert('Failed to update course.');
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`🚨 Are you sure you want to unpublish and delete "${title}"?`)) {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:5000/api/courses/${id}`, config);
        
        // Remove from UI instantly
        setCourses(courses.filter(course => course._id !== id));
      } catch (err) {
        alert('Failed to delete course.');
      }
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const styles = `
    .page-container { font-family: 'Inter', sans-serif; color: #0f172a; animation: fadeIn 0.4s ease; text-align: left; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
    .page-title { font-size: 28px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.5px; }
    .page-subtitle { color: #64748b; font-size: 15px; margin: 0; }
    .action-bar { display: flex; gap: 16px; align-items: center; }
    .search-box { position: relative; width: 300px; }
    .search-input { width: 100%; padding: 12px 16px 12px 40px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; transition: 0.2s; }
    .search-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .btn-primary { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; transition: 0.2s; display: inline-flex; gap: 8px; border: none; cursor: pointer;}
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2); }
    .table-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
    .data-table { width: 100%; border-collapse: collapse; text-align: left; }
    .data-table th { background: #f8fafc; padding: 16px 24px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; }
    .data-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 14px; vertical-align: middle; }
    .course-title { font-weight: 700; color: #0f172a; margin: 0 0 4px 0; font-size: 15px; }
    .course-category { font-size: 13px; color: #64748b; font-weight: 500; }
    .price-tag { font-family: monospace; font-size: 15px; font-weight: 700; color: #0f172a; background: #f1f5f9; padding: 4px 8px; border-radius: 6px;}
    .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
    .status-dot { width: 6px; height: 6px; border-radius: 50%; background: #059669; }
    
    /* Action Icons */
    .action-icons { display: flex; gap: 12px; justify-content: flex-end;}
    .icon-btn { background: none; border: none; cursor: pointer; color: #64748b; padding: 6px; border-radius: 6px; transition: 0.2s; }
    .icon-btn:hover { background: #f1f5f9; color: #2563eb; }
    .icon-delete:hover { color: #dc2626; background: #fef2f2; }

    /* Edit Modal */
    .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
    .modal-box { background: #ffffff; width: 100%; max-width: 500px; border-radius: 20px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: slideUp 0.3s ease; position: relative; }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .close-btn { position: absolute; top: 20px; right: 20px; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; color: #64748b; }
    .form-group { margin-bottom: 20px; text-align: left; }
    .form-label { display: block; font-size: 13px; font-weight: 600; color: #334155; margin-bottom: 8px; }
    .form-input, .form-select { width: 100%; padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; background: #f8fafc; outline: none; }
    .form-input:focus { border-color: #2563eb; }
    textarea.form-input { min-height: 100px; resize: vertical; }
  `;

  return (
    <div className="page-container">
      <style>{styles}</style>
      
      <div className="header-section">
        <div>
          <h1 className="page-title">Enterprise Course Catalog</h1>
          <p className="page-subtitle">Manage curriculum, track enrollment pricing, and update modules.</p>
        </div>
        
        <div className="action-bar">
          <div className="search-box">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" className="search-input" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Link to="/dashboard/add-course" className="btn-primary">
            + Upload New Course
          </Link>
        </div>
      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Curriculum Details</th>
              <th>Status</th>
              <th>Enrollment Fee</th>
              <th style={{ textAlign: 'right' }}>Manage</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Loading courses...</td></tr>
            ) : filteredCourses.length === 0 ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>No courses found.</td></tr>
            ) : (
              filteredCourses.map((course) => (
                <tr key={course._id}>
                  <td>
                    <div className="course-title">{course.title}</div>
                    <div className="course-category">{course.category}</div>
                  </td>
                  <td>
                    <div className="status-badge"><div className="status-dot"></div>Published</div>
                  </td>
                  <td><span className="price-tag">{course.price === 0 ? 'FREE' : `₹${course.price}`}</span></td>
                  <td>
                    <div className="action-icons">
                      <button className="icon-btn" onClick={() => handleOpenEdit(course)} title="Edit Content">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="icon-btn icon-delete" onClick={() => handleDelete(course._id, course.title)} title="Remove Course">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Course Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>✕</button>
            <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '8px' }}>Edit Course Content</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Update catalog information for existing modules.</p>
            
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input type="text" className="form-input" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="Engineering & Tech">Engineering & Tech</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Leadership & Management">Leadership & Management</option>
                  </select>
                </div>
                <div className="form-group" style={{ width: '120px' }}>
                  <label className="form-label">Price (₹)</label>
                  <input type="number" className="form-input" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px', padding: '14px' }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;