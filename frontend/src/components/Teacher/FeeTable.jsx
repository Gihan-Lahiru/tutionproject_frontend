import { useEffect, useMemo, useState } from "react";
import { Send, CheckCircle2, AlertCircle, Check, X } from "lucide-react";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function FeeTable() {
  const [feeRecords, setFeeRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingReminderIds, setSendingReminderIds] = useState(new Set());
  const [pendingReceipts, setPendingReceipts] = useState([]);
  const [approvingIds, setApprovingIds] = useState(new Set());
  const [rejectingIds, setRejectingIds] = useState(new Set());
  const [selectedReceiptId, setSelectedReceiptId] = useState(null)
  const [approvalNotes, setApprovalNotes] = useState('')

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const [paymentsRes, studentsRes, receiptsRes] = await Promise.all([
          api.get('/payments/all'),
          api.get('/users/students'),
          api.get('/payments/receipts/pending').catch(() => ({ data: { payments: [] } })),
        ]);

        const rows = paymentsRes.data.payments || [];
        const studentRows = studentsRes.data.users || [];
        const receipts = receiptsRes.data.payments || [];
        
        setStudents(studentRows);
        setPendingReceipts(receipts);
        setStudents(studentRows);

        const normalizeGradeForRecord = (value) => {
          const raw = String(value || '').trim();
          if (!raw) return 'No Grade';
          const digits = raw.match(/\d+/)?.[0];
          if (digits) return `Grade ${digits}`;
          if (/^grade\s+/i.test(raw)) return raw.replace(/^grade\s+/i, 'Grade ');
          return raw;
        };

        const studentsById = new Map(studentRows.map((s) => [String(s.id || '').trim(), s]));
        const studentsByEmail = new Map(
          studentRows
            .filter((s) => s.email)
            .map((s) => [String(s.email).trim().toLowerCase(), s])
        );

        const mapStatus = (status) => {
          const s = String(status || '').toLowerCase();
          if (s === 'completed') return 'paid';
          if (s === 'failed') return 'overdue';
          return 'pending';
        };

        setFeeRecords(
          rows.map((p) => {
            const monthYear = [p.month, p.year].filter(Boolean).join(' ') || '-';
            const paidDate = p.payment_date || p.date || null;
            const studentId = String(p.student_id || p.user_id || p.payer_id || '').trim();
            const studentEmail = String(p.payer_email || '').trim().toLowerCase();
            const matchedStudent = studentsById.get(studentId) || studentsByEmail.get(studentEmail) || null;
            return {
              id: p.id,
              studentId: studentId || null,
              studentEmail: studentEmail || '',
              transactionId: p.transaction_id,
              student: p.payer_name || p.payer_email || 'Student',
              grade: normalizeGradeForRecord(matchedStudent?.grade),
              class: monthYear,
              month: String(p.month || '').trim(),
              year: String(p.year || '').trim(),
              amount: Number(p.amount || 0),
              dueDate: p.transaction_id || '-',
              status: mapStatus(p.status),
              paidDate: String(p.status || '').toLowerCase() === 'completed' ? paidDate : null,
            };
          })
        );
      } catch (e) {
        console.error('Failed to fetch payments:', e);
        setFeeRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const normalizeMonth = (value) => String(value || '').trim().toLowerCase();
  const normalizeGrade = (value) => {
    const raw = String(value || '').trim();
    if (!raw) return 'No Grade';
    const digits = raw.match(/\d+/)?.[0];
    if (digits) return `Grade ${digits}`;
    if (/^grade\s+/i.test(raw)) return raw.replace(/^grade\s+/i, 'Grade ');
    return raw;
  };

  const filteredRecords = feeRecords;

  const getGradeSortRank = (gradeLabel) => {
    const raw = String(gradeLabel || '').trim();
    const normalized = raw.toLowerCase();

    if (normalized === 'a/l' || normalized === 'al' || normalized.includes('a/l')) {
      return 999;
    }

    const digits = raw.match(/\d+/)?.[0];
    if (digits) {
      return Number(digits);
    }

    return 1000;
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: "bg-primary/10 text-primary",
      pending: "bg-gray-100 text-gray-700",
      overdue: "bg-red-100 text-red-800",
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleSendReminder = async (record) => {
    const reminderKey = record.id || record.transactionId;
    if (!reminderKey) {
      toast.error("Cannot send reminder for this record");
      return;
    }

    try {
      setSendingReminderIds((prev) => new Set(prev).add(reminderKey));

      await api.post('/payments/remind', {
        paymentId: record.id || null,
        transactionId: record.transactionId || null,
      });

      toast.success(`Reminder sent to ${record.student}`);
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to send reminder';
      toast.error(message);
    } finally {
      setSendingReminderIds((prev) => {
        const next = new Set(prev);
        next.delete(reminderKey);
        return next;
      });
    }
  };

  const { totalPaid, totalPending } = useMemo(() => {
    const paid = feeRecords.filter((r) => r.status === 'paid').reduce((a, b) => a + b.amount, 0);
    const pending = feeRecords.filter((r) => r.status === 'pending' || r.status === 'overdue').reduce((a, b) => a + b.amount, 0);
    return { totalPaid: paid, totalPending: pending };
  }, [feeRecords]);

  const gradeBreakdown = useMemo(() => {
    const completedPayments = feeRecords.filter((r) => {
      if (r.status !== 'paid') return false;
      return true;
    });

    const paidStudentIds = new Set(completedPayments.map((r) => String(r.studentId || '')).filter(Boolean));
    const paidStudentEmails = new Set(completedPayments.map((r) => String(r.studentEmail || '').trim().toLowerCase()).filter(Boolean));

    const byGrade = new Map();
    for (const student of students) {
      const gradeLabel = normalizeGrade(student.grade);
      const bucket = byGrade.get(gradeLabel) || { grade: gradeLabel, paid: [], unpaid: [] };

      const studentId = String(student.id || '').trim();
      const studentEmail = String(student.email || '').trim().toLowerCase();
      const isPaid = (studentId && paidStudentIds.has(studentId)) || (studentEmail && paidStudentEmails.has(studentEmail));

      const item = {
        id: student.id,
        name: student.name || 'Student',
        email: student.email || '',
      };

      if (isPaid) bucket.paid.push(item);
      else bucket.unpaid.push(item);

      byGrade.set(gradeLabel, bucket);
    }

    return Array.from(byGrade.values()).sort((a, b) => {
      const rankDiff = getGradeSortRank(a.grade) - getGradeSortRank(b.grade);
      if (rankDiff !== 0) return rankDiff;
      return a.grade.localeCompare(b.grade, undefined, { numeric: true });
    });
  }, [feeRecords, students]);

  const collectionRate = totalPaid + totalPending > 0 ? Math.round((totalPaid / (totalPaid + totalPending)) * 100) : 0;

  const handleApproveReceipt = async (receiptId) => {
    try {
      setApprovingIds((prev) => new Set(prev).add(receiptId));
      await api.post(`/payments/${receiptId}/receipt/approve`, {
        notes: approvalNotes,
      });
      toast.success('Payment receipt approved and completed!');
      setSelectedReceiptId(null);
      setApprovalNotes('');
      setPendingReceipts((prev) => prev.filter((r) => r.id !== receiptId));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to approve receipt');
    } finally {
      setApprovingIds((prev) => {
        const next = new Set(prev);
        next.delete(receiptId);
        return next;
      });
    }
  };

  const handleRejectReceipt = async (receiptId) => {
    try {
      setRejectingIds((prev) => new Set(prev).add(receiptId));
      await api.post(`/payments/${receiptId}/receipt/reject`, {
        notes: approvalNotes,
      });
      toast.success('Payment receipt rejected. Student has been notified.');
      setSelectedReceiptId(null);
      setApprovalNotes('');
      setPendingReceipts((prev) => prev.filter((r) => r.id !== receiptId));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to reject receipt');
    } finally {
      setRejectingIds((prev) => {
        const next = new Set(prev);
        next.delete(receiptId);
        return next;
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-gray-600">Total Collected</p>
          <p className="text-3xl font-bold text-gray-900">Rs {totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-gray-600">Pending Amount</p>
          <p className="text-3xl font-bold text-gray-900">Rs {totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <p className="text-sm text-gray-600">Collection Rate</p>
          <p className="text-3xl font-bold text-primary">
            {collectionRate}%
          </p>
        </div>
      </div>

      {/* Pending Receipt Approvals */}
      {pendingReceipts.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-blue-500">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Pending Receipt Approvals ({pendingReceipts.length})
            </h3>
            <p className="text-sm text-gray-600">Review and approve payment receipts from students</p>
          </div>

          <div className="grid gap-4">
            {pendingReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border border-blue-200 bg-blue-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-semibold text-gray-900">{receipt.payer_name || 'Student'}</p>
                    <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                      {receipt.grade || '-'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {receipt.month} {receipt.year} • Rs. {Number(receipt.amount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Email: {receipt.payer_email || '-'}</p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={receipt.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Receipt
                  </a>
                  <button
                    onClick={() => setSelectedReceiptId(receipt.id)}
                    className="px-3 py-2 text-sm bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Receipt Approval Modal */}
      {selectedReceiptId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Receipt Review & Approval</h3>
              <button
                onClick={() => {
                  setSelectedReceiptId(null)
                  setApprovalNotes('')
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {selectedReceiptId && (
              <>
                {pendingReceipts.find((r) => r.id === selectedReceiptId)?.receipt_url && (() => {
                  const receiptUrl = pendingReceipts.find((r) => r.id === selectedReceiptId)?.receipt_url;
                  const isPdf = receiptUrl?.toLowerCase().includes('.pdf') || receiptUrl?.toLowerCase().includes('/pdf') || receiptUrl?.toLowerCase().includes('pdf');
                  const isImage = receiptUrl?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i);
                  
                  return (
                    <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 space-y-2">
                      {isPdf ? (
                        <div className="h-96 w-full flex flex-col">
                          <embed
                            src={receiptUrl}
                            type="application/pdf"
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div className="h-96 flex items-center justify-center">
                          <img
                            src={receiptUrl}
                            alt="Receipt"
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-2 px-4 py-2 border-t border-gray-300 bg-gray-50">
                        <a
                          href={receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Open {isPdf ? 'PDF' : 'Image'} in new window ↗
                        </a>
                      </div>
                    </div>
                  );
                })()}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Approval Notes (optional)
                  </label>
                  <textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows={3}
                    placeholder="Add notes for the student (e.g., 'Receipt unclear, please resubmit')"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedReceiptId(null)
                      setApprovalNotes('')
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectReceipt(selectedReceiptId)}
                    disabled={rejectingIds.has(selectedReceiptId)}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    {rejectingIds.has(selectedReceiptId) ? 'Rejecting...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleApproveReceipt(selectedReceiptId)}
                    disabled={approvingIds.has(selectedReceiptId)}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    {approvingIds.has(selectedReceiptId) ? 'Approving...' : 'Approve'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Grade-wise Payment Status</h3>
            <p className="text-sm text-gray-600">Paid vs Non-Paid students by grade (all records)</p>
          </div>
        </div>

        {gradeBreakdown.length === 0 ? (
          <div className="text-sm text-gray-600">No student data found.</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {gradeBreakdown.map((group) => (
              <div key={group.grade} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{group.grade}</h4>
                  <div className="text-xs text-gray-600">
                    Paid: <span className="font-semibold text-green-700">{group.paid.length}</span> | Non-Paid: <span className="font-semibold text-red-700">{group.unpaid.length}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-md bg-green-50 border border-green-100 p-3">
                    <div className="flex items-center gap-2 text-green-800 font-semibold text-sm mb-2">
                      <CheckCircle2 className="w-4 h-4" /> Paid Students
                    </div>
                    <div className="space-y-1 max-h-40 overflow-auto text-sm">
                      {group.paid.length === 0 ? (
                        <p className="text-green-700/70">None</p>
                      ) : (
                        group.paid.map((s) => (
                          <div key={s.id} className="text-green-900">{s.name}</div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-md bg-red-50 border border-red-100 p-3">
                    <div className="flex items-center gap-2 text-red-800 font-semibold text-sm mb-2">
                      <AlertCircle className="w-4 h-4" /> Non-Paid Students
                    </div>
                    <div className="space-y-1 max-h-40 overflow-auto text-sm">
                      {group.unpaid.length === 0 ? (
                        <p className="text-red-700/70">None</p>
                      ) : (
                        group.unpaid.map((s) => (
                          <div key={s.id} className="text-red-900">{s.name}</div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div>
            <h4 className="text-lg font-semibold text-gray-900">All Payment Records</h4>
            <p className="text-sm text-gray-600">Detailed list of student payments</p>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-gray-600">Loading payments…</div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-6 text-gray-600">No payment records found.</div>
        ) : (
          <>
            <div className="lg:hidden p-4 space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-900 truncate">{record.student}</p>
                    {getStatusBadge(record.status)}
                  </div>
                  <p className="text-sm text-gray-600">{record.grade || '-'} | {record.class}</p>
                  <p className="text-sm text-gray-700">{record.studentEmail || '-'}</p>
                  <p className="text-sm text-gray-900 font-medium">Rs {record.amount}</p>
                  <p className="text-xs text-gray-500 break-all">Ref: {record.dueDate}</p>
                  <p className="text-xs text-gray-500">Paid Date: {record.paidDate || '-'}</p>
                  {record.status !== 'paid' && (
                    <button
                      onClick={() => handleSendReminder(record)}
                      disabled={sendingReminderIds.has(record.id || record.transactionId)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {sendingReminderIds.has(record.id || record.transactionId) ? 'Sending...' : 'Remind'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden lg:block">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Paid Date</th>
                    <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-900 truncate">{record.student}</td>
                      <td className="py-4 px-6 text-gray-900">{record.grade || '-'}</td>
                      <td className="py-4 px-6 text-gray-600 truncate">{record.studentEmail || '-'}</td>
                      <td className="py-4 px-6 text-gray-900">{record.class}</td>
                      <td className="py-4 px-6 text-gray-900">Rs {record.amount}</td>
                      <td className="py-4 px-6 text-gray-600 truncate">{record.dueDate}</td>
                      <td className="py-4 px-6">{getStatusBadge(record.status)}</td>
                      <td className="py-4 px-6 text-gray-600">{record.paidDate || '-'}</td>
                      <td className="py-4 px-6 text-right">
                        {record.status !== 'paid' && (
                          <button
                            onClick={() => handleSendReminder(record)}
                            disabled={sendingReminderIds.has(record.id || record.transactionId)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            {sendingReminderIds.has(record.id || record.transactionId) ? 'Sending...' : 'Remind'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
