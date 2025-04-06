import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

interface Milestone {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
}

export default function CreateProjectScreen() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [fundingGoal, setFundingGoal] = useState('');
    const [volunteersNeeded, setVolunteersNeeded] = useState('');
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [milestones, setMilestones] = useState<Milestone[]>([
        { id: '1', title: '', description: '', status: 'pending', dueDate: '' }
    ]);

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
            });

            if (!result.canceled) {
                setBannerImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const addMilestone = () => {
        setMilestones(prev => [
            ...prev,
            {
                id: (prev.length + 1).toString(),
                title: '',
                description: '',
                status: 'pending',
                dueDate: ''
            }
        ]);
    };

    const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
        setMilestones(prev => prev.map(milestone =>
            milestone.id === id ? { ...milestone, [field]: value } : milestone
        ));
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!title.trim() || !description.trim() || !category || !location.trim() ||
            !fundingGoal.trim() || !volunteersNeeded.trim() || !bannerImage) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        // TODO: Implement project creation logic
        console.log('Project data:', {
            title,
            description,
            category,
            location,
            fundingGoal: parseInt(fundingGoal),
            volunteersNeeded: parseInt(volunteersNeeded),
            bannerImage,
            milestones
        });

        router.back();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Project</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.form}>
                    {/* Banner Image */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Project Banner *</Text>
                        <TouchableOpacity
                            style={styles.imagePicker}
                            onPress={pickImage}
                        >
                            {bannerImage ? (
                                <Image
                                    source={{ uri: bannerImage }}
                                    style={styles.bannerImage}
                                />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <MaterialIcons name="add-photo-alternate" size={40} color="#666" />
                                    <Text style={styles.imagePlaceholderText}>Add Banner Image</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Basic Information */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Project Title *</Text>
                        <TextInput
                            style={styles.input}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Enter project title"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Category *</Text>
                        <TextInput
                            style={styles.input}
                            value={category}
                            onChangeText={setCategory}
                            placeholder="Enter project category"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Location *</Text>
                        <TextInput
                            style={styles.input}
                            value={location}
                            onChangeText={setLocation}
                            placeholder="Enter project location"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Funding Goal ($) *</Text>
                        <TextInput
                            style={styles.input}
                            value={fundingGoal}
                            onChangeText={setFundingGoal}
                            placeholder="Enter funding goal"
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Volunteers Needed *</Text>
                        <TextInput
                            style={styles.input}
                            value={volunteersNeeded}
                            onChangeText={setVolunteersNeeded}
                            placeholder="Enter number of volunteers needed"
                            keyboardType="numeric"
                        />
                    </View>

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

                    {/* Milestones */}
                    <View style={styles.inputContainer}>
                        <View style={styles.milestoneHeader}>
                            <Text style={styles.label}>Project Milestones *</Text>
                            <TouchableOpacity onPress={addMilestone}>
                                <MaterialIcons name="add-circle" size={24} color="#007AFF" />
                            </TouchableOpacity>
                        </View>
                        {milestones.map((milestone) => (
                            <View key={milestone.id} style={styles.milestoneItem}>
                                <TextInput
                                    style={styles.input}
                                    value={milestone.title}
                                    onChangeText={(value) => updateMilestone(milestone.id, 'title', value)}
                                    placeholder="Milestone title"
                                />
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={milestone.description}
                                    onChangeText={(value) => updateMilestone(milestone.id, 'description', value)}
                                    placeholder="Milestone description"
                                    multiline
                                />
                                <TextInput
                                    style={styles.input}
                                    value={milestone.dueDate}
                                    onChangeText={(value) => updateMilestone(milestone.id, 'dueDate', value)}
                                    placeholder="Due date (YYYY-MM-DD)"
                                />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

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
    scrollView: {
        flex: 1,
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
    imagePicker: {
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        marginTop: 8,
        color: '#666',
    },
    milestoneHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    milestoneItem: {
        marginBottom: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
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