import 'react-native-gesture-handler';
import {useEffect, useState} from 'react';
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomePageScreen from './screens/HomePageScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import UserGuideScreen from './screens/UserGuideScreen';
import BookScreen from './screens/BookScreen';
import AdminHomeScreen from './screens/AdminHomeScreen';
import GuidePersonal from './Guide/GuidePersonal';
import GuideHomeScreen from './screens/GuideHomeScreen';
import GuideProfile from './Guide/GuideProfile';
import TotallyProtected from './screens/TotallyProtected';
import ProtectedWildlife from './screens/ProtectedWildlife';
import ProtectedPlants from './screens/ProtectedPlants';
import SpeciesIntroScreen from './screens/Species';
import AdminPersonal from './Admin/AdminPersonal';
import AdminProfile from './Admin/AdminProfile';
import GuestPersonal from './Guest/GuestPersonal';
import GuestProfile from './Guest/GuestProfile';
import GuestHomeScreen from './screens/GuestHomeScreen';
import NameEdit from './screens/NameEdit';
import BirthdayEdit from './screens/BirthdayEdit';
import SPScreen from './screens/SPScreen';
import EmailEdit from './screens/EmailEdit';
import PhoneEdit from './screens/PhoneEdit';
import LicenseDetailsPage from './Guide/LicenseDetailsPage';
import RenewLicensePage from './Guide/RenewLicensePage';
import GuideLicensePage from './Guide/GuideLicensePage';
import IssueLicenseScreen from './Admin/IssueLicenseScreen';
import GuideListPage from './Admin/GuideListPage';
import AssignCoursePage from './Admin/AssignCoursePage';
import CourseInfoPage from './Admin/CourseInfoPage';
import AddCoursePage from './Admin/AddCoursePage';
import EditCoursePage from './Admin/EditCoursePage';
import GuideNotification from './screens/GuideNotification';
import HomePageGuideList from './screens/HomePageGuideList';
import JoinUs from './screens/JoinUs';
import AdminNotification from './screens/AdminNotification';
import Mapp from './screens/Mapp';
import ChangePasswordScreen from './screens/ChangePassword';
import DeleteAccountScreen from './screens/DeleteAccount';
import HelpScreen from './screens/Help';
import FAQScreen from './screens/FAQScreen';
import TrackProgressPage from './Admin/TrackProgressPage';
import PracticalAssessmentPage from './Admin/PracticalAssessmentPage';
import PlantIdentificationScreen from './screens/PlantIdentificationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import ActivitiesScreen from './screens/ActivitiesScreen';
import ActivityDetails from './screens/ActivityDetails';
import FeedbackHistoryScreen from './screens/FeedbackHistoryScreen';
import FeedbackFormScreen from './screens/FeedbackFormScreen';
import FeedbackHomeScreen from './screens/FeedbackHomeScreen';
import StatsScreen from './screens/StatsScreen';
import GuideBookingApprovalScreen from './screens/GuideBookingApprovalScreen';
import MyCertificatesPage from './Guide/CertificateView';
import MyTrainingPage from './Guide/MyTraining';
import TakeCourse from './screens/TakeCourse';
import CourseDetail from './screens/CourseDetail';
import AdminIotDashboard from './Admin/IoTDashboard';

// Create the navigator instance (renamed to avoid conflicts)
const MainNavigator = createStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState('Home');
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const user = await AsyncStorage.getItem('user');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
  
      if (user && refreshToken) {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          console.warn('❌ Refresh failed. Logging out...');
          await AsyncStorage.clear();
          setInitialRoute('Login');
        } else {
          console.log('✅ Token auto-refreshed on app start');
          try {
            const parsedUser = JSON.parse(user);
            if (parsedUser.role === 'admin') {
              setInitialRoute('AdminHomePage');
            } else if (parsedUser.role === 'guide') {
              setInitialRoute('GuidePer');
            } else {
              setInitialRoute('GuestPer');
            }
          } catch (err) {
            console.error('Error parsing user data:', err);
            setInitialRoute('Login');
          }
        }
      } else {
        setInitialRoute('Login');
      }
    };
  
    checkAndRefreshToken();
  }, []);
  if (!initialRoute) {
    return null; // Or show a splash/loading component
  }

  return (
    <NavigationContainer>
      <MainNavigator.Navigator initialRouteName="Home">
        <MainNavigator.Screen 
          name="Home" 
          component={HomePageScreen}
          options={{ headerShown: false }}
        />
        <MainNavigator.Screen 
          name="NameEdit" 
          component={NameEdit}
          options={{ title: 'Name' }}
        />
        <MainNavigator.Screen 
          name="spScreen" 
          component={SPScreen}
          options={{ title: 'Securiy & Privacy' }}
        />
        <MainNavigator.Screen 
          name="EditBirthday" 
          component={BirthdayEdit}
          options={{ title: 'Birthday' }}
        />
        <MainNavigator.Screen 
          name="EditEmail" 
          component={EmailEdit}
          options={{ title: 'Email' }}
        />
        <MainNavigator.Screen 
          name="EditPhone" 
          component={PhoneEdit}
          options={{ title: 'Phone Number' }}
        />
        <MainNavigator.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <MainNavigator.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ title: 'Register Screen' }}
        />
        <MainNavigator.Screen 
          name="GuestHome" 
          component={GuestHomeScreen}
          options={{ headerShown: false }}
        />
        <MainNavigator.Screen 
          name="Guide" 
          component={UserGuideScreen}
          options={{ title: 'Guide List' }}
        />

        <MainNavigator.Screen 
          name="Book" 
          component={BookScreen}
          options={{ title: 'Make Your Booking' }}
        />

          <MainNavigator.Screen 
          name="AdminHomePage" 
          component={AdminHomeScreen}
          options={{ headerShown: false }}
        />
        <MainNavigator.Screen 
          name="GuidePer" 
          component={GuidePersonal}
          options={{ title: 'Guide Personal Page' }}
        />
        <MainNavigator.Screen 
          name="GuideHome" 
          component={GuideHomeScreen}
          options={{ headerShown: false }}
        />
        <MainNavigator.Screen 
          name="GuideProfile" 
          component={GuideProfile}
          options={{ title: "Guide Profile" }}
        />
                

        <MainNavigator.Screen 
          name="RenewLicense" 
          component={RenewLicensePage}
          options={{ title: 'Renew Your License' }}
        />
  
        <MainNavigator.Screen 
          name="LicenseDP" 
          component={LicenseDetailsPage}
          options={{ headerShown: false }}
        />
        <MainNavigator.Screen 
          name="GuideLic" 
          component={GuideLicensePage}
          options={{ title: "View My Licenses" }}
        />
        <MainNavigator.Screen 
          name="Species" 
          component={SpeciesIntroScreen}
          options={{ title: 'Species Screen' }}
        />
        <MainNavigator.Screen 
          name="AdminPer" 
          component={AdminPersonal}
          options={{ title: 'Admin Personal Page' }}
        />
        <MainNavigator.Screen 
          name="AdminPro" 
          component={AdminProfile}
          options={{ title: 'Admin Profile' }}
        />
    
        <MainNavigator.Screen 
          name="GuestProfile" 
          component={GuestProfile}
          options={{ title: 'Visitor Profile' }}
        />
        <MainNavigator.Screen 
          name="GuestPer" 
          component={GuestPersonal}
          options={{ title: 'Visitor Personal Page' }}
        />
        <MainNavigator.Screen 
          name="ILSPage" 
          component={IssueLicenseScreen}
          options={{ title: "Issue License" }}
        />
        <MainNavigator.Screen 
          name="GuideList" 
          component={GuideListPage}
          options={{ title: 'Admin Management' }}
        />
        <MainNavigator.Screen 
          name="ACPPage" 
          component={AssignCoursePage}
          options={{ title: 'Assign Course(s) to Guide' }}
        />
          <MainNavigator.Screen 
          name="CourseInfoPage" 
          component={CourseInfoPage}
          options={{ title: 'Course Information' }}
        />
        <MainNavigator.Screen 
          name="AddCoursePage" 
          component={AddCoursePage}
          options={{ title: 'Add Course' }}
        />
        <MainNavigator.Screen 
          name="EditCoursePage" 
          component={EditCoursePage}
          options={{ title: 'Edit Course' }}
        />

          <MainNavigator.Screen 
          name="HomePageGuideList" 
          component={HomePageGuideList}
          options={{ title: "Guides" }}
        />

        <MainNavigator.Screen 
          name="JoinUs" 
          component={JoinUs}
          options={{ title: "Join Us" }}
        />
          <MainNavigator.Screen 
          name="Mapp" 
          component={Mapp}
          options={{ title: 'Interactive Map' }}
        />
          <MainNavigator.Screen 
          name="ChangePassword" 
          component={ChangePasswordScreen}
          options={{ title: "Change Password" }}
        />
        <MainNavigator.Screen 
          name="DeleteAccount" 
          component={DeleteAccountScreen}
          options={{ title: "Delete Account" }}
        />
        <MainNavigator.Screen 
          name="Help" 
          component={HelpScreen}
          options={{ title: "Help & Support" }}
        />
        <MainNavigator.Screen 
          name="FAQ" 
          component={FAQScreen}
          options={{ title: "FAQ" }}
        />

        <MainNavigator.Screen 
          name="PlantIdentification" 
          component={PlantIdentificationScreen}
          options={{ title: "Let's identify the Plants!" }}
        />

        <MainNavigator.Screen 
          name="Assign" 
          component={AssignCoursePage}
          options={{ headerShown: false }}
        />
        
        <MainNavigator.Screen 
          name="TPPage" 
          component={TrackProgressPage}
          options={{ title: "Track Progress" }}
        />
        <MainNavigator.Screen 
          name="PAPage" 
          component={PracticalAssessmentPage}
          options={{ title: 'Practical Assessment' }}
        />
        <MainNavigator.Screen 
          name="AdminNote" 
          component={AdminNotification}
          options={{ title: 'Back to Home' }}
        />
        <MainNavigator.Screen 
          name="GuideNotification" 
          component={GuideNotification}
          options={{ title: 'Back to Home' }}
        />
        <MainNavigator.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <MainNavigator.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <MainNavigator.Screen 
          name="ActivitiesScreen" 
          component={ActivitiesScreen}
          options={{ title: 'Booking History' }}
        />
        <MainNavigator.Screen 
          name="ActivityDetails" 
          component={ActivityDetails}
          options={{ title: 'Booking Details' }}
        />
        <MainNavigator.Screen 
          name="FeedbackHome" 
          component={FeedbackHomeScreen}
          options={{ title: 'View Feedback' }}
        />
        <MainNavigator.Screen 
          name="FeedbackForm" 
          component={FeedbackFormScreen}
          options={{ title: 'Feedback Form' }}
        />
        <MainNavigator.Screen 
          name="FeedbackHistory" 
          component={FeedbackHistoryScreen}
          options={{ title: 'Feedback History' }}
        />
        <MainNavigator.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{ title: 'Feedback Statistics' }}
        />
        <MainNavigator.Screen 
          name="GuideBookingApproval" 
          component={GuideBookingApprovalScreen}
          options={{ headerShown: true }}
        />
        <MainNavigator.Screen 
          name="CertificateView" 
          component={MyCertificatesPage}
          options={{ title: "View Your Certificates" }}
        />
        <MainNavigator.Screen 
          name="MyTraining" 
          component={MyTrainingPage}
          options={{ title: 'Earned Certificates' }}
        />
        <MainNavigator.Screen 
          name="TakeCourse" 
          component={TakeCourse}
          options={{ title: 'Take Your Course' }}
        />
        <MainNavigator.Screen 
          name="CourseDetail" 
          component={CourseDetail}
          options={{ title: 'Back to Course List' }}
        />
        <MainNavigator.Screen 
          name="AdminIoTDashboard" 
          component={AdminIotDashboard}
          options={{ title: 'IoT Dashboard' }}
        />
        <MainNavigator.Screen name="TotallyProtected" component={TotallyProtected} />
        <MainNavigator.Screen name="ProtectedWildlife" component={ProtectedWildlife} />
        <MainNavigator.Screen name="ProtectedPlants" component={ProtectedPlants} />

      </MainNavigator.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#f0f9ff',
  },
});