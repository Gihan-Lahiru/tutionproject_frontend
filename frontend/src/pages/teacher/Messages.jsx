import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { Mail, Check, Reply } from 'lucide-react';
import Button from '../../components/UI/Button';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [submittingReply, setSubmittingReply] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages');
      setMessages(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId) => {
    const text = replyText[messageId];
    if (!text || !text.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    setSubmittingReply(messageId);
    try {
      await api.put(`/messages/${messageId}/reply`, { reply: text });
      toast.success('Reply sent successfully');
      setReplyText(prev => ({ ...prev, [messageId]: '' }));
      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error('Failed to send reply');
    } finally {
      setSubmittingReply(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Messages</h1>
        <p className="text-gray-600 mt-1">Manage and reply to payment block requests</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Mail className="h-12 w-12 text-gray-300 mb-4" />
            <p>No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div key={msg.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{msg.student?.name || 'Unknown Student'}</h3>
                    <p className="text-sm text-gray-500">{msg.student?.email || 'No email'}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    msg.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {msg.status === 'replied' ? 'Replied' : 'Pending Reply'}
                  </span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm mb-4 border border-gray-100">
                  {msg.message}
                </div>

                {msg.status === 'replied' ? (
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-blue-800 mb-1 flex items-center gap-1"><Check size={14} /> Your Reply:</p>
                    <p className="text-sm text-blue-900">{msg.adminReply}</p>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                      placeholder="Type your reply to the student..."
                      value={replyText[msg.id] || ''}
                      onChange={(e) => setReplyText(prev => ({ ...prev, [msg.id]: e.target.value }))}
                    />
                    <Button 
                      onClick={() => handleReply(msg.id)} 
                      disabled={submittingReply === msg.id}
                      className="flex items-center gap-2"
                    >
                      <Reply size={16} />
                      {submittingReply === msg.id ? 'Sending...' : 'Send Reply'}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
