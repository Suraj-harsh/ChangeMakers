import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
    primary: '#007AFF',
    gray: {
        light: '#f8f9fa',
        medium: '#6c757d',
        dark: '#343a40'
    },
    white: '#FFFFFF'
};

interface MediaItem {
    uri: string;
    type: 'image' | 'video';
}

export default function CreatePostScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

    useEffect(() => {
        (async () => {
            console.log('Requesting permissions...');
            const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();

            console.log('Media library permission status:', mediaStatus);
            console.log('Camera permission status:', cameraStatus);

            if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please grant permission to access your media library and camera to add photos and videos.',
                    [{ text: 'OK' }]
                );
                return;
            }
        })();
    }, []);

    const pickMedia = async (type: 'image' | 'video') => {
        console.log('Starting media picker for type:', type);
        try {
            const options: ImagePicker.ImagePickerOptions = {
                mediaTypes: type === 'image'
                    ? ImagePicker.MediaTypeOptions.Images
                    : ImagePicker.MediaTypeOptions.Videos,
                allowsEditing: true,
                quality: 1,
                allowsMultipleSelection: false,
                base64: false,
            };

            console.log('Launching image picker with options:', options);
            const result = await ImagePicker.launchImageLibraryAsync(options);
            console.log('Image picker result:', result);

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                console.log('Selected asset:', asset);
                setMediaItems(prev => [...prev, {
                    uri: asset.uri,
                    type
                }]);
            } else {
                console.log('Media selection was canceled');
            }
        } catch (error) {
            console.error('Error picking media:', error);
            Alert.alert('Error', 'Failed to pick media. Please try again.');
        }
    };

    const removeMedia = (index: number) => {
        setMediaItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreatePost = () => {
        if (!title.trim() || !description.trim() || !location.trim() || !category.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // TODO: Implement post creation logic here
        console.log('Creating post:', {
            title,
            description,
            location,
            category,
            mediaItems
        });

        Alert.alert(
            'Success',
            'Post created successfully!',
            [
                {
                    text: 'OK',
                    onPress: () => router.back()
                }
            ]
        );
    };

    const handleAddMedia = () => {
        console.log('Add media button pressed');
        // For Windows, directly launch image picker first to test functionality
        if (Platform.OS === 'web') {
            pickMedia('image');
        } else {
            Alert.alert(
                'Add Media',
                'Choose media type',
                [
                    {
                        text: 'Photo',
                        onPress: () => {
                            console.log('Photo option selected');
                            pickMedia('image');
                        }
                    },
                    {
                        text: 'Video',
                        onPress: () => {
                            console.log('Video option selected');
                            pickMedia('video');
                        }
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                        onPress: () => console.log('Cancel pressed')
                    }
                ]
            );
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: 'Create Post',
                    headerShown: true,
                }}
            />
            <ScrollView style={styles.container}>
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter post title"
                            placeholderTextColor={COLORS.gray.medium}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Enter post description"
                            placeholderTextColor={COLORS.gray.medium}
                            multiline
                            numberOfLines={4}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Enter location"
                            placeholderTextColor={COLORS.gray.medium}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Category</Text>
                        <TextInput
                            style={styles.input}
                            value={category}
                            onChangeText={setCategory}
                            placeholder="Enter category"
                            placeholderTextColor={COLORS.gray.medium}
                        />
                    </View>

                    <View style={styles.mediaContainer}>
                        <Text style={styles.label}>Media</Text>
                        <View style={styles.mediaGrid}>
                            {mediaItems.map((item, index) => (
                                <View key={index} style={styles.mediaItem}>
                                    {item.type === 'image' ? (
                                        <Image
                                            source={{ uri: item.uri }}
                                            style={styles.mediaPreview}
                                        />
                                    ) : (
                                        <View style={styles.videoPreview}>
                                            <MaterialIcons name="play-circle-outline" size={40} color={COLORS.white} />
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        style={styles.removeMediaButton}
                                        onPress={() => removeMedia(index)}
                                    >
                                        <MaterialIcons name="close" size={20} color={COLORS.white} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                            {mediaItems.length < 5 && (
                                <TouchableOpacity
                                    style={styles.addMediaButton}
                                    onPress={handleAddMedia}
                                >
                                    <MaterialIcons name="add-photo-alternate" size={32} color={COLORS.primary} />
                                    <Text style={styles.addMediaText}>Add Media</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={handleCreatePost}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.createButtonText}>Create Post</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    form: {
        padding: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.gray.dark,
        marginBottom: 8,
    },
    input: {
        backgroundColor: COLORS.gray.light,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.gray.dark,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    mediaContainer: {
        marginBottom: 20,
    },
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    mediaItem: {
        width: 100,
        height: 100,
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative',
    },
    mediaPreview: {
        width: '100%',
        height: '100%',
    },
    videoPreview: {
        width: '100%',
        height: '100%',
        backgroundColor: COLORS.gray.dark,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeMediaButton: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 12,
        padding: 4,
    },
    addMediaButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: COLORS.gray.light,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
    },
    addMediaText: {
        marginTop: 4,
        fontSize: 12,
        color: COLORS.primary,
    },
    createButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    createButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
}); 