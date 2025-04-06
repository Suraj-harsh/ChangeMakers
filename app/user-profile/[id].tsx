import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

interface UserProfile {
    id: string;
    name: string;
    avatar: string;
    joinDate: string;
    bio: string;
    skills: string[];
    projects: {
        id: string;
        title: string;
        role: string;
        status: 'active' | 'completed';
    }[];
    trustScore: number;
    impactScore: number;
    location: string;
    email: string;
    phone: string;
    socialLinks: {
        linkedin?: string;
        twitter?: string;
        instagram?: string;
    };
}

// Dummy user data
const USER_PROFILE: UserProfile = {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://picsum.photos/100/100',
    joinDate: '2024-01-15',
    bio: 'Environmental activist with 5 years of experience in community projects. Passionate about sustainable development and wildlife conservation.',
    skills: ['Project Management', 'Community Outreach', 'Environmental Science', 'Public Speaking'],
    projects: [
        {
            id: '1',
            title: 'Environmental Cleanup Initiative',
            role: 'Project Admin',
            status: 'active'
        },
        {
            id: '2',
            title: 'Tree Planting Campaign',
            role: 'Volunteer',
            status: 'completed'
        }
    ],
    trustScore: 85,
    impactScore: 92,
    location: 'New York, USA',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    socialLinks: {
        linkedin: 'linkedin.com/in/sarahjohnson',
        twitter: '@sarahjohnson',
        instagram: '@sarahjohnson'
    }
};

const ProfileHeader = ({ user }: { user: UserProfile }) => (
    <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
    </View>
);

const SkillsSection = ({ skills }: { skills: string[] }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
                <View key={index} style={styles.skillBadge}>
                    <Text style={styles.skillText}>{skill}</Text>
                </View>
            ))}
        </View>
    </View>
);

const ProjectsSection = ({ projects }: { projects: UserProfile['projects'] }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        {projects.map(project => (
            <View key={project.id} style={styles.projectItem}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <View style={styles.projectMeta}>
                    <Text style={styles.projectRole}>{project.role}</Text>
                    <View style={[
                        styles.statusBadge,
                        project.status === 'active' && styles.activeBadge
                    ]}>
                        <Text style={styles.statusText}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Text>
                    </View>
                </View>
            </View>
        ))}
    </View>
);

const ScoreButton = ({
    title,
    score,
    onPress,
    isActive
}: {
    title: string;
    score: number;
    onPress: () => void;
    isActive: boolean;
}) => (
    <TouchableOpacity
        style={[styles.scoreButton, isActive && styles.scoreButtonActive]}
        onPress={onPress}
        disabled={isActive}
    >
        <Text style={styles.scoreTitle}>{title}</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        <MaterialIcons
            name={title === "Trust Score" ? "verified" : "star"}
            size={24}
            color={isActive ? "#007AFF" : "#666"}
        />
    </TouchableOpacity>
);

const ContactInfo = ({ user }: { user: UserProfile }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.contactItem}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={styles.contactText}>{user.location}</Text>
        </View>
        <View style={styles.contactItem}>
            <MaterialIcons name="email" size={20} color="#666" />
            <Text style={styles.contactText}>{user.email}</Text>
        </View>
        <View style={styles.contactItem}>
            <MaterialIcons name="phone" size={20} color="#666" />
            <Text style={styles.contactText}>{user.phone}</Text>
        </View>
    </View>
);

const SocialLinks = ({ socialLinks }: { socialLinks: UserProfile['socialLinks'] }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>Social Links</Text>
        <View style={styles.socialLinksContainer}>
            {socialLinks.linkedin && (
                <TouchableOpacity style={styles.socialLink}>
                    <MaterialIcons name="people" size={24} color="#0077B5" />
                </TouchableOpacity>
            )}
            {socialLinks.twitter && (
                <TouchableOpacity style={styles.socialLink}>
                    <MaterialIcons name="chat" size={24} color="#1DA1F2" />
                </TouchableOpacity>
            )}
            {socialLinks.instagram && (
                <TouchableOpacity style={styles.socialLink}>
                    <MaterialIcons name="photo-camera" size={24} color="#E4405F" />
                </TouchableOpacity>
            )}
        </View>
    </View>
);

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams();
    const [user, setUser] = React.useState(USER_PROFILE);
    const [trustScoreActive, setTrustScoreActive] = React.useState(false);
    const [impactScoreActive, setImpactScoreActive] = React.useState(false);

    const handleTrustScore = () => {
        if (!trustScoreActive) {
            setUser(prev => ({ ...prev, trustScore: prev.trustScore + 1 }));
            setTrustScoreActive(true);
        }
    };

    const handleImpactScore = () => {
        if (!impactScoreActive) {
            setUser(prev => ({ ...prev, impactScore: prev.impactScore + 1 }));
            setImpactScoreActive(true);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Profile',
                    headerBackTitle: 'Back'
                }}
            />
            <ScrollView style={styles.container}>
                <ProfileHeader user={user} />
                <View style={styles.content}>
                    <View style={styles.scoresContainer}>
                        <ScoreButton
                            title="Trust Score"
                            score={user.trustScore}
                            onPress={handleTrustScore}
                            isActive={trustScoreActive}
                        />
                        <ScoreButton
                            title="Impact Score"
                            score={user.impactScore}
                            onPress={handleImpactScore}
                            isActive={impactScoreActive}
                        />
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.bio}>{user.bio}</Text>
                    </View>

                    <ContactInfo user={user} />
                    <SocialLinks socialLinks={user.socialLinks} />
                    <SkillsSection skills={user.skills} />
                    <ProjectsSection projects={user.projects} />
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#f8f9fa',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    joinDate: {
        fontSize: 14,
        color: '#666',
    },
    content: {
        padding: 16,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    bio: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillBadge: {
        backgroundColor: '#e9ecef',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    skillText: {
        fontSize: 14,
        color: '#333',
    },
    projectItem: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    projectTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    projectMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    projectRole: {
        fontSize: 14,
        color: '#666',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#e9ecef',
    },
    activeBadge: {
        backgroundColor: '#28a745',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#fff',
    },
    scoresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    scoreButton: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    scoreButtonActive: {
        backgroundColor: '#e6f2ff',
    },
    scoreTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    scoreValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    contactText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    socialLinksContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    socialLink: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        justifyContent: 'center',
    },
}); 