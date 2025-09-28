import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
} from 'react-native';
import { MaterialIcons, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // or use fetch
import { API_URL } from '../config';

const { width } = Dimensions.get('window');

export default function AdminHomeScreen({ navigation, route }) {
  const [eligibleGuides, setEligibleGuides] = useState([]);
  const [pendingGuides, setPendingGuides] = useState([]);

  const LICENSE_PRIORITY = ['Junior Guide', 'Senior Guide', 'Master'];

  useEffect(() => {
    const fetchPendingGuides = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/guides/pending`); // change to your endpoint
        setPendingGuides(res.data);
      } catch (error) {
        console.error('Failed to fetch pending guides:', error);
      }
    };

    const fetchEligibleGuides = async () => {
      try {
        // 1️⃣ all approved users with role=guide
        const { data: approved } = await axios.get(
          `${API_URL}/api/users?approved=1&role=guide`
        );

        // 2️⃣ in parallel ask whether each can prompt for a licence
        const enriched = await Promise.all(
          approved.map(async (u) => {
            const { data: lic } = await axios.get(
              `${API_URL}/api/license/promptable/${u.user_id}`
            );
            
            let workingLicence;
            if (lic.length) {
              lic.sort((a, b) =>
                LICENSE_PRIORITY.indexOf(a.licenseName) - LICENSE_PRIORITY.indexOf(b.licenseName)
              );
              workingLicence = lic[lic.length - 1]; // highest level
            }
            // lic = [] (not eligible) or [{licenseId, licenseName, …}, …]
            return lic.length ? { user: u, nextLicence: workingLicence } : null;
          })
        );

        setEligibleGuides(enriched.filter(Boolean)); // drop nulls
      } catch (err) {
        console.error('[eligible] fetch error', err);
      }
    };

    fetchPendingGuides();
    fetchEligibleGuides();
  }, []);

  const approveAllPendingGuides = async () => {
    Alert.alert('Approve All', 'Are you sure you want to approve all pending guides?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Approve',
        onPress: async () => {
          try {
            // Send API request to approve all
            await axios.put(`${API_URL}/api/guides/approve-all`);

            // Move them to main guides list and clear pending
            const approved = pendingGuides.map(g => ({
              ...g,
              approved: 1,
              courses: [],
              newGuide: true, // or false if they've been active before
            }));
            setGuides(prev => [...prev, ...approved]);
            setPendingGuides([]);
          } catch (err) {
            console.error('Failed to approve guides:', err);
            Alert.alert('Error', 'Failed to approve guides. Please try again.');
          }
        },
      },
    ]);
  };

  const getIconComponent = (iconName) => {
    const materialIcons = ['assignment', 'verified', 'people', 'person'];
    const fontAwesome5 = ['id-card', 'book-open'];
    const fontAwesome = ['book', 'address-card', 'clipboard'];

    if (materialIcons.includes(iconName)) return MaterialIcons;
    if (fontAwesome5.includes(iconName)) return FontAwesome5;
    if (fontAwesome.includes(iconName)) return FontAwesome;

    return FontAwesome;
  };

  const userId = route.params.userId;
  
  const navItems = [
    { label: 'Assign Course', icon: 'assignment', screen: 'GuideList', params: { setSelectedTab: 'assign', userId: userId } },
    { label: 'Issue License', icon: 'verified', screen: 'GuideList', params: { setSelectedTab: 'issue', userId: userId } },
    { label: 'Add Course', icon: 'book', screen: 'AddCoursePage', params: { userId: userId } },
    { label: 'Guide Management', icon: 'people', screen: 'GuideList', params: { userId: userId } },
    { label: 'Tracking', icon: 'clipboard', screen: 'TPPage' },
    { label: 'Courses', icon: 'book-open', screen: 'GuideList', params: { setSelectedTab: 'course', userId: userId } },
    { label: 'Personal Page', icon: 'person', screen: 'AdminPer', params: { userId: userId } },
    { label: 'IoT Dashboard', icon: 'wifi', screen: 'AdminIoTDashboard', params: { userId: userId } },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
    <View style={styles.leftSection}>
      <Image source={require('../assets/images/logo.jpg')} style={styles.logo} />
      <View>
        <Text style={styles.title}>Semenggoh</Text>
        <Text style={styles.title}>Wildlife Centre</Text>
      </View>
    </View>
    <View style={styles.rightSection}>
      <TouchableOpacity onPress={() => navigation.navigate('AdminNote')}>
        <Ionicons name="notifications" size={34} color="white" style={styles.logo1} />
      </TouchableOpacity>
    </View>
  </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        <Text style={styles.pageTitle}>Admin Dashboard</Text>

        <View style={styles.grid}>
          {navItems.map(({ label, icon, screen, params }, index) => {
            const IconComponent = getIconComponent(icon);
            return (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => navigation.navigate(screen, params)}
              >
                <IconComponent name={icon} size={28} color="#2f855a" />
                <Text style={styles.buttonText}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Eligible Guides */}
        <Text style={styles.pageTitle1}>Eligible Guides</Text>
        {eligibleGuides.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="check-circle" size={48} color="#4CAF50" />
            <Text style={styles.emptyText}>No eligible guides</Text>
            <Text style={styles.emptySubtext}>
              All guides are up to date or still need requirements
            </Text>
          </View>
        ) : (
          eligibleGuides.map(({ user, nextLicence }) => (
            <View key={user.user_id} style={styles.guideCard}>
              <Text style={styles.guideCardText}>{user.name}</Text>
              <Text style={styles.guideCardDate}>
                Ready for&nbsp;
                <Text style={{ fontWeight: 'bold' }}>
                  {nextLicence.licenseName}
                </Text>
              </Text>
              <TouchableOpacity
                style={[styles.actionButton, styles.practicalButton]}
                onPress={() =>
                  navigation.navigate('GuideList', {
                    setSelectedTab: 'issue',
                    userId,
                  })
                }
              >
                <Text style={styles.actionButtonText}>Issue Licence</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {pendingGuides.length > 0 && (
        <>
          <Text style={styles.pageTitle1}>Pending Guide Approvals</Text>

          <TouchableOpacity
            style={[styles.actionButton, styles.practicalButton, { marginBottom: 15, width: '100%' }]}
            onPress={approveAllPendingGuides}
          >
            <Text style={styles.actionButtonText}>Approve All</Text>
          </TouchableOpacity>

          <View style={styles.grid}>
            {pendingGuides.map((guide) => (
              <View key={guide.id} style={styles.guideCard}>
                <Text style={styles.guideCardText}>{guide.name}</Text>
                <Text style={styles.guideCardDate}>Awaiting Admin Approval</Text>
              </View>
            ))}
          </View>
        </>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f7f0' },
  header: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? 80 + (StatusBar.currentHeight || 0) : 100,
    backgroundColor: '#2f855a',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 3,
    zIndex: 1,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop:50,
    paddingleft:20,
  },
  logo: { width: 60, height: 80, marginRight: 10 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollArea: {
    paddingTop: Platform.OS === 'android' ? 90 + (StatusBar.currentHeight || 0) : 120,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logo1: { width: 35, height: 75, marginRight: 10 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  scrollArea: {
    paddingTop: Platform.OS === 'android' ? 90 + (StatusBar.currentHeight || 0) : 120,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
  },
  pageTitle1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 20,
    marginTop: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    backgroundColor: '#fff',
    width: width / 3 - 30,
    height: 110,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  buttonText: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  guideCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 12,
    elevation: 2,
    marginBottom: 10,
    padding: 15,
    alignItems: 'center',
  },
  guideCardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2f855a',
  },
  guideCardDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  renewalActions: {
    width: '100%',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  practicalButton: {
    backgroundColor: '#2f855a',
  },
  renewButton: {
    backgroundColor: '#2f855a',
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f855a',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
  },
});