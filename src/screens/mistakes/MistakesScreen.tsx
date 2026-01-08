import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Card, Button, Input } from '../../components/ui';
import { useAppStore } from '../../store';
import { Mistake } from '../../types';
import dayjs from 'dayjs';
import { Image } from 'react-native';

const MistakesScreen: React.FC = () => {
  const { mistakes, addMistake, toggleMistakeMastery, deleteMistake } = useAppStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMistake, setSelectedMistake] = useState<Mistake | null>(null);
  
  // Form state
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [errorReason, setErrorReason] = useState('');
  const [importance, setImportance] = useState(3);
  
  // Filter state
  const [filter, setFilter] = useState<'all' | 'mastered' | 'unmastered'>('all');
  
  // Filter mistakes based on selection
  const filteredMistakes = mistakes.filter(mistake => {
    if (filter === 'mastered') return mistake.isMastered;
    if (filter === 'unmastered') return !mistake.isMastered;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const handleAddMistake = () => {
    if (!content.trim() || !subject.trim() || !errorReason.trim()) {
      Alert.alert('提示', '请填写完整的错题信息');
      return;
    }
    
    addMistake({
      content: content.trim(),
      date: dayjs().format('YYYY-MM-DD'),
      subject: subject.trim(),
      errorReason: errorReason.trim(),
      importance,
      isMastered: false,
      images: []
    });
    
    // Reset form
    setContent('');
    setSubject('');
    setErrorReason('');
    setImportance(3);
    setIsModalVisible(false);
  };
  
  const handleToggleMastery = (mistakeId: string) => {
    toggleMistakeMastery(mistakeId);
  };
  
  const handleDeleteMistake = (mistakeId: string) => {
    Alert.alert(
      '删除错题',
      '确定要删除这个错题吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '删除', 
          style: 'destructive',
          onPress: () => deleteMistake(mistakeId)
        }
      ]
    );
  };
  
  const renderImportanceStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setImportance(index + 1)}
        style={styles.starButton}
      >
        <Text style={[
          styles.star,
          index < rating ? styles.filledStar : styles.emptyStar
        ]}>★</Text>
      </TouchableOpacity>
    ));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>错题本</Text>
        <Button
          title="添加错题"
          onPress={() => setIsModalVisible(true)}
          variant="primary"
          size="small"
        />
      </View>
      
      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        <Button
          title="全部"
          onPress={() => setFilter('all')}
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="small"
          style={styles.filterButton}
        />
        <Button
          title="已掌握"
          onPress={() => setFilter('mastered')}
          variant={filter === 'mastered' ? 'primary' : 'outline'}
          size="small"
          style={styles.filterButton}
        />
        <Button
          title="未掌握"
          onPress={() => setFilter('unmastered')}
          variant={filter === 'unmastered' ? 'primary' : 'outline'}
          size="small"
          style={styles.filterButton}
        />
      </View>
      
      {filteredMistakes.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.mistakesList}>
          {filteredMistakes.map((mistake) => (
            <Card key={mistake.id} style={styles.mistakeCard}>
              <View style={styles.mistakeHeader}>
                <Text style={styles.mistakeDate}>
                  {dayjs(mistake.date).format('YYYY-MM-DD')}
                </Text>
                <Text style={styles.mistakeSubject}>{mistake.subject}</Text>
              </View>
              
              <Text style={styles.mistakeContent}>{mistake.content}</Text>
              
              <View style={styles.mistakeDetails}>
                <Text style={styles.errorReasonLabel}>错误原因:</Text>
                <Text style={styles.errorReason}>{mistake.errorReason}</Text>
              </View>
              
              <View style={styles.mistakeFooter}>
                <View style={styles.importanceContainer}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Text key={index} style={[
                      styles.importanceStar,
                      index < mistake.importance ? styles.filledStar : styles.emptyStar
                    ]}>★</Text>
                  ))}
                </View>
                
                <View style={styles.actionButtons}>
                  <Button
                    title={mistake.isMastered ? '取消掌握' : '标记掌握'}
                    onPress={() => handleToggleMastery(mistake.id)}
                    variant={mistake.isMastered ? 'secondary' : 'primary'}
                    size="small"
                    style={styles.actionButton}
                  />
                  <Button
                    title="删除"
                    onPress={() => handleDeleteMistake(mistake.id)}
                    variant="outline"
                    size="small"
                    style={styles.actionButton}
                  />
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.placeholder}>暂无错题记录</Text>
          <Text style={styles.placeholderHint}>
            {filter === 'all' 
              ? '点击右上角按钮添加错题' 
              : `当前没有${filter === 'mastered' ? '已掌握' : '未掌握'}的错题`}
          </Text>
        </Card>
      )}
      
      {/* Add Mistake Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>添加错题</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Input
                label="错题内容"
                placeholder="详细描述错题内容"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={3}
                style={styles.input}
              />
              
              <Input
                label="科目"
                placeholder="例如：数学、英语、物理"
                value={subject}
                onChangeText={setSubject}
                style={styles.input}
              />
              
              <Input
                label="错误原因"
                placeholder="分析错误的原因"
                value={errorReason}
                onChangeText={setErrorReason}
                multiline
                numberOfLines={2}
                style={styles.input}
              />
              
              <View style={styles.importanceSection}>
                <Text style={styles.importanceLabel}>重要程度</Text>
                <View style={styles.starsContainer}>
                  {renderImportanceStars(importance)}
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                title="取消"
                onPress={() => setIsModalVisible(false)}
                variant="outline"
                size="medium"
                style={styles.modalButton}
              />
              <Button
                title="保存"
                onPress={handleAddMistake}
                variant="primary"
                size="medium"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    flex: 1,
  },
  mistakesList: {
    flex: 1,
  },
  mistakeCard: {
    marginBottom: 16,
    padding: 16,
  },
  mistakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mistakeDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  mistakeSubject: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  mistakeContent: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    lineHeight: 22,
  },
  mistakeDetails: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorReasonLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  errorReason: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  mistakeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  importanceContainer: {
    flexDirection: 'row',
  },
  importanceStar: {
    fontSize: 18,
  },
  filledStar: {
    color: '#F59E0B',
  },
  emptyStar: {
    color: '#D1D5DB',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    minWidth: 80,
  },
  emptyCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 8,
  },
  placeholderHint: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    fontSize: 32,
    color: '#6B7280',
    lineHeight: 32,
  },
  modalContent: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  importanceSection: {
    marginBottom: 20,
  },
  importanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 32,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  modalButton: {
    flex: 1,
  },
});

export default MistakesScreen;
