// TrackProgressPage.jsx  –  ADMIN view
import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../config';          // <-- your base url
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Ionicons } from '@expo/vector-icons';

const BAR_OK = '#388E3C';
const BAR_WARN = '#FFA000';
const BAR_BAD = '#D32F2F';

// ────────────────────────────────────────────────────────────────────────────────
// Helper – get % completed toward licence requirements
const progressForLicence = (earnedCertIds, requiredCertIds) => {
  if (requiredCertIds.length === 0) return 0;
  const done = requiredCertIds.filter(id => earnedCertIds.has(id)).length;
  return Math.round((done / requiredCertIds.length) * 100);
};

// ────────────────────────────────────────────────────────────────────────────────
const TrackProgressPage = ({ navigation }) => {
  const [guides, setGuides]   = useState([]);    // hydrated guide cards
  const [loading, setLoading] = useState(true);

  // ─── initial load ────────────────────────────────────────────────────────────
  useEffect(() => { loadAllGuides(); }, []);

  const LICENSE_PRIORITY = ['Junior Guide', 'Senior Guide', 'Master'];

  const loadAllGuides = async () => {
    try {
      setLoading(true);

      // 1️⃣ fetch approved users who are guides
      const { data: approved } = await axios.get(
        `${API_URL}/api/users?approved=1&role=guide`
      );

      // 2️⃣ hydrate every guide in parallel
      const enriched = await Promise.all(
        approved.map(async user => {
          // guide_id ↔ user_id
          const response = (
            await axios.get(`${API_URL}/api/guides/guide-id?userId=${user.user_id}`)
          )
          const guide_id = response.data;

          // course history (pass / fail)
          const courseHist = await axios.get(
            `${API_URL}/api/training_course/course-history/${user.user_id}`
          );
          
          // still-enrolled courses
          const enrolledRows = await axios.get(
            `${API_URL}/api/training_course/guide-course-status?guide_id=${guide_id.guide_id}`
          );
          
          // earned cert IDs
          const earnedCertRes = await axios.get(
            `${API_URL}/api/training_course/guide-cert-ids?guide_id=${guide_id.guide_id}`
          );
          
          const earnedSet = new Set(earnedCertRes.data.certificateIds);
          
          // licences he can request right now
          const eligibleLic = await axios.get(
            `${API_URL}/api/license/promptable/${user.user_id}`
          );
          
          // last (or current) licence row – to check expiry
          const licRows = await axios.get(
            `${API_URL}/api/license/by-guide/${user.user_id}`
          );
          
          const approvedLicenses = licRows.data.filter(lic => lic.approvedAt !== null);
          const latestLic = approvedLicenses.length ? approvedLicenses[0] : null;
          
          const willExpire = latestLic &&
            latestLic.expiry_date &&
            moment(latestLic.expiry_date).diff(moment(), 'days') <= 30;

          // data needed for progress bar – pick the FIRST licence he’s “working on”
          let workingLicence = null;
          if (eligibleLic.data.length) {
            eligibleLic.data.sort((a, b) =>
              LICENSE_PRIORITY.indexOf(a.licenseName) - LICENSE_PRIORITY.indexOf(b.licenseName)
            );
            workingLicence = eligibleLic.data[eligibleLic.data.length - 1]; // highest level
          }
          else if (latestLic) workingLicence = latestLic;

          let progressPct = 0;
          if (workingLicence) {
            // fetch its requirement cert IDs
            const reqRes = await axios.get(
              `${API_URL}/api/license/requirements/${workingLicence.licenseId}`
            );
            const requirementIds = reqRes.data.certificateIds || [];
            progressPct = progressForLicence(earnedSet, requirementIds);
          }

          return {
            user,
            guide_id,
            courseHist: courseHist.data,
            enrolled:  enrolledRows.data,   // [{ courseId, status }, …]
            eligibleLic: eligibleLic.data,  // licences he can request
            latestLic,
            willExpire,
            workingLicence,
            progressPct,
          };
        })
      );

      setGuides(enriched);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load guide data.');
    } finally {
      setLoading(false);
    }
  };

  // ────────────── POST helper to send admin-notification ──────────────
  const sendAdminMessage = async (type, recipientUid, subj, msg) => {
    try {
      await axios.post(`${API_URL}/api/notification`, {
        type: type,
        sender: 'Admin',
        recipient: recipientUid,
        subject: subj,
        message: msg,
      });
      Alert.alert('Sent', 'Notification has been delivered.');
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not send notification');
    }
  };

  // ────────────── card ui per guide ────────────────────────────────────
  const GuideCard = memo(({ g }) => {
    const name = g.user.name;
    const barColour =
      g.progressPct === 100 ? BAR_OK : g.progressPct >= 60 ? BAR_WARN : BAR_BAD;

    // build course summary blocks: pass / fail
    const courseBlocks = g.courseHist.map(ch => {
      const pass = ch.result.toLowerCase() === 'passed';
      return (
        <View key={ch.id} style={styles.courseContainer}>
          <Text style={[
            styles.courseText,
            pass ? styles.completed : styles.incomplete,
          ]}>
            {ch.courseTitle}
          </Text>
          <Text style={[
            styles.courseStatus,
            pass ? styles.completedText : styles.incompleteText,
          ]}>
            {pass ? '✅ Passed' : '❌ Failed'}
          </Text>
        </View>
      );
    });

    // what primary action?
    let primaryBtn      = null;
    let primaryBtnTitle = '';
    let onPrimaryPress  = () => {};
    if (g.eligibleLic.length) {
      // He can request a licence now
      primaryBtnTitle = `Prompt to Request “${g.eligibleLic[g.eligibleLic.length-1].licenseName}”`;
      onPrimaryPress  = () =>
        sendAdminMessage(
          'Message',
          g.user.user_id,
          'Licence Eligibility',
          `You now meet all requirements for the ${g.eligibleLic[g.eligibleLic.length-1].licenseName} licence. Please submit your request.` );
    } else if (g.willExpire) {
      primaryBtnTitle = 'Send Renewal Reminder';
      onPrimaryPress  = () =>
        sendAdminMessage(
          'License Expiry',
          g.user.user_id,
          'Licence renewal reminder',
          'Your guide licence will expire in less than one month. Please renew it as soon as possible.' );
    }

    return (
      <View style={[styles.card, { borderLeftColor: barColour }]}>
        {/* header */}
        <Text style={styles.sectionTitle}>👤 {name}</Text>

        {/* progress */}
        <View style={styles.progressWrapper}>
          <View style={styles.progressBarBackground}>
            <View style={[
              styles.progressBarFill,
              { width: `${g.progressPct}%`, backgroundColor: barColour },
            ]}/>
          </View>
          <Text style={styles.progressText}>
            {g.workingLicence
              ? `${g.progressPct}% toward ${g.workingLicence.licenseName}`
              : 'No active licence goal'}
          </Text>
        </View>

        {/* course pass / fail list */}
        {courseBlocks}

        {/* action buttons */}
        {primaryBtnTitle ? (
          <TouchableOpacity style={styles.actionButton} onPress={onPrimaryPress}>
            <Text style={styles.buttonText}>{primaryBtnTitle}</Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#6A1B9A', marginTop: 8 }]}
          onPress={() =>
            navigation.navigate('FeedbackHome', {
              guideId: g.guide_id,
              userId : g.user.user_id,
            })
          }>
          <Text style={styles.buttonText}>View Feedback</Text>
        </TouchableOpacity>
      </View>
    );
  });

  // ────────────── render root ─────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#2f855a" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Guide Course Progress</Text>

      {guides.length === 0 ? (
        <Text>No approved guides found.</Text>
      ) : (
        guides.map(g => <GuideCard key={g.user.user_id} g={g} />)
      )}
    </ScrollView>
  );
};

// ────────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f7f0', padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#2f855a',
    marginTop: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#6A1B9A',
  },
  progressWrapper: { marginBottom: 15 },
  progressBarBackground: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: { height: 10, borderRadius: 5 },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  courseContainer: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  courseText: { fontSize: 16 },
  completed:   { color: BAR_OK,   fontWeight: '600' },
  incomplete:  { color: BAR_BAD,  fontWeight: '600' },
  courseStatus:{ fontSize: 14 },
  completedText:{ color: BAR_OK },
  incompleteText:{ color: BAR_BAD },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default TrackProgressPage;
