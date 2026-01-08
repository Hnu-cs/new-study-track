import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Card, Button, Input } from '../../components/ui';
import { useAppStore } from '../../store';
import { StudyRecord } from '../../types';
import dayjs from 'dayjs';

const HomeScreen: React.FC = () => {
  const { stats, isLoading, toggleStudyCompletion, addStudyRecord, studyRecords } = useAppStore();
  const today = dayjs().format('YYYY-MM-DD');
  const todayFormatted = dayjs().format('YYYY年M月D日');
  
  // Form state
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  // Check if today has been studied
  const todayRecord = studyRecords.find(record => record.date === today);
  const isTodayStudied = todayRecord?.isCompleted || false;

  if (Boolean(isLoading)) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>加载中...</Text>
      </SafeAreaView>
    );
  }

  const handleAddTag = () => {
    if (tag && !tags.includes(tag) && tags.length < 3) {
      setTags([...tags, tag]);
      setTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSaveStudyRecord = () => {
    if (!subject.trim()) return;
    
    const studyRecord: Omit<StudyRecord, 'id' | 'createdAt' | 'updatedAt'> = {
      date: today,
      subject: subject.trim(),
      duration: duration ? parseInt(duration, 10) : undefined,
      content: content.trim() || undefined,
      tags,
      isCompleted: true,
    };
    
    addStudyRecord(studyRecord);
    
    // Reset form
    setSubject('');
    setDuration('');
    setContent('');
    setTags([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.dateText}>{todayFormatted}</Text>
          <Text style={styles.greeting}>你好，今天也要加油学习！</Text>
        </View>

        <Card style={styles.statusCard}>
          <Text style={styles.statusTitle}>今日学习状态</Text>
          <Text style={styles.statusText}>
            {isTodayStudied ? '✅ 今日已学习' : '❌ 今日未学习'}
          </Text>
          <Text style={styles.streakText}>
            连续学习 {stats.currentStreak} 天
          </Text>
          <Button
            title={isTodayStudied ? '取消打卡' : '标记为已学习'}
            onPress={() => toggleStudyCompletion(today)}
            variant={isTodayStudied ? 'secondary' : 'primary'}
            size="large"
            style={styles.checkInButton}
          />
        </Card>

        <Card style={styles.recordCard}>
          <Text style={styles.recordTitle}>记录今日学习</Text>
          
          <Input
            label="学习主题/科目"
            placeholder="例如：数学、英语、编程"
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
          />
          
          <Input
            label="学习时长（分钟）"
            placeholder="可选"
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <Input
            label="学习内容"
            placeholder="简要描述今日学习内容（200字以内）"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={3}
            maxLength={200}
            style={styles.input}
          />
          
          <View style={styles.tagContainer}>
            <Input
              label="添加标签"
              placeholder="例如：数学、英语、编程"
              value={tag}
              onChangeText={setTag}
              style={styles.tagInput}
            />
            <Button
              title="添加"
              onPress={handleAddTag}
              variant="outline"
              size="small"
              style={styles.addTagButton}
            />
          </View>
          
          <View style={styles.tagsList}>
            {tags.map((t, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{t}</Text>
                <Button
                  title="×"
                  onPress={() => handleRemoveTag(t)}
                  variant="outline"
                  size="small"
                  style={styles.removeTagButton}
                  textStyle={styles.removeTagText}
                />
              </View>
            ))}
          </View>
          
          <Button
            title="保存学习记录"
            onPress={handleSaveStudyRecord}
            variant="primary"
            size="medium"
            style={styles.saveButton}
            disabled={!subject.trim()}
          />
        </Card>

        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>学习统计</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>学习天数</Text>
              <Text style={styles.statValue}>{stats.totalDays}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>总学习时长</Text>
              <Text style={styles.statValue}>{stats.totalHours.toFixed(1)}h</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>最长连续</Text>
              <Text style={styles.statValue}>{stats.longestStreak}天</Text>
            </View>
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
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statusCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    paddingVertical: 24,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
  },
  streakText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 20,
  },
  checkInButton: {
    minWidth: 200,
  },
  recordCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    marginBottom: 16,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#3B82F6',
    marginRight: 4,
  },
  removeTagButton: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    height: 24,
  },
  removeTagText: {
    fontSize: 12,
    lineHeight: 12,
    padding: 0,
  },
  saveButton: {
    marginTop: 8,
  },
  statsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
});

export default HomeScreen;
