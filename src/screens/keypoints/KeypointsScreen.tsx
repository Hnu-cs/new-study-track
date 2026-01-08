import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Card, Button, Input } from '../../components/ui';
import { useAppStore } from '../../store';
import { KeyPoint } from '../../types';
import dayjs from 'dayjs';

const KeypointsScreen: React.FC = () => {
  const { keyPoints, addKeyPoint, deleteKeyPoint } = useAppStore();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Form state
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  // Filter state
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all');
  
  // Get all unique tags from key points
  const allTags = Array.from(new Set(keyPoints.flatMap(point => point.tags)));
  
  // Filter key points based on selected tag
  const filteredKeyPoints = selectedTag === 'all' 
    ? keyPoints 
    : keyPoints.filter(point => point.tags.includes(selectedTag));
  
  // Sort key points by date (newest first)
  const sortedKeyPoints = filteredKeyPoints.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  const handleAddTag = () => {
    const tag = tagsInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagsInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleAddKeyPoint = () => {
    if (!content.trim()) {
      Alert.alert('提示', '请填写重点内容');
      return;
    }
    
    addKeyPoint({
      content: content.trim(),
      date: dayjs().format('YYYY-MM-DD'),
      tags: tags,
      images: [],
    });
    
    // Reset form
    setContent('');
    setTagsInput('');
    setTags([]);
    setIsModalVisible(false);
  };
  
  const handleDeleteKeyPoint = (keyPointId: string) => {
    Alert.alert(
      '删除重点内容',
      '确定要删除这个重点内容吗？此操作不可恢复。',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '删除', 
          style: 'destructive',
          onPress: () => deleteKeyPoint(keyPointId)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>重点内容</Text>
        <Button
          title="添加重点"
          onPress={() => setIsModalVisible(true)}
          variant="primary"
          size="small"
        />
      </View>
      
      {/* Tag Filter */}
      {allTags.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.tagFilterContainer}
        >
          <Button
            title="全部"
            onPress={() => setSelectedTag('all')}
            variant={selectedTag === 'all' ? 'primary' : 'outline'}
            size="small"
            style={styles.tagButton}
          />
          {allTags.map(tag => (
            <Button
              key={tag}
              title={tag}
              onPress={() => setSelectedTag(tag)}
              variant={selectedTag === tag ? 'primary' : 'outline'}
              size="small"
              style={styles.tagButton}
            />
          ))}
        </ScrollView>
      )}

      {sortedKeyPoints.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.keyPointsList}>
          {sortedKeyPoints.map((keyPoint) => (
            <Card key={keyPoint.id} style={styles.keyPointCard}>
              <View style={styles.keyPointHeader}>
                <Text style={styles.keyPointDate}>
                  {dayjs(keyPoint.date).format('YYYY-MM-DD')}
                </Text>
                <Button
                  title="删除"
                  onPress={() => handleDeleteKeyPoint(keyPoint.id)}
                  variant="outline"
                  size="small"
                />
              </View>
              
              <Text style={styles.keyPointContent}>{keyPoint.content}</Text>
              
              {keyPoint.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {keyPoint.tags.map(tag => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          ))}
        </ScrollView>
      ) : (
        <Card style={styles.contentCard}>
          <Text style={styles.placeholder}>暂无重点记录</Text>
          <Text style={styles.placeholderHint}>
            {selectedTag === 'all' 
              ? '点击右上角按钮添加重点内容' 
              : `没有带有标签 "${selectedTag}" 的重点记录`}
          </Text>
        </Card>
      )}
      
      {/* Add Key Point Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>添加重点内容</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButton}>×</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Input
                label="重点内容"
                placeholder="详细描述重点内容"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
                style={styles.input}
              />
              
              <View style={styles.tagsSection}>
                <Text style={styles.tagsLabel}>标签</Text>
                <View style={styles.tagsInputContainer}>
                  <Input
                    placeholder="添加标签"
                    value={tagsInput}
                    onChangeText={setTagsInput}
                    onSubmitEditing={handleAddTag}
                    returnKeyType="done"
                    style={styles.tagInput}
                  />
                  <Button
                    title="添加"
                    onPress={handleAddTag}
                    variant="primary"
                    size="small"
                    style={styles.addTagButton}
                  />
                </View>
                
                {tags.length > 0 && (
                  <View style={styles.selectedTagsContainer}>
                    {tags.map((tag, index) => (
                      <View key={index} style={styles.selectedTag}>
                        <Text style={styles.selectedTagText}>{tag}</Text>
                        <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                          <Text style={styles.removeTagButton}>×</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
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
                onPress={handleAddKeyPoint}
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
  tagFilterContainer: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  tagButton: {
    marginRight: 8,
  },
  keyPointsList: {
    flex: 1,
  },
  keyPointCard: {
    marginBottom: 16,
    padding: 16,
  },
  keyPointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  keyPointDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  keyPointContent: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 12,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  contentCard: {
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
  tagsSection: {
    marginBottom: 20,
  },
  tagsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  tagsInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    marginBottom: 0,
  },
  addTagButton: {
    justifyContent: 'center',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  selectedTagText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  removeTagButton: {
    fontSize: 18,
    color: '#6B7280',
    lineHeight: 18,
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

export default KeypointsScreen;
