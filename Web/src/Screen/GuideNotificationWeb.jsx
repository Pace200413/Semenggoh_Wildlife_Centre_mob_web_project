// Enhanced UI Design: GuideNotificationWeb ReactJS
import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useLocation } from 'react-router-dom';

export default function GuideNotificationWeb() {
  const location = useLocation();
  const { userId, role } = location.state || {};
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('Inbox');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showCompose, setShowCompose] = useState(false);

  const [recipientNameInput, setRecipientNameInput] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recipientId, setRecipientId] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/api/notification?userId=${userId}&role=${role}`)
      .then(res => res.json())
      .then(data => setNotifications(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, [userId, role]);

  const filteredNotifications = notifications.filter((item) => {
    const matchesView = viewMode === 'Inbox'
      ? (item.recipient?.toString() === userId?.toString() || item.recipient === 'All Guides')
      : item.sender?.toString() === userId?.toString();
    const matchesFilter = filterType === 'All' || item.type === filterType;
    const matchesSearch =
      (item.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesView && matchesFilter && matchesSearch;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>{role === 'guide' ? 'Guide' : 'Visitor'} Notifications</h2>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, margin: '20px 0' }}>
        <button onClick={() => setViewMode('Inbox')} style={{ padding: '10px 20px', backgroundColor: viewMode === 'Inbox' ? '#3498db' : '#bdc3c7', color: '#fff', border: 'none', borderRadius: '6px' }}>Inbox</button>
        <button onClick={() => setViewMode('Sent')} style={{ padding: '10px 20px', backgroundColor: viewMode === 'Sent' ? '#3498db' : '#bdc3c7', color: '#fff', border: 'none', borderRadius: '6px' }}>Sent</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="All">All</option>
          <option value="Message">Message</option>
          <option value="Announcement">Announcement</option>
          <option value="Certification">Certification</option>
          <option value="License Expiry">License Expiry</option>
          <option value="Cancel Request">Cancel Request</option>
        </select>
        <input
          type="text"
          placeholder="Search by subject or message"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: 8, flex: 1, borderRadius: 6, border: '1px solid #ccc' }}
        />
      </div>

      {filteredNotifications.length === 0 && <p style={{ color: '#999', textAlign: 'center' }}>No notifications found.</p>}

      {filteredNotifications.map((item) => (
        <div key={item.id} style={{ backgroundColor: '#ecf0f1', padding: 16, marginBottom: 12, borderRadius: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <strong style={{ color: '#2c3e50' }}>{item.type}</strong> - <span style={{ fontSize: 13 }}>{new Date(item.date).toLocaleDateString()}</span><br />
          <span style={{ display: 'block', marginTop: 6 }}>{viewMode === 'Inbox' ? `From: ${item.senderName}` : `To: ${item.recipient_name}`}</span>
          {item.subject && <span style={{ display: 'block', marginTop: 4 }}>Subject: {item.subject}</span>}
          {item.message && <span style={{ display: 'block', marginTop: 4 }}>Message: {item.message}</span>}
          <button onClick={() => setSelectedNotification(item)} style={{ marginTop: 10, backgroundColor: '#2980b9', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: 6 }}>View</button>
        </div>
      ))}

      {selectedNotification && (
        <div style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10, border: '1px solid #ccc', marginTop: 20 }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: 6 }}>{selectedNotification.type}</h3>
          <p><strong>From:</strong> {selectedNotification.sender}</p>
          <p><strong>To:</strong> {selectedNotification.recipient_name}</p>
          <p><strong>Subject:</strong> {selectedNotification.subject}</p>
          <p><strong>Message:</strong> {selectedNotification.message}</p>
          <button onClick={() => setSelectedNotification(null)} style={{ marginTop: 10, backgroundColor: '#e74c3c', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: 6 }}>Close</button>
        </div>
      )}

      <button onClick={() => setShowCompose(true)} style={{ marginTop: 30, backgroundColor: '#27ae60', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: 6 }}>Send Message</button>

      {showCompose && (
        <div style={{ border: '1px solid #ccc', padding: 20, marginTop: 20, borderRadius: 10, backgroundColor: '#fdfdfd' }}>
          <h3>Send Message</h3>
          <input
            type="text"
            placeholder="Search recipient by name"
            value={recipientNameInput}
            onChange={async (e) => {
              const text = e.target.value;
              setRecipientNameInput(text);
              if (text.length > 0) {
                try {
                  const res = await fetch(`${API_URL}/api/notification/search-users?query=${text}`);
                  const data = await res.json();
                  setSearchResults(data);
                } catch (err) {
                  console.error(err);
                  setSearchResults([]);
                }
              } else {
                setSearchResults([]);
              }
            }}
            style={{ padding: 8, width: '100%', borderRadius: 6, marginBottom: 5 }}
          />
          {searchResults.map((user) => (
            <div
              key={user.user_id}
              onClick={() => {
                setRecipientId(user.user_id.toString());
                setRecipientNameInput(user.name);
                setSearchResults([]);
              }}
              style={{ cursor: 'pointer', padding: 5, backgroundColor: '#eee', marginTop: 2, borderRadius: 4 }}
            >
              {user.name} ({user.role})
            </div>
          ))}

          <input
            type="text"
            placeholder="Subject"
            value={subjectInput}
            onChange={(e) => setSubjectInput(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, borderRadius: 6, marginTop: 10 }}
          />
          <textarea
            placeholder="Message"
            rows={4}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            style={{ display: 'block', width: '100%', marginTop: 10, padding: 8, borderRadius: 6 }}
          ></textarea>

          <button
            onClick={async () => {
              try {
                const response = await fetch(`${API_URL}/api/notification`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: 'Message',
                    sender: userId,
                    recipient: recipientId,
                    subject: subjectInput,
                    message: messageInput,
                  }),
                });

                if (response.ok) {
                  alert('Message sent');
                  setShowCompose(false);
                  setRecipientId('');
                  setRecipientNameInput('');
                  setSubjectInput('');
                  setMessageInput('');
                } else {
                  alert('Failed to send message');
                }
              } catch (err) {
                console.error(err);
                alert('Error sending message');
              }
            }}
            style={{ marginTop: 12, backgroundColor: '#2980b9', color: '#fff', padding: '8px 16px', border: 'none', borderRadius: 6 }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
