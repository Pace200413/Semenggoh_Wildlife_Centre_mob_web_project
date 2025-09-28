import React, { useState } from 'react';
import {
  View, TextInput, Text, StyleSheet,
  TouchableOpacity, Alert, ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../config';

const EditCoursePage = ({ navigation, route }) => {
  const { course } = route.params || {};

  const [courseTitle, setCourseTitle] = useState(course?.courseTitle || '');
  const [courseDescription, setCourseDescription] = useState(course?.courseDescription || '');
  const [duration, setDuration] = useState(course?.duration || '');
  const [price, setPrice] = useState(course?.price || '');
  const [scheduleInput, setScheduleInput] = useState((course?.schedule || []).join(', '));
  const [skillLevel, setSkillLevel] = useState(course?.skillLevel || '');
  const [requiredFor, setRequiredFor] = useState(course?.requiredFor || '');
  const [capacity, setCapacity] = useState(course?.capacity?.toString() || '');
  const [lecturer, setLecturer] = useState(course?.lecturer || '');
  const [learningOutcome, setLearningOutcome] = useState(course?.learningOutcome || '');
  const [assessments, setAssessments] = useState(course?.assessments || [
    { question: '', options: ['', ''], correctIndex: null }
  ]);

  const handleSave = async () => {
    const updatedCourse = {
      id: route?.params?.course?.id,
      courseTitle,
      courseDescription,
      duration,
      price,
      schedule: scheduleInput.split(',').map(s => s.trim()),
      skillLevel,
      requiredFor,
      capacity: Number(capacity),
      lecturer,
      learningOutcome,
      assessments,
    };

    try {
      const response = await fetch(`${API_URL}/api/training_course/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCourse),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Course updated successfully!');
        navigation.navigate('CourseInfoPage', { course: updatedCourse });
      } else {
        alert(`Error updating course: ${data.message}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating the course.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>✏️ Edit Course</Text>

      <TextInput
        style={styles.input}
        placeholder="Course Title"
        value={courseTitle}
        onChangeText={setCourseTitle}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Course Description"
        value={courseDescription}
        onChangeText={setCourseDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Duration (e.g., 4 weeks)"
        value={duration}
        onChangeText={setDuration}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Skill Level:</Text>
      <Picker
        selectedValue={skillLevel}
        onValueChange={(itemValue) => setSkillLevel(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Skill Level..." value="" />
        <Picker.Item label="Junior Guide" value="Junior Guide" />
        <Picker.Item label="Senior" value="Senior" />
        <Picker.Item label="Master" value="Master" />
      </Picker>

      <Text style={styles.label}>Required For (License Type):</Text>
      <Picker
        selectedValue={requiredFor}
        onValueChange={(itemValue) => setRequiredFor(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select required license..." value="" />
        <Picker.Item label="Junior Guide" value="Junior Guide" />
        <Picker.Item label="Senior Guide" value="Senior Guide" />
        <Picker.Item label="Master" value="Master" />
      </Picker>

      <TextInput
        placeholder="Lecturer Name"
        value={lecturer}
        onChangeText={setLecturer}
        style={styles.input}
      />

      <Text style={styles.label}>Learning Outcome:</Text>
      <Picker
        selectedValue={learningOutcome}
        onValueChange={(val) => setLearningOutcome(val)}
        style={styles.picker}
      >
        <Picker.Item label="Select an outcome..." value="" />
        <Picker.Item label="Understand basics" value="Understand basics" />
        <Picker.Item label="Apply knowledge" value="Apply knowledge" />
        <Picker.Item label="Problem-solving" value="Problem-solving" />
        <Picker.Item label="Certification ready" value="Certification ready" />
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Schedule (comma-separated)"
        value={scheduleInput}
        onChangeText={setScheduleInput}
      />

      <TextInput
        style={styles.input}
        placeholder="Capacity"
        value={capacity}
        onChangeText={setCapacity}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Assessments:</Text>
      {assessments.map((q, i) => (
        <View key={i} style={styles.assessmentContainer}>
          <TextInput
            placeholder={`Question ${i + 1}`}
            value={q.question}
            onChangeText={(text) => {
              setAssessments(prev =>
                prev.map((a, idx) => idx === i ? { ...a, question: text } : a)
              );
            }}
            style={styles.input}
          />
          {q.options.map((opt, j) => (
            <TextInput
              key={j}
              placeholder={`Option ${j + 1}`}
              value={opt}
              onChangeText={(text) => {
                setAssessments(prev =>
                  prev.map((a, idx) =>
                    idx === i
                      ? { ...a, options: a.options.map((o, jdx) => jdx === j ? text : o) }
                      : a
                  )
                );
              }}
              style={styles.input}
            />
          ))}
          <TouchableOpacity
            style={styles.addOptionButton}
            onPress={() => {
              if (assessments[i].options.length >= 6) {
                Alert.alert('Limit', 'Max 6 options');
                return;
              }

              setAssessments(prev =>
                prev.map((a, idx) =>
                  idx === i
                    ? { ...a, options: [...a.options, ''] }
                    : a
                )
              );
            }}
          >
            <Text style={styles.buttonText}>➕ Add Option</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Correct Answer:</Text>
          <Picker
            selectedValue={q.correctIndex !== null && q.correctIndex !== undefined ? String(q.correctIndex) : ''}
            onValueChange={(val) => {
              setAssessments(prev =>
                prev.map((a, idx) =>
                  idx === i ? { ...a, correctIndex: val === '' ? null : parseInt(val) } : a
                )
              );
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select correct option..." value="" />
            {q.options.map((opt, idx) => (
              <Picker.Item
                label={opt || `Option ${idx + 1}`}
                value={String(idx)} // ensure string value
                key={idx}
              />
            ))}
          </Picker>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addOptionButton}
        onPress={() =>
          setAssessments([
            ...assessments,
            { question: '', options: ['', ''], correctIndex: null },
          ])
        }
      >
        <Text style={styles.buttonText}>➕ Add Another Question</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#e6fff0' },
  header: { fontSize: 24, fontWeight: 'bold', color: '#1A237E', marginBottom: 20 },
  input: {
    borderColor: '#ccc', borderWidth: 1, borderRadius: 8,
    padding: 12, marginBottom: 12, backgroundColor: '#fff',
  },
  label: { fontWeight: '600', marginTop: 10, marginBottom: 5, color: '#333' },
  picker: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  addOptionButton: {
    backgroundColor: '#00796B', paddingVertical: 10,
    borderRadius: 8, marginBottom: 15, alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#2E7D32', padding: 15,
    borderRadius: 8, alignItems: 'center', marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#DC3545', padding: 15,
    borderRadius: 8, alignItems: 'center',
  },
  assessmentContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default EditCoursePage;
