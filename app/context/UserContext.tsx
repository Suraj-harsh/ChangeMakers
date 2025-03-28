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

interface UserData {
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
    volunteerHistory: VolunteerActivity[];
    donations: Donation[];
    endorsements: Endorsement[];
}

interface UserContextType {
    userData: UserData;
    updateUserData: (data: Partial<UserData>) => void;
}

const initialUserData: UserData = {
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
    const [userData, setUserData] = useState<UserData>(initialUserData);

    const updateUserData = (data: Partial<UserData>) => {
        console.log('Updating user data with:', data);
        setUserData(prev => {
            const newData = {
                ...prev,
                ...data
            };
            console.log('New user data:', newData);
            return newData;
        });
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