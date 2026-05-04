import { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, Mail, Phone } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Modal from "../UI/Modal";

export default function StudentTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewStudent, setViewStudent] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', grade: '', institute: '', tuition_class: '' });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', phone: '', grade: '', institute: '', tuition_class: '', password: '12345678' });
  const [saving, setSaving] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      setClasses(response?.data?.classes || []);
    } catch (error) {
      console.error('Failed to fetch classes for dropdowns:', error);
      setClasses([]);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/students');
      setStudents(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatGrade = (value) => {
    const raw = String(value || '').trim()
    if (!raw) return 'N/A'
    if (/^grade\s+/i.test(raw)) return raw.replace(/^grade\s+/i, 'Grade ')
    return `Grade ${raw}`
  }

  const normalizeGradeInput = (value) => {
    const raw = String(value || '').trim()
    if (!raw) return ''
    const digits = raw.match(/\d+/)?.[0]
    if (digits) return digits
    return raw.replace(/^grade\s+/i, '')
  }

  const openEditModal = (student) => {
    setEditingStudent(student)
    setEditForm({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      grade: normalizeGradeInput(student.grade),
      institute: student.institute || '',
      tuition_class: student.tuition_class || '',
    })
  }

  const uniqueGrades = Array.from(
    new Set(classes.map((c) => normalizeGradeInput(c.grade)).filter(Boolean))
  ).sort((a, b) => Number(a) - Number(b));

  const classOptionsForEdit = classes.filter(
    (c) => normalizeGradeInput(c.grade) === normalizeGradeInput(editForm.grade)
  );

  const onEditGradeChange = (gradeValue) => {
    setEditForm((prev) => ({ ...prev, grade: gradeValue, tuition_class: '' }));
  };

  const onEditClassChange = (classId) => {
    const selected = classes.find((c) => String(c.id) === String(classId));
    setEditForm((prev) => ({
      ...prev,
      tuition_class: classId,
      grade: selected ? normalizeGradeInput(selected.grade) : prev.grade,
      institute: selected ? String(selected.location || prev.institute || '').trim() : prev.institute,
    }));
  };

  const classOptionsForAdd = classes.filter(
    (c) => normalizeGradeInput(c.grade) === normalizeGradeInput(addForm.grade)
  );

  const onAddGradeChange = (gradeValue) => {
    setAddForm((prev) => ({ ...prev, grade: gradeValue, tuition_class: '' }));
  };

  const onAddClassChange = (classId) => {
    const selected = classes.find((c) => String(c.id) === String(classId));
    setAddForm((prev) => ({
      ...prev,
      tuition_class: classId,
      grade: selected ? normalizeGradeInput(selected.grade) : prev.grade,
      institute: selected ? String(selected.location || prev.institute || '').trim() : prev.institute,
    }));
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault()
    if (!editingStudent) return

    try {
      setSaving(true)
      await api.put(`/users/students/${editingStudent.id}`, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        grade: editForm.grade,
        institute: editForm.institute,
        tuition_class: editForm.tuition_class || null,
      })
      toast.success('Student updated successfully')
      setEditingStudent(null)
      fetchStudents()
    } catch (error) {
      console.error('Update student failed:', error)
      toast.error(error?.response?.data?.message || 'Failed to update student')
    } finally {
      setSaving(false)
    }
  }

  const confirmDeleteStudent = async () => {
    if (!deletingStudent) return
    try {
      setSaving(true)
      await api.delete(`/users/students/${deletingStudent.id}`)
      toast.success('Student deleted successfully')
      if (viewStudent?.id === deletingStudent.id) {
        setViewStudent(null)
      }
      setDeletingStudent(null)
      fetchStudents()
    } catch (error) {
      console.error('Delete student failed:', error)
      toast.error(error?.response?.data?.message || 'Failed to delete student')
    } finally {
      setSaving(false)
    }
  }

  const handleAddStudent = async (e) => {
    e.preventDefault()
    if (!addForm.name.trim() || !addForm.email.trim()) {
      toast.error('Name and email are required')
      return
    }

    try {
      setSaving(true)
      await api.post('/users/students', {
        name: addForm.name,
        email: addForm.email,
        phone: addForm.phone,
        grade: addForm.grade,
        institute: addForm.institute,
        tuition_class: addForm.tuition_class || null,
        status: 'active',
        password: addForm.password,
      })
      toast.success('Student added successfully')
      setAddModalOpen(false)
      setAddForm({ name: '', email: '', phone: '', grade: '', institute: '', tuition_class: '', password: '12345678' })
      fetchStudents()
    } catch (error) {
      console.error('Add student failed:', error)
      toast.error(error?.response?.data?.message || 'Failed to add student')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-gray-600 mt-4">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64"
            />
          </div>
          <button
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            onClick={() => setAddModalOpen(true)}
          >
            + Add Student
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">No students found</p>
            {searchQuery && (
              <p className="text-gray-400 text-sm mt-2">Try adjusting your search</p>
            )}
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Institute</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {student.profile_picture ? (
                        <img
                          src={student.profile_picture.startsWith('http') ? student.profile_picture : `http://localhost:5000${student.profile_picture}`}
                          alt={student.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {student.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                        </div>
                      )}
                      <span className="ml-3 font-medium text-gray-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{formatGrade(student.grade)}</td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {student.institute || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm hidden md:table-cell">
                    {student.email}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm hidden lg:table-cell">
                    {student.phone || 'N/A'}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${String(student.status || 'active').toLowerCase() === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>
                      {String(student.status || 'active').toLowerCase() === 'inactive' ? 'Inactive' : 'Active'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View"
                        onClick={() => setViewStudent(student)}
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit"
                        onClick={() => openEditModal(student)}
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        onClick={() => setDeletingStudent(student)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Details">
        {viewStudent && (
          <div className="space-y-3 text-sm">
            <div><span className="font-semibold">Name:</span> {viewStudent.name}</div>
            <div><span className="font-semibold">Email:</span> {viewStudent.email}</div>
            <div><span className="font-semibold">Phone:</span> {viewStudent.phone || 'N/A'}</div>
            <div><span className="font-semibold">Grade:</span> {formatGrade(viewStudent.grade)}</div>
            <div><span className="font-semibold">Institute:</span> {viewStudent.institute || 'N/A'}</div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!editingStudent} onClose={() => setEditingStudent(null)} title="Edit Student">
        <form onSubmit={handleUpdateStudent} className="space-y-3">
          <input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Name" />
          <input type="email" value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Email" />
          <input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Phone" />
          <select
            value={editForm.grade}
            onChange={(e) => onEditGradeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select Grade</option>
            {uniqueGrades.map((grade) => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
          <select
            value={editForm.tuition_class}
            onChange={(e) => onEditClassChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            disabled={!editForm.grade}
          >
            <option value="">Select Class</option>
            {classOptionsForEdit.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.title || classItem.name || String(classItem.id)}
              </option>
            ))}
          </select>
          <input value={editForm.institute} onChange={(e) => setEditForm((p) => ({ ...p, institute: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Institute" />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setEditingStudent(null)} className="px-3 py-2 border border-gray-300 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-3 py-2 bg-primary text-white rounded-lg disabled:opacity-60">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Student">
        <form onSubmit={handleAddStudent} className="space-y-3">
          <input value={addForm.name} onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Name" />
          <input type="email" value={addForm.email} onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Email" />
          <input value={addForm.phone} onChange={(e) => setAddForm((p) => ({ ...p, phone: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Phone" />
          <select
            value={addForm.grade}
            onChange={(e) => onAddGradeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select Grade</option>
            {uniqueGrades.map((grade) => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </select>
          <select
            value={addForm.tuition_class}
            onChange={(e) => onAddClassChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
            disabled={!addForm.grade}
          >
            <option value="">Select Class</option>
            {classOptionsForAdd.map((classItem) => (
              <option key={classItem.id} value={classItem.id}>
                {classItem.title || classItem.name || String(classItem.id)}
              </option>
            ))}
          </select>
          <input value={addForm.institute} onChange={(e) => setAddForm((p) => ({ ...p, institute: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Institute" />
          <input value={addForm.password} onChange={(e) => setAddForm((p) => ({ ...p, password: e.target.value }))} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="Temporary Password" />
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setAddModalOpen(false)} className="px-3 py-2 border border-gray-300 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-3 py-2 bg-primary text-white rounded-lg disabled:opacity-60">{saving ? 'Adding...' : 'Add Student'}</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deletingStudent} onClose={() => setDeletingStudent(null)} title="Delete Student">
        {deletingStudent && (
          <div className="space-y-4">
            <p className="text-gray-700">Delete student <span className="font-semibold">{deletingStudent.name}</span>?</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteStudent}
                className="px-3 py-2 bg-red-600 text-white rounded-lg disabled:opacity-60"
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
