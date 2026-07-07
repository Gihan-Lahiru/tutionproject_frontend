import { useState, useEffect } from "react";
import { Search, Eye, Edit, Trash2, CheckCircle2, XCircle } from "lucide-react";
import api from "../../api/axios";
import { usersApi } from "../../api";
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
  const [approvingStudentIds, setApprovingStudentIds] = useState(new Set());
  const [rejectingStudentIds, setRejectingStudentIds] = useState(new Set());
  const [rejectModal, setRejectModal] = useState(null); // student object
  const [rejectReason, setRejectReason] = useState('');

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
      const nextStudents = Array.isArray(response.data)
        ? response.data
        : (response.data?.users || []);
      setStudents(nextStudents);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      toast.error('Failed to load students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const statusSortOrder = (student) => {
    const approval = String(student.approvalStatus || student.approval_status || '').toLowerCase();
    if (approval === 'approved' && String(student.status || 'active').toLowerCase() === 'active') return 0; // active first
    if (approval === 'pending' || approval === 'waiting' || (approval !== 'approved' && approval !== 'rejected' && approval !== '')) return 1; // pending second
    return 2; // rejected / inactive last
  };

  const filteredStudents = students
    .filter(
      (student) =>
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.grade?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => statusSortOrder(a) - statusSortOrder(b));

  const isPendingApproval = (student) => {
    const approvalStatus = String(student.approvalStatus || student.approval_status || '').toLowerCase();
    // A student is pending if approvalStatus is 'pending' or not yet set to 'approved'
    return approvalStatus === 'pending' || approvalStatus === 'waiting' || (approvalStatus !== 'approved' && approvalStatus !== 'rejected' && approvalStatus !== '');
  }

  const pendingStudents = filteredStudents.filter(isPendingApproval);

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

  // Hardcoded standard fallback grades to ensure the dropdown is never empty
  const standardGrades = ['6', '7', '8', '9', '10', '11', 'A/L'];
  
  const uniqueGrades = Array.from(
    new Set([
      ...standardGrades,
      ...classes.map((c) => normalizeGradeInput(c.grade)).filter(Boolean)
    ])
  ).sort((a, b) => {
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return a.localeCompare(b);
  });

  // Fallback classes if database has none
  const getFallbacksForGrade = (gradeVal) => {
    if (!gradeVal) return [];
    return [
      { id: `fallback-1-${gradeVal}`, title: 'Focus Hadungamuwa', grade: gradeVal, location: 'Focus Hadungamuwa', student_count: 45 },
      { id: `fallback-2-${gradeVal}`, title: 'Prebhashi Hettipola', grade: gradeVal, location: 'Prebhashi Hettipola', student_count: 32 }
    ];
  };

  const classOptionsForEdit = (() => {
    const dbMatched = classes.filter((c) => normalizeGradeInput(c.grade) === normalizeGradeInput(editForm.grade));
    return dbMatched.length > 0 ? dbMatched : getFallbacksForGrade(editForm.grade);
  })();

  const onEditGradeChange = (gradeValue) => {
    setEditForm((prev) => ({ ...prev, grade: gradeValue, tuition_class: '' }));
  };

  const onEditClassChange = (classId) => {
    const allOptions = [...classes, ...getFallbacksForGrade(editForm.grade)];
    const selected = allOptions.find((c) => String(c.id) === String(classId));
    setEditForm((prev) => ({
      ...prev,
      tuition_class: classId,
      grade: selected ? normalizeGradeInput(selected.grade) : prev.grade,
      institute: selected ? String(selected.location || prev.institute || '').trim() : prev.institute,
    }));
  };

  const classOptionsForAdd = (() => {
    const dbMatched = classes.filter((c) => normalizeGradeInput(c.grade) === normalizeGradeInput(addForm.grade));
    return dbMatched.length > 0 ? dbMatched : getFallbacksForGrade(addForm.grade);
  })();

  const onAddGradeChange = (gradeValue) => {
    setAddForm((prev) => ({ ...prev, grade: gradeValue, tuition_class: '' }));
  };

  const onAddClassChange = (classId) => {
    const allOptions = [...classes, ...getFallbacksForGrade(addForm.grade)];
    const selected = allOptions.find((c) => String(c.id) === String(classId));
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

  const handleApproveStudent = async (student) => {
    if (!student?.id) return

    try {
      setApprovingStudentIds((prev) => new Set(prev).add(student.id))
      await usersApi.approveRegistration(student.id)
      toast.success(`${student.name || 'Student'} approved successfully`)
      fetchStudents()
    } catch (error) {
      console.error('Approve student failed:', error)
      toast.error(error?.response?.data?.message || 'Failed to approve registration')
    } finally {
      setApprovingStudentIds((prev) => {
        const next = new Set(prev)
        next.delete(student.id)
        return next
      })
    }
  }

  const handleRejectStudent = async () => {
    const student = rejectModal;
    if (!student?.id) return;
    try {
      setRejectingStudentIds((prev) => new Set(prev).add(student.id));
      await usersApi.rejectRegistration(student.id, rejectReason.trim() || undefined);
      toast.success(`${student.name || 'Student'} rejected`);
      setRejectModal(null);
      setRejectReason('');
      fetchStudents();
    } catch (error) {
      console.error('Reject student failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to reject registration');
    } finally {
      setRejectingStudentIds((prev) => {
        const next = new Set(prev);
        next.delete(student.id);
        return next;
      });
    }
  };

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

      {pendingStudents.length > 0 && (
        <div className="p-6 border-b border-gray-200 bg-amber-50/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending Registrations</h3>
              <p className="text-sm text-gray-600">Review student details and approve the accounts that are ready.</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
              {pendingStudents.length} waiting
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {pendingStudents.map((student) => (
              <div key={`pending-${student.id}`} className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    Pending
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p><span className="font-medium">Grade:</span> {formatGrade(student.grade)}</p>
                  <p><span className="font-medium">Institute:</span> {student.institute || 'N/A'}</p>
                  <p><span className="font-medium">Phone:</span> {student.phone || 'N/A'}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setViewStudent(student)}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRejectModal(student); setRejectReason(''); }}
                    disabled={rejectingStudentIds.has(student.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveStudent(student)}
                    disabled={approvingStudentIds.has(student.id)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {approvingStudentIds.has(student.id) ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPendingApproval(student) ? 'bg-amber-100 text-amber-800' : String(student.approvalStatus || student.approval_status || 'approved').toLowerCase() === 'rejected' ? 'bg-red-100 text-red-700' : String(student.status || 'active').toLowerCase() === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-primary/10 text-primary'}`}>
                      {isPendingApproval(student) ? 'Pending' : String(student.approvalStatus || student.approval_status || '').toLowerCase() === 'rejected' ? 'Rejected' : String(student.status || 'active').toLowerCase() === 'inactive' ? 'Inactive' : 'Active'}
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
                      {isPendingApproval(student) && (
                        <button
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve registration"
                          onClick={() => handleApproveStudent(student)}
                          disabled={approvingStudentIds.has(student.id)}
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </button>
                      )}
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
            <div><span className="font-semibold">Status:</span> {isPendingApproval(viewStudent) ? 'Pending approval' : String(viewStudent.approvalStatus || viewStudent.approval_status || '').toLowerCase() === 'rejected' ? 'Rejected' : String(viewStudent.status || 'active').toLowerCase() === 'inactive' ? 'Inactive' : 'Active'}</div>
            {isPendingApproval(viewStudent) && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleApproveStudent(viewStudent)}
                  disabled={approvingStudentIds.has(viewStudent.id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {approvingStudentIds.has(viewStudent.id) ? 'Approving...' : 'Approve Registration'}
                </button>
              </div>
            )}
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

      {/* Reject Registration Modal */}
      <Modal isOpen={!!rejectModal} onClose={() => { setRejectModal(null); setRejectReason(''); }} title="Reject Registration">
        {rejectModal && (
          <div className="space-y-4">
            <p className="text-gray-700">
              Reject registration for <span className="font-semibold">{rejectModal.name}</span>?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Incomplete details, wrong grade..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setRejectModal(null); setRejectReason(''); }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
                disabled={rejectingStudentIds.has(rejectModal.id)}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectStudent}
                disabled={rejectingStudentIds.has(rejectModal.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-60"
              >
                <XCircle className="h-4 w-4" />
                {rejectingStudentIds.has(rejectModal.id) ? 'Rejecting...' : 'Reject Registration'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
