import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFeedbackStats } from '../services/api';

// Simple bar chart component
const BarChart = ({ data }) => {
  const maxValue = Math.max(...Object.values(data)) || 1;
  

  return (
    <View style={styles.barChartContainer}>
      {Object.entries(data ?? {}).map(([key, value]) => {
        const barWidth = (value / maxValue) * 100;
        const barColor = key === 'positive' ? '#4caf50' : key === 'negative' ? '#f44336' : '#ff9800';
        // Handle the special case for the 'neutral' key which represents 'needs improvement'
        let label;
        if (key === 'neutral') {
          label = 'Needs Improvement';
        } else {
          label = key.charAt(0).toUpperCase() + key.slice(1);
        }
        
        return (
          <View key={key} style={styles.barGroup}>
            <Text style={styles.barLabel}>{label}</Text>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { width: `${barWidth}%`, backgroundColor: barColor }
                ]} 
              />
              <Text style={styles.barValue}>
                {typeof value === 'number' ? value.toFixed(0) : '0'}%
                </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Stats box component
const StatBox = ({ label, value, color }) => (
  <View style={[styles.statBox, { borderLeftColor: color }]}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, { color }]}>{value}</Text>
  </View>
);

const StatsScreen = ({ route }) => {
  const guideId = route?.params?.userId;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFeedbackStats(guideId);
      
      // Add debugging to see what data we're getting
      console.log('Stats data received:', JSON.stringify(data));
      console.log('Needs improvement count:', data?.simplified?.neutral);
      console.log('Total count:', data?.total);
      
      setStats(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load statistics. Please try again.');
      console.error(err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={36} color="#5271ff" />
        <Text style={styles.loadingText}>Loading statistics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadStats}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If there's no data yet
  if (!stats || stats?.total === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No feedback data yet</Text>
            <Text style={styles.noDataSubtext}>
              Statistics will be displayed once feedback is submitted
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (stats) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.headerContainer}>
            <Text style={styles.headerTitle}>Feedback Overview</Text>
            <Text style={styles.headerSubtitle}>
              Based on {stats.total} {stats.total === 1 ? 'entry' : 'entries'}
            </Text>
            {stats.model_info && (
              <Text style={styles.modelInfo}>
                Using {stats.model_info.name} model
                {stats.model_info.accuracy ? ` (Accuracy: ${stats.model_info.accuracy}%)` : ''}
              </Text>
            )}
          </View>

          <View style={styles.statsGrid}>
            <StatBox 
              label="Total Feedback" 
              value={stats.total} 
              color="#5271ff" 
            />
            <StatBox 
              label="Average Rating" 
              value={Number(stats.average_rating || 0).toFixed(1)} 
              color="#ff9800" 
            />
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Sentiment Breakdown</Text>
            <BarChart 
              data={{
                positive: stats?.simplified?.positive_percentage ?? 0,
                neutral: stats?.simplified?.neutral_percentage ?? 0,
                negative: stats?.simplified?.negative_percentage ?? 0,
              }} 
            />
          </View>

          <View style={styles.sentimentContainer}>
            <Text style={styles.sentimentTitle}>Main Sentiment Distribution</Text>
            <View style={styles.sentimentGrid}>
              <View style={styles.sentimentBox}>
                <View style={[styles.sentimentIcon, { backgroundColor: '#4caf50' }]}>
                  <Text style={styles.sentimentIconText}>😃</Text>
                </View>
                <Text style={styles.sentimentLabel}>Positive</Text>
                <Text style={styles.sentimentValue}>{stats?.simplified?.positive ?? 0}</Text>
                <Text style={styles.sentimentPercentage}>
                  {(stats?.simplified?.positive_percentage ?? 0).toFixed(1)}%
                </Text>
              </View>
              
              <View style={styles.sentimentBox}>
                <View style={[styles.sentimentIcon, { backgroundColor: '#ff9800' }]}>
                  <Text style={styles.sentimentIconText}>🤔</Text>
                </View>
                <Text style={styles.sentimentLabel}>Needs Improvement</Text>
                <Text style={styles.sentimentValue}>{stats?.simplified?.neutral ?? 0}</Text>
                <Text style={styles.sentimentPercentage}>
                  {(stats?.simplified?.neutral_percentage ?? 0).toFixed(1)}%
                </Text>
              </View>
              
              <View style={styles.sentimentBox}>
                <View style={[styles.sentimentIcon, { backgroundColor: '#f44336' }]}>
                  <Text style={styles.sentimentIconText}>😞</Text>
                </View>
                <Text style={styles.sentimentLabel}>Negative</Text>
                <Text style={styles.sentimentValue}>{stats?.simplified?.negative ?? 0}</Text>
                <Text style={styles.sentimentPercentage}>
                  {(stats?.simplified?.negative_percentage ?? 0).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>

          {/* Park Guide Training Recommendation */}
          <View style={styles.parkGuideContainer}>
            <Text style={styles.parkGuideTitle}>Park Guide Training Recommendation</Text>
            <View style={styles.parkGuideContent}>
              {(stats?.simplified?.negative_percentage ?? 0) > 20 || (stats?.simplified?.neutral_percentage ?? 0) > 90 ? (
                <>
                  <View style={styles.parkGuideIconContainer}>
                    <View style={[styles.parkGuideIcon, { backgroundColor: '#f44336' }]}>
                      <Text style={styles.parkGuideIconText}>⚠️</Text>
                    </View>
                  </View>
                  <Text style={styles.parkGuideText}>
                    <Text style={styles.parkGuideHighlight}>Retraining Recommended:</Text> {' '}
                    With {(stats?.simplified?.negative_percentage ?? 0).toFixed(1)}% negative and {(stats?.simplified?.neutral_percentage ?? 0).toFixed(1)}% needs improvement feedback, 
                    we recommend implementing a comprehensive retraining program focused on customer service, 
                    park knowledge, and visitor engagement techniques. Consider scheduling monthly training sessions 
                    and implementing a mentorship program.
                  </Text>
                </>
              ) : (
                <>
                  <View style={styles.parkGuideIconContainer}>
                    <View style={[styles.parkGuideIcon, { backgroundColor: '#4caf50' }]}>
                      <Text style={styles.parkGuideIconText}>✅</Text>
                    </View>
                  </View>
                  <Text style={styles.parkGuideText}>
                    <Text style={styles.parkGuideHighlight}>No Additional Training Required:</Text> {' '}
                    With {(stats?.simplified?.positive_percentage ?? 0).toFixed(1)}% positive feedback, the current park guide team is 
                    performing well. Continue with regular knowledge updates and appreciation for maintaining high standards.
                  </Text>
                </>
              )}
            </View>
          </View>
          
          {/* Detailed Sentiment Analysis */}
          <View style={styles.detailedSentimentContainer}>
            <Text style={styles.sentimentTitle}>Detailed Sentiment Analysis</Text>
            <View style={styles.detailedSentimentContent}>
              {Object.entries(stats.sentiment_counts ?? {}).map(([sentiment, count]) => {
                if (count === 0) return null; // Skip zero counts
                
                // Determine color based on sentiment
                let color;
                let emoji;
                
                if (sentiment === 'positive') {
                  color = '#4caf50';
                  emoji = '😃';
                } else if (sentiment === 'needs_improvement') {
                  color = '#ff9800';
                  emoji = '🤔';
                } else if (sentiment === 'negative') {
                  color = '#f44336';
                  emoji = '😞';
                }
                
                // Format sentiment label
                const formattedLabel = sentiment
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                
                return (
                  <View key={sentiment} style={styles.detailedSentimentItem}>
                    <View style={[styles.detailedSentimentIcon, { backgroundColor: color }]}>
                      <Text>{emoji}</Text>
                    </View>
                    <View style={styles.detailedSentimentInfo}>
                      <Text style={styles.detailedSentimentLabel}>{formattedLabel}</Text>
                      <View style={styles.detailedSentimentStats}>
                        <Text style={styles.detailedSentimentCount}>{count}</Text>
                        <Text style={styles.detailedSentimentPercentage}>
                          ({(stats.sentiment_percentages[sentiment] ?? 0).toFixed(1)}%)
                        </Text>
                      </View>
                    </View>
                    <View style={styles.detailedSentimentBarContainer}>
                      <View 
                        style={[
                          styles.detailedSentimentBar, 
                          { 
                            width: `${stats.sentiment_percentages[sentiment]}%`,
                            backgroundColor: color
                          }
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  return null;
};

const styles = StyleSheet.create({
  // Park Guide Training Recommendation Styles
  parkGuideContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  parkGuideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  parkGuideContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
  },
  parkGuideIconContainer: {
    marginRight: 12,
  },
  parkGuideIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parkGuideIconText: {
    fontSize: 20,
  },
  parkGuideText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  parkGuideHighlight: {
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  modelInfo: {
    fontSize: 14,
    color: '#5271ff',
    marginTop: 5,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    borderLeftWidth: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  barChartContainer: {
    marginTop: 10,
  },
  barGroup: {
    marginBottom: 15,
  },
  barLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  barContainer: {
    height: 25,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    height: '100%',
  },
  barValue: {
    position: 'absolute',
    right: 10,
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sentimentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sentimentTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  sentimentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sentimentBox: {
    alignItems: 'center',
    flex: 1,
  },
  sentimentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  sentimentIconText: {
    fontSize: 18,
  },
  sentimentLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  sentimentValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  sentimentPercentage: {
    fontSize: 14,
    color: '#666',
  },
  // Detailed sentiment analysis styles
  detailedSentimentContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailedSentimentContent: {
    marginTop: 5,
  },
  detailedSentimentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
  },
  detailedSentimentIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  detailedSentimentInfo: {
    width: 120,
  },
  detailedSentimentLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  detailedSentimentStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailedSentimentCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 5,
  },
  detailedSentimentPercentage: {
    fontSize: 12,
    color: '#666',
  },
  detailedSentimentBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  detailedSentimentBar: {
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  noDataSubtext: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#5271ff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default StatsScreen;
