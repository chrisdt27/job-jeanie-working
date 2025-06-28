// pages/messages/[job_id].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';

export default function MessagesPage() {
  const router = useRouter();
  const { job_id } = router.query;
  const { user } = useUser();

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!job_id || !user) return;
    fetchMessages();
  }, [job_id, user]);

  async function fetchMessages() {
    try {
      const token = await user?.getToken();
      const res = await fetch(`/api/fetch-messages?job_id=${job_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setMessages(data);
      else console.error('Error fetching messages:', data.error);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setLoading(true);
    try {
      const token = await user?.getToken();
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ job_id, content: newMessage }),
      });
      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      } else {
        const data = await res.json();
        console.error('Send failed:', data.error);
      }
    } catch (err) {
      console.error('Send error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="border rounded p-4 h-96 overflow-y-scroll mb-4 bg-white">
        {messages.length > 0 ? (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded-md text-sm max-w-sm ${
                msg.sender_id === user?.id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
              }`}
            >
              {msg.content}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages yet</p>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border rounded px-3 py-2"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
