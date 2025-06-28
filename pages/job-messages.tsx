// pages/job-messages.tsx

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';

export default function JobMessagesPage() {
  const router = useRouter();
  const { user } = useUser();
  const { jobId } = router.query;

  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [recipientId, setRecipientId] = useState('user_123'); // Replace with valid test recipient ID as needed

  const fetchMessages = async () => {
    if (!jobId) return;
    try {
      const response = await fetch(`/api/messages?job_id=${jobId}`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error('Expected array, got:', data);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [jobId]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message before sending.');
      return;
    }

    const newMessage = {
      id: Date.now(),
      job_id: jobId,
      recipient_id: recipientId,
      sender_id: user?.id || 'unknown',
      message: messageText,
      created_at: new Date().toISOString(),
    };

    try {
      setMessages((prev) => [...prev, newMessage]);

      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          recipient_id: recipientId,
          message: messageText,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessageText('');
        fetchMessages();
        toast.success('✅ Message sent successfully');
      } else {
        console.error('Error sending message:', data);
        toast.error(`❌ ${data.error || 'Error sending message'}`);
        setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('❌ Error sending message. Please try again.');
      setMessages((prev) => prev.filter((msg) => msg.id !== newMessage.id));
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      {/* Back to Dashboard */}
      <button
        onClick={() => router.push('/dashboard')}
        style={{
          marginBottom: '10px',
          padding: '8px 12px',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        ← Back to Dashboard
      </button>

      <h1>Job Messages</h1>

      {/* Message List */}
      <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {Array.isArray(messages) && messages.length === 0 && <p>No messages yet.</p>}
        {Array.isArray(messages) &&
          messages.map((msg) => {
            const isSender = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                style={{
                  alignSelf: isSender ? 'flex-end' : 'flex-start',
                  backgroundColor: isSender ? '#0070f3' : '#e5e5ea',
                  color: isSender ? '#fff' : '#000',
                  padding: '10px 14px',
                  borderRadius: '18px',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                  position: 'relative',
                }}
              >
                <div>{msg.message}</div>
                <div
                  style={{
                    fontSize: '0.7em',
                    marginTop: '4px',
                    textAlign: 'right',
                    opacity: 0.7,
                  }}
                >
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
            );
          })}
      </div>

      {/* Message Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <textarea
          rows={3}
          placeholder="Type your message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '10px',
            border: '1px solid #ccc',
            resize: 'vertical',
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px',
            backgroundColor: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1em',
          }}
        >
          Send Message
        </button>
      </div>
    </div>
  );
}
