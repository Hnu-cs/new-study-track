import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Card, Button } from '../../components/ui';
import { useAppStore } from '../../store';

const ProfileScreen: React.FC = () => {
  const { stats, studyRecords, mistakes, keyPoints } = useAppStore();

  // Calculate additional statistics
  const totalMistakes = mistakes.length;
  const masteredMistakes = mistakes.filter(m => m.isMastered).length;
  const totalKeyPoints = keyPoints.length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>我的</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Study Statistics Section */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>学习统计</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalDays}</Text>
              <Text style={styles.statLabel}>学习天数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalHours.toFixed(1)}h</Text>
              <Text style={styles.statLabel}>总学习时长</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>当前连续</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.longestStreak}</Text>
              <Text style={styles.statLabel}>最长连续</Text>
            </View>
          </View>
        </Card>

        {/* Subject Distribution */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>科目分布</Text>
          
          {Object.keys(stats.subjectDistribution).length > 0 ? (
            <View style={styles.distributionList}>
              {Object.entries(stats.subjectDistribution)
                .sort(([, a], [, b]) => b - a)
                .map(([subject, hours], index) => (
                  <View key={index} style={styles.distributionItem}>
                    <View style={styles.distributionLabel}>
                      <Text style={styles.distributionSubject}>{subject}</Text>
                      <Text style={styles.distributionHours}>{hours.toFixed(1)}h</Text>
                    </View>
                    <View style={styles.distributionBarContainer}>
                      <View
                        style={[
                          styles.distributionBar,
                          { width: `${Math.min((hours / Math.max(...Object.values(stats.subjectDistribution))) * 100, 100)}%` }
                        ]}
                      />
                    </View>
                  </View>
                ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>暂无科目分布数据</Text>
          )}
        </Card>

        {/* Learning Records Summary */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>学习记录</Text>
          
          <View style={styles.recordsSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{studyRecords.length}</Text>
              <Text style={styles.summaryLabel}>总记录数</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalKeyPoints}</Text>
              <Text style={styles.summaryLabel}>重点内容</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalMistakes}</Text>
              <Text style={styles.summaryLabel}>错题总数</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{masteredMistakes}</Text>
              <Text style={styles.summaryLabel}>已掌握错题</Text>
            </View>
          </View>
        </Card>

        {/* Settings Section */}
        <Card style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>设置</Text>
          
          <View style={styles.settingsList}>
            <Button
              title="导出数据"
              onPress={() => {}}
              variant="outline"
              size="medium"
              style={styles.settingButton}
            />
            <Button
              title="清空数据"
              onPress={() => {}}
              variant="outline"
              size="medium"
              style={styles.settingButton}
            />
            <Button
              title="关于应用"
              onPress={() => {}}
              variant="outline"
              size="medium"
              style={styles.settingButton}
            />
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  distributionList: {
    marginTop: 8,
  },
  distributionItem: {
    marginBottom: 16,
  },
  distributionLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  distributionSubject: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  distributionHours: {
    fontSize: 14,
    color: '#6B7280',
  },
  distributionBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 16,
  },
  recordsSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  summaryItem: {
    width: '48%',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingsList: {
    flexDirection: 'column',
  },
  settingButton: {
    marginBottom: 12,
  },
});

export default ProfileScreen;
