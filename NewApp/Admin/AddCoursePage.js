import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../config';

const AddCoursePage = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [requiredFor, setRequiredFor] = useState(''); // NEW
  const [price, setPrice] = useState('');
  const [learningOutcome, setLearningOutcome] = useState('');
  const [lecturer, setLecturer] = useState('');
  const [scheduleInput, setScheduleInput] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', ''], correctIndex: null }
  ]);


  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.navigate('GuideList', {
          setSelectedTab: 'course',
        });
        return true;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const handleSave = async () => {
    if (!title.trim() || !description.trim() || !lecturer.trim() || !skillLevel.trim()) {
      alert('Please fill in all required fields!');
      return;
    }

    const newCourse = {
      id: Date.now().toString(),
      courseTitle: title,
      courseDescription: description,
      duration,
      price,
      schedule: scheduleInput.split(',').map(s => s.trim()),
      skillLevel,
      requiredFor,
      capacity: Number(capacity),
      lecturer,
      learningOutcome,
      assessments: questions
    };


    try {
      const response = await fetch(`${API_URL}/api/training_course/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCourse),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Course saved successfully!');
        navigation.goBack();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('An error occurred while saving the course!');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>➕ Add New Course</Text>

        <TextInput
          placeholder="Course Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Course Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        <TextInput
          placeholder="Duration (e.g., 5 weeks)"
          value={duration}
          onChangeText={setDuration}
          style={styles.input}
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

        {/* NEW: Required For */}
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
          placeholder="Price (e.g., $49.99)"
          value={price}
          onChangeText={setPrice}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Lecturer Name"
          value={lecturer}
          onChangeText={setLecturer}
          style={styles.input}
        />

        <Text style={styles.label}>Learning Outcome:</Text>
        <Picker
          selectedValue={learningOutcome}
          onValueChange={(itemValue) => setLearningOutcome(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select an outcome..." value="" />
          <Picker.Item label="Understand basics" value="Understand basics" />
          <Picker.Item label="Apply knowledge in projects" value="Apply knowledge" />
          <Picker.Item label="Develop problem-solving skills" value="Problem-solving" />
          <Picker.Item label="Prepare for certification" value="Certification ready" />
        </Picker>

        <Text style={styles.label}>Schedule (Comma Separated):</Text>
        <TextInput
          placeholder="e.g. Mon-Wed-Fri, 9am-12pm"
          value={scheduleInput}
          onChangeText={setScheduleInput}
          style={styles.input}
        />

        <TextInput
          placeholder="Capacity"
          value={capacity}
          onChangeText={setCapacity}
          style={styles.input}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Assessments:</Text>
        {questions.map((q, qIndex) => (
          <View key={qIndex} style={{ marginBottom: 15 }}>
            <TextInput
              placeholder={`Question ${qIndex + 1}`}
              value={q.question}
              onChangeText={(text) => {
                const updated = [...questions];
                updated[qIndex].question = text;
                setQuestions(updated);
              }}
              style={styles.input}
            />

            {q.options.map((opt, oIndex) => (
              <TextInput
                key={oIndex}
                placeholder={`Option ${oIndex + 1}`}
                value={opt}
                onChangeText={(text) => {
                  const updated = [...questions];
                  updated[qIndex].options[oIndex] = text;
                  setQuestions(updated);
                }}
                style={styles.input}
              />
            ))}

            <TouchableOpacity
              style={styles.addOptionButton}
              onPress={() => {
                const updated = [...questions];
                if (updated[qIndex].options.length < 6) {
                  updated[qIndex].options.push('');
                  setQuestions(updated);
                } else {
                  alert('Max 6 options');
                }
              }}
            >
              <Text style={styles.addOptionText}>➕ Add Option</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Correct Answer:</Text>
            <Picker
              selectedValue={q.correctIndex !== null && q.correctIndex !== undefined ? String(q.correctIndex) : ''}
              onValueChange={(val) => {
                setQuestions(prev =>
                  prev.map((a, idx) =>
                    idx === qIndex ? { ...a, correctIndex: val === '' ? null : parseInt(val) } : a
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
          onPress={() => {
            setQuestions([
              ...questions,
              { question: '', options: ['', ''], correctIndex: null }
            ]);
          }}
        >
          <Text style={styles.addOptionText}>➕ Add Another Question</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Course</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6fff0',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1A237E',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fafafa',
  },
  picker: {
    backgroundColor: '#fafafa',
    marginBottom: 15,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
  },
  label: {
    marginBottom: 5,
    fontWeight: '600',
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  addOptionButton: {
    backgroundColor: '#00796B',
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  addOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AddCoursePage;
