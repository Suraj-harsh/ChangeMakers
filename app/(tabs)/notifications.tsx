import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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

// Notification types
type NotificationType = 'project_update' | 'discussion' | 'opportunity' | 'volunteer' | 'donation' | 'collaboration' | 'review';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  project?: {
    name: string;
    emoji: string;
  };
  user?: {
    name: string;
    emoji: string;
  };
  amount?: number;
}

// Dummy notifications data
const dummyNotifications: Notification[] = [
  {
    id: '1',
    type: 'project_update',
    title: 'Milestone Reached! 🎉',
    message: 'Community Garden Initiative has reached 75% of its funding goal!',
    timestamp: '2 hours ago',
    read: false,
    project: {
      name: 'Community Garden Initiative',
      emoji: '🌱'
    }
  },
  {
    id: '2',
    type: 'discussion',
    title: 'New Comment on Your Post',
    message: '@Sarah mentioned you: "Great idea about the solar panels! When can we discuss implementation?"',
    timestamp: '3 hours ago',
    read: false,
    user: {
      name: 'Sarah Chen',
      emoji: '👩🏻‍💼'
    }
  },
  {
    id: '3',
    type: 'opportunity',
    title: 'New Project Match!',
    message: 'Based on your interests: "Youth Tech Education Program" is looking for mentors',
    timestamp: '5 hours ago',
    read: true,
    project: {
      name: 'Youth Tech Education Program',
      emoji: '💻'
    }
  },
  {
    id: '4',
    type: 'volunteer',
    title: 'Volunteer Request Approved',
    message: "You're now a volunteer for \"Elderly Care Support Network\"",
    timestamp: '1 day ago',
    read: true,
    project: {
      name: 'Elderly Care Support Network',
      emoji: '🤝'
    }
  },
  {
    id: '5',
    type: 'donation',
    title: 'New Donation Received!',
    message: 'Anonymous donor contributed $500 to your project',
    timestamp: '1 day ago',
    read: false,
    amount: 500,
    project: {
      name: 'Community Garden Initiative',
      emoji: '🌱'
    }
  },
  {
    id: '6',
    type: 'collaboration',
    title: 'New Collaboration Request',
    message: 'Tech4Good wants to partner on "Youth Tech Education Program"',
    timestamp: '2 days ago',
    read: true,
    user: {
      name: 'Tech4Good',
      emoji: '🏢'
    }
  },
  {
    id: '7',
    type: 'review',
    title: 'New Endorsement',
    message: 'Maria left a 5-star review on your volunteer work',
    timestamp: '2 days ago',
    read: true,
    user: {
      name: 'Maria Rodriguez',
      emoji: '👩🏽‍⚕️'
    }
  }
];

const NotificationIcon: React.FC<{ type: NotificationType; read: boolean }> = ({ type, read }) => {
  const getIconData = () => {
    switch (type) {
      case 'project_update':
        return { name: 'update', color: COLORS.primary };
      case 'discussion':
        return { name: 'chat', color: '#9C27B0' };
      case 'opportunity':
        return { name: 'lightbulb', color: '#FF9800' };
      case 'volunteer':
        return { name: 'people', color: COLORS.success };
      case 'donation':
        return { name: 'attach-money', color: '#4CAF50' };
      case 'collaboration':
        return { name: 'handshake', color: '#2196F3' };
      case 'review':
        return { name: 'star', color: '#FFC107' };
      default:
        return { name: 'notifications', color: COLORS.gray.medium };
    }
  };

  const { name, color } = getIconData();

  return (
    <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
      <MaterialIcons name={name as keyof typeof MaterialIcons.glyphMap} size={24} color={color} />
      {!read && <View style={styles.unreadDot} />}
    </View>
  );
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => (
  <TouchableOpacity
    style={[styles.notificationItem, !notification.read && styles.unreadItem]}
    activeOpacity={0.7}
  >
    <NotificationIcon type={notification.type} read={notification.read} />
    <View style={styles.notificationContent}>
      <Text style={styles.notificationTitle}>{notification.title}</Text>
      <Text style={styles.notificationMessage} numberOfLines={2}>
        {notification.message}
      </Text>
      <Text style={styles.timestamp}>{notification.timestamp}</Text>
    </View>
    {(notification.project?.emoji || notification.user?.emoji) && (
      <Text style={styles.emoji}>
        {notification.project?.emoji || notification.user?.emoji}
      </Text>
    )}
  </TouchableOpacity>
);

export default function NotificationsScreen() {
  const [notifications] = useState(dummyNotifications);

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {notifications.map(notification => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  unreadItem: {
    backgroundColor: COLORS.primary + '05',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.alert,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray.dark,
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: COLORS.gray.medium,
    marginBottom: 4,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.gray.medium,
  },
  emoji: {
    fontSize: 24,
    marginLeft: 8,
  },
}); 