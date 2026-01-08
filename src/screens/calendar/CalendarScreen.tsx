import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Card } from '../../components/ui';
import { useAppStore } from '../../store';
import { StudyRecord } from '../../types';
import dayjs from 'dayjs';

const CalendarScreen: React.FC = () => {
  const { studyRecords } = useAppStore();
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Get all study dates for marking on calendar
  const studyDates = new Set(studyRecords.filter(r => r.isCompleted).map(r => r.date));

  // Get selected date's study records
  const selectedDateRecords = studyRecords.filter(r => r.date === selectedDate);

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const year = currentMonth.year();
    const month = currentMonth.month();
    const firstDay = dayjs(new Date(year, month, 1));
    const lastDay = dayjs(new Date(year, month + 1, 0));
    const firstDayOfWeek = firstDay.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const totalDays = lastDay.date();
    const totalCells = Math.ceil((firstDayOfWeek + totalDays) / 7) * 7;

    const days = [];
    let dayNumber = 1;

    for (let i = 0; i < totalCells; i++) {
      const isCurrentMonth = i >= firstDayOfWeek && dayNumber <= totalDays;
      const date = isCurrentMonth ? dayjs(new Date(year, month, dayNumber++)) : null;
      const dateString = date ? date.format('YYYY-MM-DD') : null;
      const hasStudyRecord = dateString ? studyDates.has(dateString) : false;
      const isToday = date ? date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') : false;
      const isSelected = dateString === selectedDate;

      days.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.dayCell,
            isCurrentMonth && styles.currentMonthDay,
            isToday && styles.todayDay,
            isSelected && styles.selectedDay,
            hasStudyRecord && styles.studiedDay
          ]}
          onPress={() => dateString && setSelectedDate(dateString)}
          disabled={!isCurrentMonth}
        >
          {isCurrentMonth && (
            <>
              <Text
                style={[
                  styles.dayText,
                  isToday && styles.todayText,
                  isSelected && styles.selectedText
                ]}
              >
                {date?.date()}
              </Text>
              {hasStudyRecord && <View style={styles.studyIndicator} />}
            </>
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
    setSelectedDate(null);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
    setSelectedDate(null);
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentMonth(dayjs());
    setSelectedDate(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>学习日历</Text>
      </View>

      <Card style={styles.calendarCard}>
        {/* Calendar Header */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.monthTitleContainer}>
            <Text style={styles.monthTitle}>{currentMonth.format('YYYY年MM月')}</Text>
          </View>
          <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View style={styles.weekDaysHeader}>
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <View key={index} style={styles.weekDayCell}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Days */}
        <View style={styles.calendarGrid}>
          {generateCalendarDays()}
        </View>

        {/* Today Button */}
        <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
          <Text style={styles.todayButtonText}>今天</Text>
        </TouchableOpacity>
      </Card>

      {/* Study Records for Selected Date */}
      {selectedDate && (
        <Card style={styles.recordsCard}>
          <Text style={styles.recordsTitle}>
            {selectedDate ? dayjs(selectedDate).format('YYYY年MM月DD日') : ''} 学习记录
          </Text>
          {selectedDateRecords.length > 0 ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedDateRecords.map((record, index) => (
                <View key={record.id} style={styles.recordItem}>
                  <View style={styles.recordHeader}>
                    <Text style={styles.recordSubject}>{record.subject}</Text>
                    <Text style={styles.recordStatus}>
                      {record.isCompleted ? '✅' : '❌'}
                    </Text>
                  </View>
                  {record.duration && (
                    <Text style={styles.recordDuration}>时长: {record.duration} 分钟</Text>
                  )}
                  {record.content && (
                    <Text style={styles.recordContent}>{record.content}</Text>
                  )}
                  {record.tags.length > 0 && (
                    <View style={styles.recordTags}>
                      {record.tags.map((tag, tagIndex) => (
                        <View key={tagIndex} style={styles.recordTag}>
                          <Text style={styles.recordTagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noRecordsText}>当天没有学习记录</Text>
          )}
        </Card>
      )}
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
  calendarCard: {
    marginBottom: 16,
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#374151',
    fontWeight: '600',
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  currentMonthDay: {
    borderRadius: 8,
  },
  todayDay: {
    backgroundColor: '#EFF6FF',
  },
  selectedDay: {
    backgroundColor: '#3B82F6',
  },
  studiedDay: {
    position: 'relative',
  },
  dayText: {
    fontSize: 16,
    color: '#374151',
  },
  todayText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  studyIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  todayButton: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  todayButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  recordsCard: {
    flex: 1,
    padding: 16,
  },
  recordsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  recordItem: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  recordStatus: {
    fontSize: 16,
  },
  recordDuration: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  recordContent: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 20,
  },
  recordTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recordTag: {
    backgroundColor: '#EBF5FF',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  recordTagText: {
    fontSize: 12,
    color: '#3B82F6',
  },
  noRecordsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default CalendarScreen;
