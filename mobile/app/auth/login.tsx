import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/src/features/auth/useAuth";
import { useTheme } from "@/src/contexts/ThemeContext";
import { ColorScheme } from "@/constants/Colors";

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login.mutateAsync({ email: email.trim(), password });
      router.replace("/(tabs)");
    } catch {
      // error displayed via login.error
    }
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.inner}>
        <Text style={s.title}>Welcome back</Text>
        <Text style={s.subtitle}>Sign in to continue</Text>

        {login.error && <Text style={s.error}>{login.error.message}</Text>}

        <TextInput
          style={s.input}
          placeholder="Email"
          placeholderTextColor={colors.textTertiary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        <TextInput
          style={s.input}
          placeholder="Password"
          placeholderTextColor={colors.textTertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[s.button, login.isPending && s.buttonDisabled]}
          onPress={handleLogin}
          disabled={login.isPending}
        >
          {login.isPending ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={s.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <Link href="/auth/register" style={s.link}>
          Don&apos;t have an account? <Text style={{ color: colors.primary }}>Register</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 28,
      gap: 12,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    error: {
      fontSize: 13,
      color: "#E57373",
    },
    input: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.textPrimary,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      marginTop: 4,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: colors.background,
      fontSize: 15,
      fontWeight: "600",
    },
    link: {
      textAlign: "center",
      color: colors.textSecondary,
      fontSize: 14,
      marginTop: 8,
    },
  });
