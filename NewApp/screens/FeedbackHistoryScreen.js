import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  ScrollView 
} from 'react-native';

const HorizontalScrollView = ScrollView;
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFeedbackList } from '../services/api';

const formatText = (text) => {
  if (!text) return '';
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const FeedbackItem = ({ item }) => {
  const sentimentValue = item?.sentiment_category;

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'very_positive': return '#2e7d32';
      case 'positive': return '#4caf50';
      case 'mixed_positive': return '#8bc34a';
      case 'neutral': return '#ff9800';
      case 'mixed_negative': return '#ff5722';
      case 'negative': return '#f44336';
      case 'very_negative': return '#b71c1c';
      default: return '#888';
    }
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'very_positive': return '😍';
      case 'positive': return '😃';
      case 'mixed_positive': return '🙂';
      case 'neutral': return '🤔';
      case 'mixed_negative': return '🙁';
      case 'negative': return '😞';
      case 'very_negative': return '😡';
      default: return '🤔';
    }
  };

  const RatingStars = ({ rating }) => (
    <View style={styles.ratingContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text 
          key={star} 
          style={{
            fontSize: 16,
            color: star <= rating ? '#ffb400' : '#ccc'
          }}
        >
          ★
        </Text>
      ))}
    </View>
  );

  return (
    <View style={styles.feedbackItem}>
      <View style={styles.feedbackHeader}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <RatingStars rating={item.rating} />
        </View>
        {sentimentValue && (
          <View 
            style={[
              styles.sentimentBadge, 
              { backgroundColor: getSentimentColor(sentimentValue) }
            ]}
          >
            <Text style={styles.sentimentText}>
              {getSentimentEmoji(sentimentValue)} {formatText(sentimentValue)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.reviewContainer}>
        <Text style={styles.reviewLabel}>Review:</Text>
        <Text style={styles.reviewText}>{item.comment}</Text>
      </View>

      {item.recommendation?.trim() ? (
        <View style={styles.recommendationContainer}>
          <Text style={styles.recommendationLabel}>Recommendation for Park Guides:</Text>
          <Text style={styles.recommendationText}>{item.recommendation}</Text>
        </View>
      ) : null}

      <Text style={styles.timestamp}>{item.date}</Text>
    </View>
  );
};

const FeedbackHistoryScreen = ({navigation, route}) => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState(null);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeedbackList(route?.params.userId);
      setFeedbackList(data);
      applyFilter(data, filter);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load feedback. Please try again.');
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedback();
    setRefreshing(false);
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const applyFilter = (data, selectedFilter) => {
    if (selectedFilter === 'all') {
      setFilteredList(data);
    } else if (selectedFilter === 'positive') {
      const filtered = data.filter(item => {
        const sentiment = item.sentiment_category;
        return sentiment && (
          sentiment === 'positive' || 
          sentiment === 'very_positive' || 
          sentiment === 'mixed_positive'
        );
      });
      setFilteredList(filtered);
    } else if (selectedFilter === 'negative') {
      const filtered = data.filter(item => {
        const sentiment = item.sentiment_category;
        return sentiment && (
          sentiment === 'negative' || 
          sentiment === 'very_negative' || 
          sentiment === 'mixed_negative'
        );
      });
      setFilteredList(filtered);
    } else if (selectedFilter === 'neutral') {
      const filtered = data.filter(item => item.sentiment_category === 'neutral');
      setFilteredList(filtered);
    } else {
      const filtered = data.filter(item => item.sentiment_category === selectedFilter);
      setFilteredList(filtered);
    }
  };

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
    applyFilter(feedbackList, selectedFilter);
  };

  const renderFilterButton = (label, value) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === value ? styles.activeFilterButton : null
      ]}
      onPress={() => handleFilterChange(value)}
    >
      <Text 
        style={[
          styles.filterButtonText,
          filter === value ? styles.activeFilterButtonText : null
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color="#5271ff" />
        <Text style={styles.loadingText}>Loading feedback...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        {renderFilterButton('All', 'all')}
        {renderFilterButton('Positive', 'positive')}
        {renderFilterButton('Neutral', 'neutral')}
        {renderFilterButton('Negative', 'negative')}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFeedback}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {filteredList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No feedback found</Text>
              <Text style={styles.emptySubtext}>
                {filter !== 'all' 
                  ? `There are no ${filter} feedback entries.` 
                  : 'Be the first to submit feedback!'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredList}
              keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
              renderItem={({ item }) => <FeedbackItem item={item} />}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (no changes to styles; same as before)
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  filterContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  filterButton: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 5, marginHorizontal: 2 },
  activeFilterButton: { backgroundColor: '#5271ff' },
  filterButtonText: { fontWeight: '500', color: '#555' },
  activeFilterButtonText: { color: '#fff' },
  listContainer: { padding: 15 },
  feedbackItem: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  feedbackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  nameContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  ratingContainer: { flexDirection: 'row', marginTop: 5 },
  sentimentBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 15, alignSelf: 'flex-start', marginLeft: 10 },
  sentimentText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  reviewContainer: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, marginVertical: 8, borderLeftWidth: 3, borderLeftColor: '#5271ff' },
  reviewLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  reviewText: { fontSize: 15, color: '#444', lineHeight: 22 },
  recommendationContainer: { backgroundColor: '#f0f8ff', borderRadius: 8, padding: 12, marginVertical: 8, borderLeftWidth: 3, borderLeftColor: '#5271ff' },
  recommendationLabel: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#333' },
  recommendationText: { fontSize: 14, color: '#444', lineHeight: 20, fontStyle: 'italic' },
  timestamp: { fontSize: 12, color: '#888', textAlign: 'right' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  loadingText: { marginTop: 10, color: '#666', fontSize: 16 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#555' },
  emptySubtext: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 10 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { fontSize: 16, color: '#f44336', textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#5271ff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 6 },
  retryButtonText: { color: '#fff', fontWeight: '600' },
});

export default FeedbackHistoryScreen;
