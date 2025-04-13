import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const COLORS = {
    primary: '#007BFF',
    white: '#FFFFFF',
    black: '#000000',
    gray: {
        light: '#f8f9fa',
        medium: '#6c757d',
        dark: '#343a40'
    },
};

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Validate credentials
        if (!email.trim() || !password.trim()) {
            console.log('Please fill in all required fields');
            return;
        }

        // In a real app, you would implement actual authentication here
        console.log('Logging in...', { email, password });

        // Navigate to the main app
        router.replace('/(tabs)/home');
    };

    const navigateToSignup = () => {
        router.push('/(auth)/signup');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Logo/App Title */}
                    <View style={styles.logoContainer}>
                        <Text style={styles.appTitle}>ChangeMakers</Text>
                        <Text style={styles.appTagline}>Connect. Collaborate. Change.</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Welcome Back</Text>
                        <Text style={styles.formSubtitle}>Sign in to continue</Text>

                        {/* Email field */}
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />

                        {/* Password field */}
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        {/* Login button */}
                        <TouchableOpacity
                            style={styles.authButton}
                            onPress={handleLogin}
                        >
                            <Text style={styles.authButtonText}>Login</Text>
                        </TouchableOpacity>

                        {/* Sign up link */}
                        <TouchableOpacity
                            style={styles.toggleContainer}
                            onPress={navigateToSignup}
                        >
                            <Text style={styles.toggleText}>
                                New user? <Text style={styles.toggleLink}>Sign Up</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    appTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8,
    },
    appTagline: {
        fontSize: 16,
        color: COLORS.gray.medium,
    },
    formContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    formTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.gray.dark,
        marginBottom: 8,
    },
    formSubtitle: {
        fontSize: 14,
        color: COLORS.gray.medium,
        marginBottom: 24,
    },
    input: {
        backgroundColor: COLORS.gray.light,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 8,
        fontSize: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    authButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
    },
    authButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    toggleContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    toggleText: {
        fontSize: 14,
        color: COLORS.gray.medium,
    },
    toggleLink: {
        color: COLORS.primary,
        fontWeight: '600',
    },
}); 