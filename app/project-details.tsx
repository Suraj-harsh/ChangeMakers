import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, Stack } from 'expo-router';

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

// Dummy project data
interface ProjectDetails {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    bannerImage: string;
    progress: number;
    admin: {
        name: string;
        avatar: string;
        organization: string;
    };
    milestones: Milestone[];
    achievements: Achievement[];
    volunteers: {
        current: number;
        required: number;
    };
    funding: {
        raised: number;
        goal: number;
    };
    discussions: Discussion[];
    reviews: Review[];
    partners: Partner[];
}

interface Milestone {
    id: string;
    title: string;
    completed: boolean;
    date: string;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    impact: string;
    icon: string;
}

interface Discussion {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    message: string;
    timestamp: string;
    upvotes: number;
}

interface Review {
    id: string;
    user: {
        name: string;
        avatar: string;
    };
    rating: number;
    comment: string;
    date: string;
}

interface Partner {
    id: string;
    name: string;
    logo: string;
    description: string;
}

const dummyProject: ProjectDetails = {
    id: "1",
    title: "Youth Tech Education Program",
    description: "Empowering underprivileged youth with digital skills and coding knowledge. Our program provides hands-on training, mentorship, and career guidance in the technology sector.",
    category: "Education",
    location: "San Francisco, CA",
    bannerImage: "🖥️", // Replace with actual image URL
    progress: 75,
    admin: {
        name: "Sarah Johnson",
        avatar: "👩🏻‍💼",
        organization: "Tech4Good"
    },
    milestones: [
        {
            id: "1",
            title: "Program Curriculum Development",
            completed: true,
            date: "2024-01"
        },
        {
            id: "2",
            title: "Mentor Recruitment",
            completed: true,
            date: "2024-02"
        },
        {
            id: "3",
            title: "First Batch Training",
            completed: false,
            date: "2024-04"
        }
    ],
    achievements: [
        {
            id: "1",
            title: "Student Enrollment",
            description: "Successfully enrolled 50 students from underserved communities",
            impact: "50 lives impacted",
            icon: "📚"
        },
        {
            id: "2",
            title: "Mentor Network",
            description: "Built a network of 20 tech professionals as mentors",
            impact: "20 industry experts",
            icon: "🤝"
        }
    ],
    volunteers: {
        current: 15,
        required: 25
    },
    funding: {
        raised: 25000,
        goal: 50000
    },
    discussions: [
        {
            id: "1",
            user: {
                name: "John Doe",
                avatar: "👨🏻‍💻"
            },
            message: "This is exactly what our community needs! When does the next batch start?",
            timestamp: "2 hours ago",
            upvotes: 5
        }
    ],
    reviews: [
        {
            id: "1",
            user: {
                name: "Maria Rodriguez",
                avatar: "👩🏽‍🏫"
            },
            rating: 5,
            comment: "Amazing initiative! The curriculum is well-structured and the mentors are very supportive.",
            date: "2024-03-15"
        }
    ],
    partners: [
        {
            id: "1",
            name: "Local Tech Hub",
            logo: "🏢",
            description: "Providing workspace and infrastructure support"
        },
        {
            id: "2",
            name: "Code Academy",
            logo: "💻",
            description: "Technical curriculum partner"
        }
    ]
};

const ProjectBanner: React.FC<{ project: ProjectDetails }> = ({ project }) => (
    <View style={styles.bannerContainer}>
        <Text style={styles.bannerImage}>{project.bannerImage}</Text>
        <View style={styles.bannerOverlay}>
            <Text style={styles.projectCategory}>{project.category.toUpperCase()}</Text>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectLocation}>
                <MaterialIcons name="location-on" size={16} color={COLORS.white} />
                {project.location}
            </Text>
        </View>
    </View>
);

const AdminInfo: React.FC<{ admin: ProjectDetails['admin'] }> = ({ admin }) => (
    <TouchableOpacity style={styles.adminContainer}>
        <Text style={styles.adminAvatar}>{admin.avatar}</Text>
        <View style={styles.adminInfo}>
            <Text style={styles.adminName}>{admin.name}</Text>
            <Text style={styles.organizationName}>{admin.organization}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={COLORS.gray.medium} />
    </TouchableOpacity>
);

const MilestoneTracker: React.FC<{ milestones: Milestone[] }> = ({ milestones }) => (
    <View style={styles.milestoneContainer}>
        {milestones.map(milestone => (
            <View key={milestone.id} style={styles.milestoneItem}>
                <MaterialIcons
                    name={milestone.completed ? "check-circle" : "radio-button-unchecked"}
                    size={24}
                    color={milestone.completed ? COLORS.success : COLORS.gray.medium}
                />
                <View style={styles.milestoneInfo}>
                    <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                    <Text style={styles.milestoneDate}>{milestone.date}</Text>
                </View>
            </View>
        ))}
    </View>
);

const ActionButtons: React.FC<{ volunteers: ProjectDetails['volunteers'], funding: ProjectDetails['funding'] }> =
    ({ volunteers, funding }) => (
        <View style={styles.actionContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.volunteerButton]}>
                <MaterialIcons name="people" size={24} color={COLORS.white} />
                <Text style={styles.actionButtonText}>
                    Sign Up as Volunteer ({volunteers.current}/{volunteers.required})
                </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.donateButton]}>
                <MaterialIcons name="favorite" size={24} color={COLORS.white} />
                <Text style={styles.actionButtonText}>
                    Donate Now (${funding.raised.toLocaleString()}/${funding.goal.toLocaleString()})
                </Text>
            </TouchableOpacity>
        </View>
    );

export default function ProjectDetailsScreen() {
    const params = useLocalSearchParams();
    const project = dummyProject; // In real app, fetch project based on params.id

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <ScrollView style={styles.container}>
                <ProjectBanner project={project} />

                <View style={styles.content}>
                    {/* Admin Info */}
                    <AdminInfo admin={project.admin} />

                    {/* Description */}
                    <Text style={styles.sectionTitle}>About the Project</Text>
                    <Text style={styles.description}>{project.description}</Text>

                    {/* Milestones */}
                    <Text style={styles.sectionTitle}>Milestones</Text>
                    <MilestoneTracker milestones={project.milestones} />

                    {/* Achievements */}
                    <Text style={styles.sectionTitle}>Achievements & Impact</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsContainer}>
                        {project.achievements.map(achievement => (
                            <View key={achievement.id} style={styles.achievementCard}>
                                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                                <Text style={styles.achievementImpact}>{achievement.impact}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Action Buttons */}
                    <ActionButtons volunteers={project.volunteers} funding={project.funding} />

                    {/* Discussions */}
                    <Text style={styles.sectionTitle}>Community Discussion</Text>
                    {project.discussions.map(discussion => (
                        <View key={discussion.id} style={styles.discussionItem}>
                            <View style={styles.discussionHeader}>
                                <Text style={styles.discussionAvatar}>{discussion.user.avatar}</Text>
                                <Text style={styles.discussionUser}>{discussion.user.name}</Text>
                                <Text style={styles.discussionTime}>{discussion.timestamp}</Text>
                            </View>
                            <Text style={styles.discussionMessage}>{discussion.message}</Text>
                            <TouchableOpacity style={styles.upvoteButton}>
                                <MaterialIcons name="thumb-up" size={16} color={COLORS.primary} />
                                <Text style={styles.upvoteCount}>{discussion.upvotes}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {/* Reviews */}
                    <Text style={styles.sectionTitle}>Reviews & Endorsements</Text>
                    {project.reviews.map(review => (
                        <View key={review.id} style={styles.reviewItem}>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.reviewAvatar}>{review.user.avatar}</Text>
                                <View style={styles.reviewInfo}>
                                    <Text style={styles.reviewUser}>{review.user.name}</Text>
                                    <View style={styles.ratingContainer}>
                                        {[...Array(5)].map((_, i) => (
                                            <MaterialIcons
                                                key={i}
                                                name="star"
                                                size={16}
                                                color={i < review.rating ? '#FFC107' : COLORS.gray.medium}
                                            />
                                        ))}
                                    </View>
                                </View>
                                <Text style={styles.reviewDate}>{review.date}</Text>
                            </View>
                            <Text style={styles.reviewComment}>{review.comment}</Text>
                        </View>
                    ))}

                    {/* Partners */}
                    <Text style={styles.sectionTitle}>Partners & Collaborators</Text>
                    <View style={styles.partnersContainer}>
                        {project.partners.map(partner => (
                            <View key={partner.id} style={styles.partnerCard}>
                                <Text style={styles.partnerLogo}>{partner.logo}</Text>
                                <Text style={styles.partnerName}>{partner.name}</Text>
                                <Text style={styles.partnerDescription}>{partner.description}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Contact Button */}
                    <TouchableOpacity style={styles.contactButton}>
                        <MaterialIcons name="mail" size={24} color={COLORS.white} />
                        <Text style={styles.contactButtonText}>Contact Project Admin</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray.light,
    },
    bannerContainer: {
        height: 200,
        backgroundColor: COLORS.primary,
        position: 'relative',
    },
    bannerImage: {
        fontSize: 100,
        textAlign: 'center',
        marginTop: 20,
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    projectCategory: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    projectTitle: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    projectLocation: {
        color: COLORS.white,
        fontSize: 14,
    },
    content: {
        padding: 16,
    },
    adminContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    adminAvatar: {
        fontSize: 24,
        marginRight: 12,
    },
    adminInfo: {
        flex: 1,
    },
    adminName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray.dark,
    },
    organizationName: {
        fontSize: 14,
        color: COLORS.gray.medium,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.gray.dark,
        marginBottom: 12,
        marginTop: 24,
    },
    description: {
        fontSize: 16,
        color: COLORS.gray.dark,
        lineHeight: 24,
        marginBottom: 16,
    },
    milestoneContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
    },
    milestoneItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    milestoneInfo: {
        marginLeft: 12,
        flex: 1,
    },
    milestoneTitle: {
        fontSize: 16,
        color: COLORS.gray.dark,
        fontWeight: '500',
    },
    milestoneDate: {
        fontSize: 14,
        color: COLORS.gray.medium,
    },
    achievementsContainer: {
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    achievementCard: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
        marginRight: 12,
        width: 160,
        alignItems: 'center',
    },
    achievementIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    achievementTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray.dark,
        marginBottom: 4,
        textAlign: 'center',
    },
    achievementImpact: {
        fontSize: 12,
        color: COLORS.success,
        fontWeight: '500',
    },
    actionContainer: {
        marginTop: 24,
        gap: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 8,
        gap: 8,
    },
    volunteerButton: {
        backgroundColor: COLORS.primary,
    },
    donateButton: {
        backgroundColor: COLORS.success,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    discussionItem: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    discussionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    discussionAvatar: {
        fontSize: 24,
        marginRight: 8,
    },
    discussionUser: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray.dark,
        flex: 1,
    },
    discussionTime: {
        fontSize: 12,
        color: COLORS.gray.medium,
    },
    discussionMessage: {
        fontSize: 14,
        color: COLORS.gray.dark,
        lineHeight: 20,
        marginBottom: 8,
    },
    upvoteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    upvoteCount: {
        fontSize: 14,
        color: COLORS.primary,
    },
    reviewItem: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    reviewAvatar: {
        fontSize: 24,
        marginRight: 8,
    },
    reviewInfo: {
        flex: 1,
    },
    reviewUser: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray.dark,
    },
    ratingContainer: {
        flexDirection: 'row',
        gap: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: COLORS.gray.medium,
    },
    reviewComment: {
        fontSize: 14,
        color: COLORS.gray.dark,
        lineHeight: 20,
    },
    partnersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    partnerCard: {
        backgroundColor: COLORS.white,
        borderRadius: 8,
        padding: 16,
        width: '48%',
        alignItems: 'center',
    },
    partnerLogo: {
        fontSize: 32,
        marginBottom: 8,
    },
    partnerName: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.gray.dark,
        marginBottom: 4,
        textAlign: 'center',
    },
    partnerDescription: {
        fontSize: 12,
        color: COLORS.gray.medium,
        textAlign: 'center',
    },
    contactButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 8,
        marginTop: 24,
        marginBottom: 32,
        gap: 8,
    },
    contactButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
}); 