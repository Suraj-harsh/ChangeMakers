import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Alert, ActivityIndicator, Linking, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ImagePreviewModal from './components/ImagePreviewModal';
import { useUser } from './context/UserContext';

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

// Dummy user data (in real app, this would come from your backend)
const dummyUser = {
    name: 'John Doe',
    avatar: '👨🏻‍💻',
    location: 'San Francisco, CA',
    bio: 'Passionate about making a difference in the community through technology and education.',
    interests: ['Education', 'Technology', 'Environment'],
    trustScore: 95,
    impactScore: 88,
    projects: [
        {
            id: '1',
            title: 'Youth Tech Education Program',
            location: 'San Francisco, CA',
            progress: 75,
            role: 'admin'
        },
        {
            id: '2',
            title: 'Community Garden Initiative',
            location: 'Brooklyn, NY',
            progress: 45,
            role: 'volunteer'
        }
    ]
};

interface FormErrors {
    name?: string;
    location?: string;
    bio?: string;
}

export default function EditProfileScreen() {
    const { userData, updateUserData } = useUser();
    const [newInterest, setNewInterest] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isUploading, setIsUploading] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isPreviewVisible, setIsPreviewVisible] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        username: userData.username || '',
        location: userData.location || '',
        bio: userData.bio || '',
        interests: userData.interests || []
    });

    useEffect(() => {
        // Request permissions when component mounts
        (async () => {
            try {
                const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
                const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

                console.log('Camera permission status:', cameraStatus);
                console.log('Library permission status:', libraryStatus);

                if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
                    Alert.alert(
                        'Permission Required',
                        'Camera and gallery access are required to update your profile picture.',
                        [
                            {
                                text: 'Cancel',
                                style: 'cancel'
                            },
                            {
                                text: 'Settings',
                                onPress: () => {
                                    // Open app settings
                                    if (Platform.OS === 'ios') {
                                        Linking.openURL('app-settings:');
                                    } else {
                                        Linking.openSettings();
                                    }
                                }
                            }
                        ]
                    );
                }
            } catch (error) {
                console.error('Permission request error:', error);
            }
        })();
    }, []);

    const validateForm = (data: typeof formData): FormErrors => {
        const newErrors: FormErrors = {};

        if (!data.username.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!data.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!data.bio.trim()) {
            newErrors.bio = 'Bio is required';
        } else if (data.bio.length < 50) {
            newErrors.bio = 'Bio must be at least 50 characters';
        }

        return newErrors;
    };

    const handleSave = () => {
        Alert.alert(
            'Save Changes',
            'Are you sure you want to save these changes?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Save',
                    onPress: () => {
                        // Update user data
                        updateUserData({
                            username: formData.username,
                            location: formData.location,
                            bio: formData.bio,
                            interests: formData.interests
                        });

                        // Navigate back to profile
                        router.push('/(tabs)/profile');
                    }
                }
            ]
        );
    };

    const handleBack = () => {
        if (hasChanges) {
            Alert.alert(
                'Discard Changes?',
                'You have unsaved changes. Are you sure you want to leave?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => {
                            router.push('/(tabs)/profile');
                        }
                    }
                ]
            );
        } else {
            router.push('/(tabs)/profile');
        }
    };

    const uploadImage = async (uri: string) => {
        try {
            setIsUploading(true);

            // Get file info
            const fileInfo = await FileSystem.getInfoAsync(uri);
            if (!fileInfo.exists) {
                throw new Error('File does not exist');
            }

            // Convert image to base64
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // Create form data for upload
            const formData = new FormData();
            formData.append('image', {
                uri: uri,
                type: 'image/jpeg',
                name: 'profile-picture.jpg',
                base64: base64
            } as any);

            // Update the user data with the new image URI
            updateUserData({ avatar: uri });
            setHasChanges(true);
            setIsPreviewVisible(false);
            setPreviewImage(null);

            Alert.alert('Success', 'Profile picture updated successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            Alert.alert(
                'Error',
                'Failed to upload image. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsUploading(false);
        }
    };

    const pickImage = async (useCamera: boolean = false) => {
        try {
            console.log('Starting image picker...', { useCamera });
            const options: ImagePicker.ImagePickerOptions = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1] as [number, number],
                quality: 1,
                base64: true,
            };

            console.log('Image picker options:', options);

            let result;
            if (useCamera) {
                console.log('Launching camera...');
                result = await ImagePicker.launchCameraAsync(options);
                console.log('Camera result:', result);
            } else {
                console.log('Launching image library...');
                result = await ImagePicker.launchImageLibraryAsync(options);
                console.log('Library result:', result);
            }

            if (!result.canceled) {
                console.log('Image selected successfully:', {
                    uri: result.assets[0].uri,
                    width: result.assets[0].width,
                    height: result.assets[0].height,
                    type: result.assets[0].type
                });
                setPreviewImage(result.assets[0].uri);
                setIsPreviewVisible(true);
            } else {
                console.log('Image picker cancelled by user');
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert(
                'Error',
                'Failed to pick image. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    // Add a direct image picker call for testing
    const testImagePicker = async () => {
        try {
            console.log('Testing direct image picker...');
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
            console.log('Direct image picker result:', result);
        } catch (error) {
            console.error('Direct image picker error:', error);
        }
    };

    const showImagePickerOptions = () => {
        console.log('Showing image picker options...');
        // Test direct image picker first
        testImagePicker();

        Alert.alert(
            'Change Profile Picture',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: () => {
                        console.log('Take Photo selected');
                        pickImage(true);
                    }
                },
                {
                    text: 'Choose from Gallery',
                    onPress: () => {
                        console.log('Choose from Gallery selected');
                        pickImage(false);
                    }
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => {
                        console.log('Image picker options cancelled');
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const updateField = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setHasChanges(true);
    };

    const addInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData(prev => ({
                ...prev,
                interests: [...prev.interests, newInterest.trim()]
            }));
            setNewInterest('');
            setHasChanges(true);
        }
    };

    const removeInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter(i => i !== interest)
        }));
        setHasChanges(true);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Edit Profile',
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={handleBack}
                            style={styles.headerButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialIcons name="arrow-back" size={24} color={COLORS.gray.dark} />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={handleSave}
                            style={styles.headerButton}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Text style={styles.saveButton}>
                                Save
                            </Text>
                        </TouchableOpacity>
                    ),
                }}
            />
            <ScrollView style={styles.container}>
                {/* Profile Picture */}
                <View style={styles.avatarContainer}>
                    {isUploading ? (
                        <View style={styles.avatarLoading}>
                            <ActivityIndicator size="large" color={COLORS.primary} />
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={showImagePickerOptions}
                            activeOpacity={0.7}
                            style={styles.avatarTouchable}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            {userData.avatar.startsWith('http') || userData.avatar.startsWith('file://') ? (
                                <Image
                                    source={{ uri: userData.avatar }}
                                    style={styles.avatar}
                                    resizeMode="cover"
                                />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarPlaceholderText}>{userData.avatar}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.changeAvatarButton}
                        onPress={showImagePickerOptions}
                        activeOpacity={0.7}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialIcons name="camera-alt" size={20} color={COLORS.white} />
                        <Text style={styles.changeAvatarText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>

                {/* Basic Information */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Information</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            value={formData.username}
                            onChangeText={(text) => updateField('username', text)}
                            placeholder="Your name"
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={[styles.input, errors.location && styles.inputError]}
                            value={formData.location}
                            onChangeText={(text) => updateField('location', text)}
                            placeholder="Your location"
                        />
                        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.bioInput, errors.bio && styles.inputError]}
                            value={formData.bio}
                            onChangeText={(text) => updateField('bio', text)}
                            placeholder="Tell us about yourself"
                            multiline
                            numberOfLines={4}
                        />
                        {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
                    </View>
                </View>

                {/* Interests */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Interests</Text>
                    <View style={styles.interestsContainer}>
                        {formData.interests.map((interest, index) => (
                            <View key={index} style={styles.interestTag}>
                                <Text style={styles.interestText}>{interest}</Text>
                                <TouchableOpacity
                                    onPress={() => removeInterest(interest)}
                                    style={styles.removeInterestButton}
                                >
                                    <MaterialIcons name="close" size={16} color={COLORS.primary} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <View style={styles.addInterestContainer}>
                        <TextInput
                            style={styles.addInterestInput}
                            value={newInterest}
                            onChangeText={setNewInterest}
                            placeholder="Add an interest"
                            onSubmitEditing={addInterest}
                        />
                        <TouchableOpacity
                            style={styles.addInterestButton}
                            onPress={addInterest}
                        >
                            <MaterialIcons name="add" size={24} color={COLORS.white} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Privacy Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Privacy Settings</Text>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Profile Visibility</Text>
                            <Text style={styles.settingDescription}>Control who can see your profile</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.gray.medium} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Activity Status</Text>
                            <Text style={styles.settingDescription}>Show when you're active</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.gray.medium} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Email Visibility</Text>
                            <Text style={styles.settingDescription}>Control who can see your email</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.gray.medium} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Project Participation</Text>
                            <Text style={styles.settingDescription}>Show your project involvement</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.gray.medium} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Text style={styles.settingTitle}>Donation History</Text>
                            <Text style={styles.settingDescription}>Control donation visibility</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color={COLORS.gray.medium} />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <ImagePreviewModal
                visible={isPreviewVisible}
                imageUri={previewImage || ''}
                onConfirm={() => {
                    console.log('Confirming image selection...');
                    previewImage && uploadImage(previewImage);
                }}
                onCancel={() => {
                    console.log('Cancelling image selection...');
                    setIsPreviewVisible(false);
                    setPreviewImage(null);
                }}
                isUploading={isUploading}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.gray.light,
    },
    avatarContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    avatarTouchable: {
        marginBottom: 12,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.gray.light,
    },
    avatarPlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.gray.light,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        fontSize: 80,
    },
    avatarLoading: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: COLORS.gray.light,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    changeAvatarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        gap: 8,
    },
    changeAvatarText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
    },
    section: {
        backgroundColor: COLORS.white,
        padding: 16,
        marginTop: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.gray.dark,
        marginBottom: 16,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: COLORS.gray.medium,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.gray.dark,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    interestTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary + '15',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    interestText: {
        color: COLORS.primary,
        marginRight: 8,
        fontWeight: '500',
    },
    removeInterestButton: {
        padding: 2,
    },
    addInterestContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    addInterestInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.gray.dark,
    },
    addInterestButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingInfo: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        color: COLORS.gray.dark,
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 14,
        color: COLORS.gray.medium,
    },
    headerButton: {
        padding: 8,
        marginHorizontal: 4,
    },
    saveButton: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    inputError: {
        borderColor: COLORS.alert,
    },
    errorText: {
        color: COLORS.alert,
        fontSize: 12,
        marginTop: 4,
    },
}); 