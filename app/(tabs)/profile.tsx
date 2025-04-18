import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';

// Color constants (same as other pages)
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

// Dummy user data
interface UserData {
  id: string;
  username: string;
  bio: string;
  location: string;
  email: string;
  interests: string[];
  isVerified: boolean;
  trustScore: number;
  impactScore: number;
  achievements: Achievement[];
  projects: Project[];
  posts: Post[];
  volunteerHistory: VolunteerActivity[];
  donations: Donation[];
  endorsements: Endorsement[];
  avatar: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  date: string;
}

interface Project {
  id: string;
  title: string;
  location: string;
  progress: number;
  role: 'admin' | 'volunteer' | 'donor';
}

interface VolunteerActivity {
  id: string;
  projectName: string;
  role: string;
  tasksCompleted: number;
  hoursContributed: number;
  dateRange: string;
}

interface Donation {
  id: string;
  projectName: string;
  amount: number;
  date: string;
  progress: number;
}

interface Endorsement {
  id: string;
  projectName: string;
  rating: number;
  review: string;
  date: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

const dummyUser: UserData = {
  id: "1",
  username: "Sarah Johnson",
  bio: "Passionate about sustainable development and community building. Looking to make a positive impact through technology and education.",
  location: "San Francisco, CA",
  email: "sarah.j@example.com",
  interests: ["Education", "Environment", "Technology", "Social Justice"],
  isVerified: true,
  trustScore: 95,
  impactScore: 850,
  achievements: [
    {
      id: "1",
      title: "Project Pioneer",
      description: "Successfully launched 5 community projects",
      icon: "🚀",
      date: "2024-03"
    },
    {
      id: "2",
      title: "Super Volunteer",
      description: "Contributed 100+ hours to community projects",
      icon: "⭐",
      date: "2024-02"
    }
  ],
  projects: [
    {
      id: "1",
      title: "Youth Tech Education Program",
      location: "San Francisco, CA",
      progress: 75,
      role: "admin"
    },
    {
      id: "2",
      title: "Community Garden Initiative",
      location: "Oakland, CA",
      progress: 90,
      role: "volunteer"
    }
  ],
  posts: [
    {
      id: "1",
      title: "First Post",
      content: "This is the content of the first post. It's a great way to share information and engage with others.",
      likes: 10,
      comments: 2,
      createdAt: "2024-03-15"
    },
    {
      id: "2",
      title: "Second Post",
      content: "This is the content of the second post. It's a great way to share information and engage with others.",
      likes: 5,
      comments: 1,
      createdAt: "2024-03-10"
    }
  ],
  volunteerHistory: [
    {
      id: "1",
      projectName: "Community Garden Initiative",
      role: "Garden Coordinator",
      tasksCompleted: 12,
      hoursContributed: 48,
      dateRange: "Jan 2024 - Present"
    }
  ],
  donations: [
    {
      id: "1",
      projectName: "Youth Tech Education Program",
      amount: 500,
      date: "2024-03-15",
      progress: 75
    }
  ],
  endorsements: [
    {
      id: "1",
      projectName: "Community Garden Initiative",
      rating: 5,
      review: "Amazing initiative that truly transforms the community!",
      date: "2024-03-10"
    }
  ],
  avatar: "https://example.com/sarah-johnson.jpg"
};

const ProfileHeader: React.FC<{ user: UserData }> = ({ user }) => {
  const router = useRouter();

  const handleEditProfile = () => {
    console.log('Edit Profile button pressed');
    try {
      router.push('/edit-profile');
      console.log('Navigation attempted');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.avatarContainer}>
        {user.avatar.startsWith('http') || user.avatar.startsWith('file://') ? (
          <Image
            source={{ uri: user.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarPlaceholderText}>{user.avatar}</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.changeAvatarButton}
          onPress={handleEditProfile}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons name="camera-alt" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.username}>{user.username}</Text>
          {user.isVerified && (
            <MaterialIcons name="verified" size={20} color={COLORS.primary} />
          )}
        </View>
        <Text style={styles.location}>
          <MaterialIcons name="location-on" size={16} color={COLORS.gray.medium} />
          {user.location}
        </Text>
        <Text style={styles.bio}>{user.bio}</Text>
        <View style={styles.interestsContainer}>
          {user.interests.map((interest, index) => (
            <View key={index} style={styles.interestTag}>
              <Text style={styles.interestText}>{interest}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.editProfileButton, { opacity: 1 }]}
        onPress={handleEditProfile}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.editProfileText}>EDIT PROFILE</Text>
      </TouchableOpacity>
    </View>
  );
};

const ScoreCard: React.FC<{ title: string; score: number; icon: string }> = ({ title, score, icon }) => (
  <View style={styles.scoreCard}>
    <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={24} color={COLORS.primary} />
    <Text style={styles.scoreTitle}>{title}</Text>
    <Text style={styles.scoreValue}>{score}</Text>
  </View>
);

const SectionHeader: React.FC<{ title: string; action?: string }> = ({ title, action }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
      <TouchableOpacity>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <TouchableOpacity
    style={styles.projectCard}
    onPress={() => router.push(`/project-details?id=${project.id}`)}
  >
    <View style={styles.projectHeader}>
      <Text style={styles.projectTitle}>{project.title}</Text>
      <View style={styles.roleTag}>
        <Text style={styles.roleText}>{project.role.toUpperCase()}</Text>
      </View>
    </View>
    <Text style={styles.projectLocation}>{project.location}</Text>
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { width: `${project.progress}%` }]} />
      <Text style={styles.progressText}>{project.progress}% Complete</Text>
    </View>
  </TouchableOpacity>
);

const ProjectsSection = ({ projects, onViewAll }: { projects: Project[], onViewAll: () => void }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Projects</Text>
      <TouchableOpacity onPress={onViewAll}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
    {projects.map(project => (
      <ProjectCard key={project.id} project={project} />
    ))}
  </View>
);

const PostsSection = ({ posts, onViewAll }: { posts: Post[], onViewAll: () => void }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Posts</Text>
      <TouchableOpacity onPress={onViewAll}>
        <Text style={styles.viewAllText}>View All</Text>
      </TouchableOpacity>
    </View>
    {posts?.map(post => (
      <View key={post.id} style={styles.postItem}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.postContent} numberOfLines={2}>{post.content}</Text>
        <View style={styles.postMeta}>
          <View style={styles.postStat}>
            <MaterialIcons name="thumb-up" size={16} color="#666" />
            <Text style={styles.postStatText}>{post.likes}</Text>
          </View>
          <View style={styles.postStat}>
            <MaterialIcons name="chat" size={16} color="#666" />
            <Text style={styles.postStatText}>{post.comments}</Text>
          </View>
          <Text style={styles.postDate}>{post.createdAt}</Text>
        </View>
      </View>
    ))}
  </View>
);

export default function ProfileScreen() {
  const { userData } = useUser();

  const handleViewAllProjects = () => {
    router.push(`/user-projects/${userData.id}`);
  };

  const handleViewAllPosts = () => {
    router.push(`/user-posts/${userData.id}`);
  };

  return (
    <View style={styles.mainContainer}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.container}>
        <ProfileHeader user={userData} />

        {/* Scores Section */}
        <View style={styles.scoresContainer}>
          <ScoreCard title="Trust Score" score={userData.trustScore} icon="thumb-up" />
          <ScoreCard title="Impact Score" score={userData.impactScore} icon="star" />
        </View>

        {/* Projects Section */}
        <ProjectsSection projects={userData.projects} onViewAll={handleViewAllProjects} />

        {/* Posts Section */}
        <PostsSection posts={userData.posts || []} onViewAll={handleViewAllPosts} />

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="settings" size={24} color={COLORS.gray.dark} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="security" size={24} color={COLORS.gray.dark} />
            <Text style={styles.actionText}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="help" size={24} color={COLORS.gray.dark} />
            <Text style={styles.actionText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MaterialIcons name="logout" size={24} color={COLORS.alert} />
            <Text style={[styles.actionText, { color: COLORS.alert }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.gray.light,
  },
  headerBar: {
    height: 60,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray.dark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.gray.light,
  },
  header: {
    backgroundColor: COLORS.white,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.gray.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: COLORS.white,
    fontSize: 36,
    fontWeight: 'bold',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray.dark,
    marginRight: 8,
  },
  location: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: COLORS.gray.dark,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  interestTag: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    margin: 4,
  },
  interestText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  scoresContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-around',
  },
  scoreCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreTitle: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginVertical: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.gray.dark,
  },
  section: {
    marginTop: 16,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray.dark,
  },
  sectionAction: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  projectCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray.dark,
    flex: 1,
  },
  roleTag: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  roleText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '500',
  },
  projectLocation: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E9ECEF',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.gray.medium,
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.white,
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    color: COLORS.gray.dark,
    marginTop: 4,
  },
  editProfileButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    marginTop: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  editProfileText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  viewAllText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  postItem: {
    backgroundColor: COLORS.gray.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.gray.dark,
  },
  postContent: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginBottom: 12,
    lineHeight: 20,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatText: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginLeft: 4,
  },
  postDate: {
    fontSize: 12,
    color: COLORS.gray.medium,
  },
}); 