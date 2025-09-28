import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';


const GuideNotification = ({navigation, route}) => {
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const [subjectInput, setSubjectInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recipientNameInput, setRecipientNameInput] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterType, setFilterType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('Inbox'); // 'Inbox' or 'Sent'

  useFocusEffect(
    useCallback(() => {
      const fetchNotifications = async () => {
        try {
          const response = await fetch(`${API_URL}/api/notification?userId=${route?.params?.userId}&role=${route?.params?.role}`);
          const data = await response.json();
          setNotifications(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
        }
      };

      fetchNotifications();
    }, [route?.params?.userId])
  );


  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`${API_URL}/api/notification?userId=${route?.params?.userId}&role=${route?.params?.role}`);
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setNotifications(data);
        } else {
          console.warn('Expected array, got:', data);
          setNotifications([]);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        setNotifications([]); // fallback
      }
    };
  

    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((item) => {
    const matchesView = viewMode === 'Inbox' ? (item.recipient?.toString() === route?.params?.userId?.toString() || item.recipient == 'All Guides') : item.sender?.toString() === route?.params?.userId.toString();
    const matchesFilter = filterType === 'All' || item.type === filterType;
    const matchesSearch =
      (item.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subject || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesView && matchesFilter && matchesSearch;
  });


  const renderItem = ({ item }) => {
    const content = (
      <>
        <Text style={styles.title}>{item.type}</Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
        {(item.type === 'Announcement') && (
          <>
            <Text>
              {viewMode === 'Inbox' ? `From: ${item.senderName}` : `To: ${item.recipient_name}`}
            </Text>
            {item.subject && <Text>Subject: {item.subject}</Text>}
            {item.message && <Text>Message: {item.message}</Text>}
          </>
        )}
        {(item.type === 'Message' || item.type === 'License' || item.type === 'Certification' || item.type =='License Expiry' || item.type =='Cancel Request') && (
          <>
            <Text>
              {viewMode === 'Inbox' ? `From: ${item.senderName}` : `To: ${item.recipient_name}`}
            </Text>
            {item.subject && <Text>Subject: {item.subject}</Text>}
          </>
        )}
      </>
    );

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedNotification(item);
          setModalVisible(true);
        }}
      >
        {content}
      </TouchableOpacity>
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{route.params?.role === 'guide' ? 'Guide' : 'Visitor'} Notification</Text>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, viewMode === 'Inbox' && styles.activeTab]} 
          onPress={() => setViewMode('Inbox')}>
          <Text style={styles.tabText}>Inbox</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, viewMode === 'Sent' && styles.activeTab]} 
          onPress={() => setViewMode('Sent')}>
          <Text style={styles.tabText}>Sent</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Picker
          selectedValue={filterType}
          onValueChange={(value) => setFilterType(value)}
          style={styles.filterPicker}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Message" value="Message" />
          <Picker.Item label="Announcement" value="Announcement" />
          <Picker.Item label="Certification" value="Certification" />
          <Picker.Item label="License Expiry" value="License Expiry" />
          <Picker.Item label="Cancel Request" value="Cancel Request" />
        </Picker>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by message, subject..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.mailButton}
        onPress={() => setMessageModalVisible(true)}
      >
        <Ionicons name="mail-outline" size={30} color="white" />
      </TouchableOpacity>


      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedNotification ? (
              <ScrollView contentContainerStyle={styles.notificationDetailsContainer}>
                <Text style={styles.modalHeader}>{selectedNotification.type}</Text>

                <View style={styles.notificationBox}>
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>From:</Text> {selectedNotification.sender}
                  </Text>
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>To:</Text> {selectedNotification.recipient_name}
                  </Text>
                  {selectedNotification.subject && (
                    <Text style={styles.detailText}>
                      <Text style={styles.bold}>Subject:</Text> {selectedNotification.subject}
                    </Text>
                  )}
                  <Text style={styles.detailText}>
                    <Text style={styles.bold}>Message:</Text> {selectedNotification.message}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedNotification(null);
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      <Modal
        visible={messageModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setMessageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>Send Message</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipient by name"
              value={recipientNameInput}
              onChangeText={async (text) => {
                setRecipientNameInput(text);
                if (text.length > 0) {
                  try {
                    const response = await fetch(`${API_URL}/api/notification/search-users?query=${text}`);
                    const data = await response.json();
                    setSearchResults(data);
                  } catch (err) {
                    console.error(err);
                    setSearchResults([]);
                  }
                } else {
                  setSearchResults([]);
                }
              }}
            />

            {searchResults.map((user) => (
              <TouchableOpacity
                key={user.user_id}
                style={styles.suggestionItem}
                onPress={() => {
                  setRecipientId(user.user_id.toString());
                  setRecipientNameInput(user.name);
                  setSearchResults([]);
                }}
              >
                <Text>{user.name} ({user.role})</Text>
              </TouchableOpacity>
            ))}

            <TextInput
              style={styles.searchInput}
              placeholder="Subject"
              value={subjectInput}
              onChangeText={setSubjectInput}
            />
            <TextInput
              style={[styles.searchInput, { height: 100 }]}
              placeholder="Message"
              multiline
              value={messageInput}
              onChangeText={setMessageInput}
            />

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={async () => {
                try {
                  const response = await fetch(`${API_URL}/api/notification`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'Message',
                      sender: route?.params?.userId,
                      recipient: recipientId,
                      subject: subjectInput,
                      message: messageInput,
                    }),
                  });

                  if (response.ok) {
                    alert('Message sent');
                    setMessageModalVisible(false);
                    setRecipientId('');
                    setSubjectInput('');
                    setMessageInput('');
                  } else {
                    alert('Failed to send message');
                    setMessageModalVisible(false);
                    setRecipientId('');
                    setSubjectInput('');
                    setMessageInput('');
                  }
                } catch (err) {
                  console.error(err);
                  alert('Error sending message');
                  setMessageModalVisible(false);
                  setRecipientId('');
                  setSubjectInput('');
                  setMessageInput('');
                }
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TakeCourse', { userId: route?.params?.userId, role: route?.params?.role })}>
          <MaterialIcons name="school" size={24} color="#888" />
          <Text style={styles.navText}>Course</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('FeedbackHome', { userId: route?.params?.userId, role: route?.params?.role })}>
          <MaterialIcons name="feedback" size={24} color="#888" />
          <Text style={styles.navText}>Feedback</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuideBookingApproval', { userId: route?.params?.userId, role: route?.params?.role })}>
          <Ionicons name="calendar" size={24} color="#888" />
          <Text style={styles.navText}>My Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuideLic', { userId: route?.params?.userId, role: route?.params?.role })}>
          <FontAwesome name="id-card" size={24} color="#888" />
          <Text style={styles.navText}>License</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('GuidePer', { userId: route?.params?.userId, role: route?.params?.role })}>
          <Ionicons name="person" size={24} color="#888" />
          <Text style={styles.navText}>Guide</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 12, color: '#666', marginBottom: 6 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '95%',
    height: '85%',
    padding: 24,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  notificationDetailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  notificationBox: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    height: 540,
    overflow: 'hidden',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  filterPicker: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  mailButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'center',
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
});


export default GuideNotification;