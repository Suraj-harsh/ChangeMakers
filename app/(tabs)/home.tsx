import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Color constants
const COLORS = {
  primary: '#007BFF',
  success: '#28A745',
  alert: '#DC3545',
  gray: {
    light: '#f8f9fa',
    medium: '#6c757d',
    dark: '#343a40'
  },
  white: '#FFFFFF'
} as const;

// Dummy data for projects
export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  progress: number;
  fundingRaised: number;
  fundingGoal: number;
  volunteers: number;
}

// Dummy data for projects
const dummyProjects: Project[] = [
  {
    id: '1',
    title: 'Community Garden Initiative',
    description: 'Creating sustainable gardens in urban areas to promote food security and community engagement.',
    location: 'Brooklyn, NY',
    category: 'Environment',
    progress: 75,
    fundingRaised: 15000,
    fundingGoal: 20000,
    volunteers: 28,
  },
  {
    id: '2',
    title: 'Youth Tech Education Program',
    description: 'Providing coding and digital skills training to underprivileged youth in local communities.',
    location: 'San Francisco, CA',
    category: 'Education',
    progress: 45,
    fundingRaised: 25000,
    fundingGoal: 50000,
    volunteers: 15,
  },
  {
    id: '3',
    title: 'Elderly Care Support Network',
    description: 'Connecting volunteers with elderly residents for companionship and daily assistance.',
    location: 'Chicago, IL',
    category: 'Healthcare',
    progress: 90,
    fundingRaised: 35000,
    fundingGoal: 40000,
    volunteers: 42,
  },
];

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.7}
    onPress={() => router.push(`/project-details?id=${project.id}`)}
  >
    <View style={styles.categoryTag}>
      <Text style={styles.categoryText}>{project.category.toUpperCase()}</Text>
    </View>
    <Text style={styles.projectTitle}>{project.title}</Text>
    <Text style={styles.description} numberOfLines={2}>{project.description}</Text>
    <View style={styles.locationCategory}>
      <Text style={styles.secondaryText}>
        <MaterialIcons name="location-on" size={14} color={COLORS.gray.medium} /> {project.location}
      </Text>
    </View>

    {/* Progress Bar */}
    <View style={styles.progressBarContainer}>
      <View style={[styles.progressBar, {
        width: `${project.progress}%`,
        backgroundColor: project.progress >= 100 ? COLORS.success : COLORS.primary
      }]} />
    </View>
    <View style={styles.progressRow}>
      <Text style={styles.progressText}>{project.progress}% Complete</Text>
      <Text style={[styles.progressText, project.progress >= 100 && styles.successText]}>
        {project.progress >= 100 ? 'COMPLETED' : 'IN PROGRESS'}
      </Text>
    </View>

    {/* Funding Status */}
    <View style={styles.fundingContainer}>
      <Text style={styles.fundingLabel}>FUNDING GOAL</Text>
      <Text style={styles.fundingText}>
        <Text style={styles.fundingHighlight}>${project.fundingRaised.toLocaleString()}</Text>
        <Text style={styles.fundingSecondary}> / ${project.fundingGoal.toLocaleString()}</Text>
      </Text>
    </View>

    {/* Volunteers */}
    <View style={styles.footer}>
      <View style={styles.volunteersContainer}>
        <MaterialIcons name="people" size={16} color={COLORS.primary} />
        <Text style={styles.volunteersText}>{project.volunteers} Volunteers</Text>
      </View>
      <Text style={styles.viewDetailsText}>VIEW DETAILS →</Text>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const handleCreatePost = () => {
    // TODO: Implement post creation functionality
    console.log('Create post button pressed');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recommended Projects</Text>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {dummyProjects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ScrollView>

      {/* Floating Action Button - Twitter style */}
      <TouchableOpacity
        style={styles.fabContainer}
        onPress={handleCreatePost}
        activeOpacity={0.8}
      >
        <View style={styles.fab}>
          <MaterialIcons name="edit" size={24} color="#fff" />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray.light,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: COLORS.white,
    color: COLORS.gray.dark,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  scrollView: {
    flex: 1,
    paddingTop: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: COLORS.primary + '15',
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  projectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: COLORS.gray.dark,
  },
  description: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginBottom: 12,
    lineHeight: 20,
  },
  locationCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  secondaryText: {
    fontSize: 14,
    color: COLORS.gray.medium,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E9ECEF',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray.medium,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  successText: {
    color: COLORS.success,
  },
  fundingContainer: {
    marginBottom: 16,
  },
  fundingLabel: {
    fontSize: 12,
    color: COLORS.gray.medium,
    marginBottom: 4,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  fundingText: {
    fontSize: 16,
  },
  fundingHighlight: {
    color: COLORS.gray.dark,
    fontWeight: 'bold',
  },
  fundingSecondary: {
    color: COLORS.gray.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  volunteersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volunteersText: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginLeft: 6,
  },
  viewDetailsText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
}); 