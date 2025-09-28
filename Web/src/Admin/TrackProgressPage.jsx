import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { API_URL } from '../config';

export function TrackProgressPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const LICENSE_PRIORITY = ['Junior Guide', 'Senior Guide', 'Master'];

  useEffect(() => { loadAllGuides(); }, []);

  const loadAllGuides = async () => {
    try {
      setLoading(true);
      const { data: approved } = await axios.get(`${API_URL}/api/users?approved=1&role=guide`);
      const enriched = await Promise.all(
        approved.map(async user => {
          const { data: guideId } = await axios.get(`${API_URL}/api/guides/guide-id?userId=${user.user_id}`);
          const { data: courseHist } = await axios.get(`${API_URL}/api/training_course/course-history/${user.user_id}`);
          const { data: enrolled } = await axios.get(`${API_URL}/api/training_course/guide-course-status?guide_id=${guideId.guide_id}`);
          const { data: certData } = await axios.get(`${API_URL}/api/training_course/guide-cert-ids?guide_id=${guideId.guide_id}`);
          const earnedSet = new Set(certData.certificateIds);
          const { data: eligibleLic } = await axios.get(`${API_URL}/api/license/promptable/${user.user_id}`);
          const { data: licRows } = await axios.get(`${API_URL}/api/license/by-guide/${user.user_id}`);

          const approvedLicenses = licRows.filter(lic => lic.approvedAt !== null);
          const latestLic = approvedLicenses.length ? approvedLicenses[0] : null;
          const willExpire = latestLic && latestLic.expiry_date && moment(latestLic.expiry_date).diff(moment(), 'days') <= 30;

          let workingLicence = null;
          if (eligibleLic.length) {
            eligibleLic.sort((a, b) => LICENSE_PRIORITY.indexOf(a.licenseName) - LICENSE_PRIORITY.indexOf(b.licenseName));
            workingLicence = eligibleLic[eligibleLic.length - 1];
          } else if (latestLic) workingLicence = latestLic;

          let progressPct = 0;
          if (workingLicence) {
            const { data: reqs } = await axios.get(`${API_URL}/api/license/requirements/${workingLicence.licenseId}`);
            const requirementIds = reqs.certificateIds || [];
            const done = requirementIds.filter(id => earnedSet.has(id)).length;
            progressPct = Math.round((done / requirementIds.length) * 100);
          }

          return { user, guide_id: guideId.guide_id, courseHist, enrolled, eligibleLic, latestLic, willExpire, workingLicence, progressPct };
        })
      );

      setGuides(enriched);
    } catch (err) {
      console.error(err);
      alert('Failed to load guide data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={trackStyles.container}>
      <h2 style={trackStyles.title}>Guide Course Progress</h2>
      {loading ? <p>Loading...</p> : guides.length === 0 ? <p>No approved guides found.</p> : guides.map(g => (
        <div key={g.user.user_id} style={{ ...trackStyles.card, borderLeft: `10px solid ${getBarColor(g.progressPct)}` }}>
          <h3 style={trackStyles.sectionTitle}>👤 {g.user.name}</h3>

          <div style={trackStyles.progressWrapper}>
            <div style={trackStyles.progressBarBackground}>
              <div style={{ ...trackStyles.progressBarFill, width: `${g.progressPct}%`, backgroundColor: getBarColor(g.progressPct) }} />
            </div>
            <p style={trackStyles.progressText}>
              {g.workingLicence ? `${g.progressPct}% toward ${g.workingLicence.licenseName}` : 'No active licence goal'}
            </p>
          </div>

          {g.courseHist.map(ch => (
            <div key={ch.id} style={trackStyles.courseContainer}>
              <span style={{ ...trackStyles.courseText, color: ch.result.toLowerCase() === 'passed' ? '#388E3C' : '#D32F2F' }}>
                {ch.courseTitle}
              </span>
              <span style={trackStyles.courseStatus}>
                {ch.result.toLowerCase() === 'passed' ? '✅ Passed' : '❌ Failed'}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

const getBarColor = (progress) => {
  if (progress === 100) return '#388E3C';
  if (progress >= 60) return '#FFA000';
  return '#D32F2F';
};

const trackStyles = {
  container: { backgroundColor: '#f3f7f0', padding: 20, minHeight: '100vh' },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 30, color: '#2f855a' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 25, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#6A1B9A', marginBottom: 15 },
  progressWrapper: { marginBottom: 15 },
  progressBarBackground: { height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: 10, borderRadius: 5 },
  progressText: { marginTop: 5, fontSize: 14, color: '#333', fontWeight: '500' },
  courseContainer: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  courseText: { fontSize: 16, fontWeight: '600' },
  courseStatus: { fontSize: 14 },
};
