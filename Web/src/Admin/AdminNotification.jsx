import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const AdminNotificationPage = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('Inbox');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showCompose, setShowCompose] = useState(false);
  const [recipientNameInput, setRecipientNameInput] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messageType, setMessageType] = useState('Message');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notification?userId=${userId}`);
      const data = await response.json();
      if (Array.isArray(data)) setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };


  const filteredNotifications = notifications.filter((item) => {
    const matchesView =
      viewMode === 'Inbox'
        ? item.recipient?.toString() === userId?.toString() || item.recipient === 'Admin'
        : item.sender?.toString() === userId?.toString() || item.sender.toString() === 'Admin';
    const matchesType = filterType === 'All' || item.type === filterType;
    const matchesSearch =
      (item.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.type || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesView && matchesType && matchesSearch;
  });

  return (
    <div style={styles.container}>
      <h2>Admin Notifications</h2>

      <div style={styles.tabContainer}>
        {['Inbox', 'Sent'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            style={{
              ...styles.tab,
              backgroundColor: viewMode === mode ? '#3498db' : '#ccc',
              color: viewMode === mode ? 'white' : 'black'
            }}
          >
            {mode}
          </button>
        ))}
      </div>

      <div style={styles.filterSection}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={styles.select}
        >
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
          style={styles.input}
        />
      </div>

      <div style={styles.list}>
        {filteredNotifications.map((item) => (
          <div
            key={item.id}
            style={styles.card}
            onClick={() => {
              setSelectedNotification(item);
              setShowModal(true);
            }}
          >
            <h4>{item.type}</h4>
            <small>{new Date(item.date).toLocaleDateString()}</small>
            <p>{viewMode === 'Inbox' ? `From: ${item.senderName}` : `To: ${item.recipient_name}`}</p>
            {item.subject && <p><strong>Subject:</strong> {item.subject}</p>}
            {item.message && <p>{item.message}</p>}
          </div>
        ))}
      </div>

      {showModal && selectedNotification && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>{selectedNotification.type}</h3>
            <p><strong>From:</strong> {selectedNotification.sender}</p>
            <p><strong>To:</strong> {selectedNotification.recipient_name}</p>
            {selectedNotification.subject && (
              <p><strong>Subject:</strong> {selectedNotification.subject}</p>
            )}
            <p><strong>Message:</strong> {selectedNotification.message}</p>
            <button onClick={() => setShowModal(false)} style={styles.closeButton}>Close</button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowCompose(true)}
        style={{
          marginTop: 30,
          backgroundColor: '#27ae60',
          color: '#fff',
          padding: '10px 20px',
          border: 'none',
          borderRadius: 6
        }}
      >
        Send Message
      </button>

      {showCompose && (
        <div style={{ border: '1px solid #ccc', padding: 20, marginTop: 20, borderRadius: 10, backgroundColor: '#fdfdfd' }}>
          <h3>Send Notification</h3>

          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            style={{ padding: 8, width: '100%', borderRadius: 6, marginBottom: 10 }}
          >
            <option value="Message">Private Message</option>
            <option value="Announcement">Announcement (All Guides)</option>
          </select>

          {messageType === 'Message' && (
            <>
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
            </>
          )}

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
              if (!subjectInput || !messageInput || (messageType === 'Message' && !recipientId)) {
                alert('Please fill in all required fields.');
                return;
              }

              try {
                const recipientValue = messageType === 'Announcement' ? 'All Guides' : recipientId;
                const response = await fetch(`${API_URL}/api/notification`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    type: messageType,
                    sender: 'Admin',
                    recipient: recipientValue,
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
                  setMessageType('Message');
                  setSearchResults([]);
                  fetchNotifications(); // refresh inbox
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
};

const styles = {
  container: {
    padding: 20,
    backgroundColor: '#fdfdfd',
    fontFamily: 'Arial'
  },
  tabContainer: {
    marginBottom: 20
  },
  tab: {
    padding: '10px 20px',
    marginRight: 10,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer'
  },
  filterSection: {
    display: 'flex',
    gap: '10px',
    marginBottom: 20
  },
  select: {
    padding: 10,
    borderRadius: 5
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    border: '1px solid #ccc'
  },
  list: {
    display: 'grid',
    gap: '15px'
  },
  card: {
    padding: 15,
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    width: '90%',
    maxWidth: 500
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer'
  }
};

export default AdminNotificationPage;
