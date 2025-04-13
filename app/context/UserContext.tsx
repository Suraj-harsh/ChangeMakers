import React, { createContext, useContext, useState } from 'react';

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

interface UserData {
    id: string;
    username: string;
    avatar: string;
    location: string;
    bio: string;
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
}

interface UserContextType {
    userData: UserData;
    updateUserData: (data: Partial<UserData>) => void;
}

const initialUserData: UserData = {
    id: "1",
    username: "Sarah Johnson",
    avatar: "👨🏻‍💻",
    location: "San Francisco, CA",
    bio: "Passionate about sustainable development and community building. Looking to make a positive impact through technology and education.",
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
    ]
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userData, setUserData] = useState<UserData>({
        id: '',
        username: '',
        avatar: '',
        location: '',
        bio: '',
        email: '',
        interests: [],
        isVerified: false,
        trustScore: 0,
        impactScore: 0,
        achievements: [],
        projects: [],
        posts: [],
        volunteerHistory: [],
        donations: [],
        endorsements: [],
    });

    console.log('UserContext initialized with data:', userData);

    const updateUserData = (data: Partial<UserData>) => {
        console.log('Updating user data with:', data);
        setUserData(prev => ({ ...prev, ...data }));
    };

    return (
        <UserContext.Provider value={{ userData, updateUserData }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
} 