import React, { useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Button from '../UI/Button';
import { FiUploadCloud, FiMessageSquare } from 'react-icons/fi';

export default function PaymentOverdue({ user }) {
  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [messageMode, setMessageMode] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a receipt file');
      return;
    }
    
    setSubmitting(true);
    const formData = new FormData();
    formData.append('receipt', file);
    if (note) formData.append('note', note);

    try {
      await api.post('/payments/upload-receipt', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Payment receipt uploaded successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload receipt');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    
    setSendingMessage(true);
    try {
      await api.post('/messages', { message });
      toast.success('Message sent to admin successfully');
      setMessageMode(false);
      setMessage('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Overdue</h1>
          
          {user.paymentStatus === 'pending_verification' ? (
            <p className="text-gray-600">
              You have already uploaded a receipt and it is pending verification. Once verified by admin, your dashboard access will be restored.
            </p>
          ) : user.paymentStatus === 'rejected' ? (
            <p className="text-red-600 font-medium">
              Payment receipt was not approved. Please contact admin or upload a valid receipt again.
            </p>
          ) : (
            <p className="text-gray-600">
              Your payment due date has expired. Please upload your payment receipt for verification.
              Once verified by admin, dashboard access will be restored.
            </p>
          )}
        </div>

        {user.paymentStatus !== 'pending_verification' && (
          <form onSubmit={handleUpload} className="space-y-4 mb-6 pt-6 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Payment Receipt (Image/PDF)
              </label>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g. Paid for March..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-primary focus:border-primary outline-none min-h-[80px]"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full py-3 flex items-center justify-center gap-2">
              <FiUploadCloud /> {submitting ? 'Uploading...' : 'Upload Payment Receipt'}
            </Button>
          </form>
        )}

        <div className="border-t border-gray-100 pt-6">
          {!messageMode ? (
            <button
              onClick={() => setMessageMode(true)}
              className="text-primary hover:text-primary/80 font-medium flex items-center justify-center w-full gap-2 transition-colors"
            >
              <FiMessageSquare /> Contact Sir
            </button>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <h3 className="font-semibold text-gray-800">Send Message to Sir</h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Sir, I already paid. Please check my receipt..."
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-primary focus:border-primary outline-none min-h-[100px]"
                required
              />
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setMessageMode(false)} className="w-1/2">
                  Cancel
                </Button>
                <Button type="submit" disabled={sendingMessage} className="w-1/2">
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
