import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
    KeyboardAvoidingView,
    Alert,
    BackHandler,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

interface MediaItem {
    uri: string;
    type: 'image' | 'video';
}

export default function CreateProjectScreen() {
    const navigation = useNavigation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [fundingGoal, setFundingGoal] = useState('');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [coverImage, setCoverImage] = useState<string | null>(null);

    const categories = [
        'Education',
        'Environment',
        'Health',
        'Social Welfare',
        'Technology',
        'Arts & Culture',
        'Sports',
        'Other'
    ];

    const hasChanges = () => {
        return title.trim() !== '' ||
            description.trim() !== '' ||
            category !== '' ||
            location.trim() !== '' ||
            fundingGoal.trim() !== '' ||
            mediaItems.length > 0;
    };

    const handleBackPress = () => {
        if (hasChanges()) {
            Alert.alert(
                'Discard Changes?',
                'You have unsaved changes. Do you want to discard them?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => {
                            // Do nothing, stay on the form
                        }
                    },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => {
                            router.back();
                        }
                    }
                ]
            );
        } else {
            router.back();
        }
    };

    // Handle Android back button press
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (hasChanges()) {
                Alert.alert(
                    'Discard Changes?',
                    'You have unsaved changes. Do you want to discard them?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => {
                                // Do nothing, stay on the form
                            }
                        },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => {
                                router.back();
                            }
                        }
                    ]
                );
                return true; // Prevent default back behavior
            }
            return false; // Allow default back behavior
        });

        return () => backHandler.remove();
    }, [title, description, category, location, fundingGoal, mediaItems]);

    // Handle gesture back
    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (hasChanges()) {
                // Prevent default behavior of leaving the screen
                e.preventDefault();
                Alert.alert(
                    'Discard Changes?',
                    'You have unsaved changes. Do you want to discard them?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => {
                                // Do nothing, stay on the form
                            }
                        },
                        {
                            text: 'Discard',
                            style: 'destructive',
                            onPress: () => {
                                router.back();
                            }
                        }
                    ]
                );
            }
        });

        return unsubscribe;
    }, [navigation, title, description, category, location, fundingGoal, mediaItems]);

    const pickMedia = async (type: 'image' | 'video') => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: type === 'image'
                    ? ImagePicker.MediaTypeOptions.Images
                    : ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled) {
                const newMedia: MediaItem = {
                    uri: result.assets[0].uri,
                    type: type
                };
                setMediaItems(prev => [...prev, newMedia]);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick media');
        }
    };

    const removeMedia = (index: number) => {
        setMediaItems(prev => prev.filter((_, i) => i !== index));
        if (coverImage === mediaItems[index].uri) {
            setCoverImage(null);
        }
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!title.trim() || !description.trim() || !category || !location.trim() || !fundingGoal.trim()) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (mediaItems.length === 0) {
            Alert.alert('Error', 'Please add at least one image or video');
            return;
        }

        if (!coverImage) {
            Alert.alert('Error', 'Please select a cover image');
            return;
        }

        // TODO: Implement project creation logic
        console.log('Project data:', {
            title,
            description,
            category,
            location,
            fundingGoal,
            mediaItems,
            coverImage
        });

        // Navigate back to home screen
        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleBackPress}>
                        <MaterialIcons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Create Project</Text>
                </View>

                <View style={styles.form}>
                    {/* Title */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Project Title *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter project title"
                        />
                    </View>

                    {/* Category */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Category *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={category}
                                onValueChange={setCategory}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select category" value="" />
                                {categories.map(cat => (
                                    <Picker.Item key={cat} label={cat} value={cat} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* Location */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location *</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Enter project location"
                        />
                    </View>

                    {/* Funding Goal */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Funding Goal *</Text>
                        <TextInput
                            style={styles.input}
                            value={fundingGoal}
                            onChangeText={setFundingGoal}
                            placeholder="Enter funding goal"
                            keyboardType="numeric"
                        />
                    </View>

                    {/* Description */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description *</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Describe your project"
                            multiline
                            numberOfLines={6}
                        />
                    </View>

                    {/* Media Upload */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Project Media *</Text>
                        <View style={styles.mediaButtons}>
                            <TouchableOpacity
                                style={styles.mediaButton}
                                onPress={() => pickMedia('image')}
                            >
                                <MaterialIcons name="photo" size={24} color="#007AFF" />
                                <Text style={styles.mediaButtonText}>Add Image</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.mediaButton}
                                onPress={() => pickMedia('video')}
                            >
                                <MaterialIcons name="videocam" size={24} color="#007AFF" />
                                <Text style={styles.mediaButtonText}>Add Video</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Media Preview */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.mediaPreview}
                        >
                            {mediaItems.map((item, index) => (
                                <View key={index} style={styles.mediaItem}>
                                    <Image
                                        source={{ uri: item.uri }}
                                        style={styles.mediaThumbnail}
                                    />
                                    <TouchableOpacity
                                        style={styles.removeMedia}
                                        onPress={() => removeMedia(index)}
                                    >
                                        <MaterialIcons name="close" size={20} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.setCoverButton,
                                            coverImage === item.uri && styles.setCoverButtonActive
                                        ]}
                                        onPress={() => setCoverImage(item.uri)}
                                    >
                                        <Text style={styles.setCoverText}>
                                            {coverImage === item.uri ? 'Cover' : 'Set as Cover'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmit}
                >
                    <Text style={styles.submitButtonText}>Create Project</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 16,
    },
    form: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    mediaButtons: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    mediaButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 8,
        gap: 8,
    },
    mediaButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
    mediaPreview: {
        flexDirection: 'row',
        gap: 12,
    },
    mediaItem: {
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: 8,
        overflow: 'hidden',
    },
    mediaThumbnail: {
        width: '100%',
        height: '100%',
    },
    removeMedia: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        padding: 4,
    },
    setCoverButton: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        right: 4,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 4,
        padding: 4,
        alignItems: 'center',
    },
    setCoverButtonActive: {
        backgroundColor: '#007AFF',
    },
    setCoverText: {
        color: '#fff',
        fontSize: 12,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
}); 