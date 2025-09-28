import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width - 48; // Adjust to ensure the cards fit in one row

const CoursePage = () => {
  const navigation = useNavigation();

  const guide = {
    id: 1,
    name: "John",
    licenseLevel: "Junior Guide",
  };

  const courses = [
    {
      id: 1,
      name: "Basic Wildlife Guide Course",
      desc: "understand widlife",
      modules: 12,
      duration: "2 weeks",
      price: 250,
      schedule: ["Mon-Wed-Fri", "9am-12pm"],
      instructor: "Dr. Chen",
      capacity: 15,
      requiredFor: ["Junior Guide"],
      status: "enrolled"
    },
    {
      id: 2,
      name: "Advanced Species Handling",
      desc: "Understand species",
      modules: 15,
      duration: "1 month",
      price: 500,
      schedule: ["Tue-Thu", "2pm-5pm"],
      instructor: "Prof. Singh",
      capacity: 10,
      requiredFor: ["Junior Guide","Senior Guide", "Master Guide"],
      status: "enrolled"
    },
    {
      id: 3,
      name: "Emergency learning",
      desc: "Understand emergency",
      modules: 10,
      duration: "1 month",
      price: 500,
      schedule: ["Tue-Thu", "2pm-5pm"],
      instructor: "Prof. Singh",
      capacity: 10,
      requiredFor: ["Master Guide"],
      status: "enrolled"
    },
    {
      id: 4,
      name: "Communication",
      desc: "Understand how to talk",
      modules: 7,
      duration: "1 month",
      price: 500,
      schedule: ["Tue-Thu", "2pm-5pm"],
      instructor: "Prof. Singh",
      capacity: 10,
      requiredFor: ["Senior Guide", "Master Guide"],
      status: "enrolled"
    },
    {
      id: 5,
      name: "Idk",
      desc: "Understand idk",
      modules: 18,
      duration: "1 month",
      price: 500,
      schedule: ["Tue-Thu", "2pm-5pm"],
      instructor: "Prof. Singh",
      capacity: 10,
      requiredFor: ["Junior Guide","Senior Guide", "Master Guide"],
      status: "enrolled"
    },
  ];

  const enrolledCourses = courses.filter(course => course.status === "enrolled");
  const recommendedCourses = courses.filter(course => 
    course.status !== "enrolled" && course.requiredFor.includes(guide.licenseLevel)
  );

  const renderCourseCard = (type) => ({ item }) => (
  <TouchableOpacity onPress={() => navigation.navigate('CourseDetail', { course: item })}>
    <View style={type === 'enrolled' ? styles.enrolledCard : styles.recommandCard}>
      
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.description}>{item.desc}</Text>
      <View style={styles.row}>
        <Text style={styles.duration}>🕒 {item.duration}</Text>
        <Text style={styles.arrow}>➔</Text>
      </View>
    </View>
  </TouchableOpacity>
);

  return (
  <View style={styles.container}>
    <FlatList
      data={enrolledCourses}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <>
          <Text style={styles.header}>Course</Text>
          <Text style={styles.section}>Enrolled Course</Text>
          {enrolledCourses.length === 0 && (
            <View style={styles.enrolledCard}>
              <Text style={styles.title}>No courses enrolled</Text>
              <Text style={styles.description}>You haven't enrolled in any courses yet.</Text>
            </View>
          )}
        </>
      }
      renderItem={enrolledCourses.length > 0 ? renderCourseCard('enrolled') : null}
      ListFooterComponent={
        <>
          <Text style={styles.section}>Available</Text>
          {recommendedCourses.length === 0 ? (
            <View style={styles.enrolledCard}>
              <Text style={styles.title}>No Available courses</Text>
              <Text style={styles.description}>No new courses available at the moment.</Text>
            </View>
          ) : (
            recommendedCourses.map((course) => (
              renderCourseCard('recommended')({ item: course })
            ))
          )}

        </>
      }
    />

    <View style={styles.bottomNav}>
      {/* Navigation bar buttons */}
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
        <Ionicons name="home" size={24} color="#2f855a" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Species')}>
        <FontAwesome name="leaf" size={24} color="#888" />
        <Text style={styles.navText}>Species</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Mapp')}>
        <Ionicons name="map" size={24} color="#888" />
        <Text style={styles.navText}>Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Guide')}>
        <MaterialIcons name="menu-book" size={24} color="#888" />
        <Text style={styles.navText}>Guide</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Login')}>
        <Ionicons name="person" size={24} color="#888" />
        <Text style={styles.navText}>User</Text>
      </TouchableOpacity>
    </View>
  </View>
);
};

export default CoursePage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16, },
  scrollContainer: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
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
    width: '100%',
  },

  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 8,
    marginBottom: 20,

  },
  enrolledCard: {
    width: cardWidth, // Ensure the card width fits in one row
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12, // Add spacing between cards
    marginBottom: 10
  },
  recommandCard: {
    width: cardWidth,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12, // uniform vertical spacing
  },

  image: {
    width: '100%',
    height: 100,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  description: {
    fontSize: 12,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  duration: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  arrow: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});