import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, RefreshControl } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Post from '../components/Post';
import { Project, Post as PostType, FeedItem } from '../types';

// Dummy data for projects
const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Environmental Cleanup',
    description: 'Join us in cleaning up local parks and beaches',
    location: 'New York',
    category: 'Environment',
    image: 'https://picsum.photos/400/300',
    members: 45,
    progress: 75,
    fundingRaised: 15000,
    fundingGoal: 20000,
    volunteers: 28,
    profilePicture: 'https://picsum.photos/100/100'
  },
  {
    id: '2',
    title: 'Education for All',
    description: 'Providing free education to underprivileged children',
    location: 'San Francisco',
    category: 'Education',
    image: 'https://picsum.photos/400/301',
    members: 32,
    progress: 60,
    fundingRaised: 25000,
    fundingGoal: 50000,
    volunteers: 15,
    profilePicture: 'https://picsum.photos/100/101'
  },
  {
    id: '3',
    title: 'Food Bank Initiative',
    description: 'Helping families in need with food supplies',
    location: 'Chicago',
    category: 'Social Welfare',
    image: 'https://picsum.photos/400/302',
    members: 28,
    progress: 85,
    fundingRaised: 35000,
    fundingGoal: 40000,
    volunteers: 42,
    profilePicture: 'https://picsum.photos/100/102'
  }
];

// Dummy data for posts
const POSTS: PostType[] = [
  {
    id: '4',
    title: 'Community Garden Update',
    description: 'Our community garden is thriving! Check out the progress.',
    location: 'Seattle',
    category: 'Environment',
    mediaItems: [
      { uri: 'https://picsum.photos/400/303', type: 'image' },
      { uri: 'https://picsum.photos/400/304', type: 'image' }
    ],
    username: 'johndoe',
    timestamp: '2 hours ago'
  },
  {
    id: '5',
    title: 'Volunteer Opportunity',
    description: 'Looking for volunteers for our weekend cleanup event.',
    location: 'Boston',
    category: 'Social Welfare',
    mediaItems: [
      { uri: 'https://picsum.photos/400/305', type: 'image' }
    ],
    username: 'janedoe',
    timestamp: '5 hours ago'
  }
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // TODO: Implement actual refresh logic
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const handleCreatePost = () => {
    router.push('/create-post');
  };

  const renderProject = ({ item }: { item: Project }) => (
    <TouchableOpacity style={styles.projectCard}>
      <Image source={{ uri: item.image }} style={styles.projectImage} />
      <View style={styles.projectContent}>
        <Text style={styles.projectTitle}>{item.title}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
        <View style={styles.projectMeta}>
          <View style={styles.metaItem}>
            <MaterialIcons name="location-on" size={16} color="#666" />
            <Text style={styles.metaText}>{item.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialIcons name="category" size={16} color="#666" />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.projectFooter}>
          <View style={styles.memberCount}>
            <MaterialIcons name="people" size={16} color="#666" />
            <Text style={styles.memberText}>{item.members} members</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${item.progress}%` }]} />
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPost = ({ item }: { item: PostType }) => (
    <Post
      title={item.title}
      description={item.description}
      location={item.location}
      category={item.category}
      mediaItems={item.mediaItems}
      username={item.username}
      timestamp={item.timestamp}
    />
  );

  const renderItem = ({ item, index }: { item: FeedItem; index: number }) => {
    if (index < PROJECTS.length) {
      return renderProject({ item: item as Project });
    }
    return renderPost({ item: item as PostType });
  };

  // Combine projects and posts with unique keys
  const feedData = [
    ...PROJECTS.map(project => ({ ...project, type: 'project' })),
    ...POSTS.map(post => ({ ...post, type: 'post' }))
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Home',
          headerShown: true,
        }}
      />
      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
          />
        }
      />
      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <MaterialIcons name="edit" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  projectImage: {
    width: '100%',
    height: 200,
  },
  projectContent: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginLeft: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 