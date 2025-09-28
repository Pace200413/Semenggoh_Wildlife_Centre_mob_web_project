// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminHomeScreen from './Admin/AdminHome';
import { AdminIoTDashboard } from './Admin/IotDashboard';
import { TrackProgressPage } from './Admin/TrackProgressPage';
import AddCoursePage from './Admin/AddCoursePage';
import GuideListPage from './Admin/GuideListPage';
import AssignCoursePage from './Admin/AssignCoursePage';
import ILSPage from './Admin/ILSPage';
import CourseInfoPage from './Admin/CourseInfoPage';
import EditCoursePage from './Admin/EditCoursePage';
import AdminPersonal from './Admin/AdminPersonal';
import AdminProfile from './Admin/AdminProfile';
import GuideHomeScreen from './Guide/GuideHomeScreen';
import CertificateView from './Guide/CertificateView';
import MyTrainingPage from './Guide/MyTrainingPage';
import GuidePersonal from './Guide/GuidePersonal';
import GuideProfile from './Guide/GuideProfile';
import GuideLicensePage from './Guide/GuideLIcensePage';
import LicenseDetailsPage from './Guide/LIcenseDetailsPage';
import RenewLicensePage from './Guide/RenewLicensePage';
import BirthdayEdit from './Screen/BirthdayEdit';
import EmailEdit from './Screen/EmailEdit';
import NameEdit from './Screen/NameEdit';
import PhoneEdit from './Screen/PhoneEdit';
import FAQScreen from './Screen/FAQScreen';
import Help from './Screen/Help';
import SPScreen from './Screen/SPScreen';
import GuideNotification from './Guide/GuideNotification';
import CourseDetail from './Screen/CourseDetail';
import AdminNotificationPage from './Admin/AdminNotification';
import LoginScreen from './Screen/LoginScreen';
import BookScreen from './Screen/BookScreen';
import GuideBookingApprovalWeb from './Screen/GuideBookingApprovalWeb';
import GuideNotificationWeb from './Screen/GuideNotificationWeb';
import FeedbackHomeWeb from './Screen/FeedbackHomeWeb';
import FeedbackHistoryWeb from './Screen/FeedbackHistoryWeb';
import FeedbackStatsWeb from './Screen/FeedbackStatsWeb';
import CoursePageWeb from './Screen/CoursePageWeb';
import GuestHomeWeb from './Guest/GuestHomeWeb';
import GuestPersonalWeb from './Guest/GuestPersonalWeb';
import GuestProfileWeb from './Guest/GuestProfileWeb';
import UserGuideWeb from './Screen/UserGuideWeb';
import SpeciesScreen from './Screen/SpeciesScreen';
import TotallyProtectedScreen from './Screen/TotallyProtectedScreen';
import ProtectedPlantsScreen from './Screen/ProtectedPlantsScreen';
import ProtectedWildlifeScreen from './Screen/ProtectedWildlifeScreen';
import ActivitiesWeb from './Guest/ActivitiesWeb';
import HomePageScreenWeb from './Screen/HomePageScreenWeb';
import ResetPasswordWeb from './Screen/ResetPasswordWeb';
import RegisterScreenWeb from './Screen/RegisterScreenWeb';
import ActivityDetailsWeb from './Guest/ActivityDetailsWeb';
import FeedbackFormWeb from './Screen/FeedbackFormWeb';
import MapScreen from './Screen/InteractiveMap';
import ForgotPasswordWeb from './Screen/ForgotPasswordWeb';
import InteractiveMap from './Screen/InteractiveMap';
import PlantIdentificationScreen from './Screen/PlantIdentificationScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageScreenWeb />} />
        <Route path="/Admin" element={<AdminHomeScreen />} />
        <Route path="/Guide" element={<GuideHomeScreen />} />
        <Route path="/Guest" element={<GuestHomeWeb />} />
        <Route path="/Guide/GuidePersonal" element={<GuidePersonal />} />
        <Route path="/Guide/CertificateView" element={<CertificateView />} />
        <Route path="/Guide/GuideProfile" element={<GuideProfile />} />
        <Route path="/Guide/GuideLicensePage" element={<GuideLicensePage />} />
        <Route path="/Guide/LicenseDetailsPage" element={<LicenseDetailsPage />} />
        <Route path="/Guide/MyTrainingPage" element={<MyTrainingPage />} />
        <Route path="/Guide/RenewLicensePage" element={<RenewLicensePage />} />
        <Route path="/Guide/GuideNotification" element={<GuideNotification />} />

        <Route path="/Guest/GuestHomeWeb" element={<GuestHomeWeb />} />
        <Route path="/Guest/GuestPersonalWeb" element={<GuestPersonalWeb />} />
        <Route path="/Guest/GuestProfileWeb" element={<GuestProfileWeb />} />
        <Route path="/Guest/ActivitiesWeb" element={<ActivitiesWeb />} />
        <Route path="/Guest/ActivityDetailsWeb" element={<ActivityDetailsWeb />} />
        
        <Route path="/Admin/IotDashboard" element={<AdminIoTDashboard />} />
        <Route path="/Admin/TrackProgressPage" element={<TrackProgressPage />} />
        <Route path="/Admin/AddCoursePage" element={<AddCoursePage />} />
        <Route path="/Admin/GuideListPage" element={<GuideListPage />} />
        <Route path="/Admin/AssignCoursePage" element={<AssignCoursePage />} />
        <Route path="/Admin/ILSPage" element={<ILSPage />} />
        <Route path="/Admin/CourseInfoPage" element={<CourseInfoPage />} />
        <Route path="/Admin/EditCoursePage" element={<EditCoursePage />} />
        <Route path="/Admin/AdminPersonal" element={<AdminPersonal />} />
        <Route path="/Admin/AdminProfile" element={<AdminProfile />} />
        <Route path="/Admin/AdminNotificationPage" element={<AdminNotificationPage />} />

        <Route path="/Screen/BirthdayEdit" element={<BirthdayEdit />} />
        <Route path="/Screen/EmailEdit" element={<EmailEdit />} />
        <Route path="/Screen/NameEdit" element={<NameEdit />} />
        <Route path="/Screen/PhoneEdit" element={<PhoneEdit />} />
        <Route path="/Screen/FAQScreen" element={<FAQScreen />} />
        <Route path="/Screen/Help" element={<Help />} />
        <Route path="/Screen/SPScreen" element={<SPScreen />} />
        <Route path="/Screen/CourseDetail" element={<CourseDetail />} />
        <Route path="/Screen/BookScreen" element={<BookScreen />} />
        <Route path="/Screen/GuideBookingApprovalWeb" element={<GuideBookingApprovalWeb />} />
        <Route path="/Screen/GuideNotificationWeb" element={<GuideNotificationWeb />} />
        <Route path="/Screen/FeedbackHomeWeb" element={<FeedbackHomeWeb />} />
        <Route path="/Screen/FeedbackHistoryWeb" element={<FeedbackHistoryWeb />} />
        <Route path="/Screen/FeedbackStatsWeb" element={<FeedbackStatsWeb />} />
        <Route path="/Screen/CoursePageWeb" element={<CoursePageWeb />} />
        <Route path="/Screen/InteractiveMap" element={<InteractiveMap />} />
        <Route path="/Screen/UserGuideWeb" element={<UserGuideWeb />} />
        <Route path="/Screen/SpeciesScreen" element={<SpeciesScreen />} />
        <Route path="/Screen/TotallyProtectedScreen" element={<TotallyProtectedScreen />} />
        <Route path="/Screen/ProtectedPlantsScreen" element={<ProtectedPlantsScreen />} />
        <Route path="/Screen/ProtectedWildlifeScreen" element={<ProtectedWildlifeScreen />} />
        <Route path="/Screen/HomePageScreenWeb" element={<HomePageScreenWeb />} />
        <Route path="/Screen/LoginScreen" element={<LoginScreen />} />
        <Route path="/Screen/ResetPasswordWeb" element={<ResetPasswordWeb />} />
        <Route path="/Screen/RegisterScreenWeb" element={<RegisterScreenWeb />} />
        <Route path="/Screen/FeedbackFormWeb" element={<FeedbackFormWeb />} />
        <Route path="/Screen/ForgotPasswordWeb" element={<ForgotPasswordWeb />} />
        <Route path="/Screen/PlantIdentificationScreen" element={<PlantIdentificationScreen />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
