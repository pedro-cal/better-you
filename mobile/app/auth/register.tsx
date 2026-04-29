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

export default function RegisterScreen() {
  const { colors } = useTheme();
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await register.mutateAsync({ name: name.trim(), email: email.trim(), password });
      router.replace("/(tabs)");
    } catch {
      // error displayed via register.error
    }
  };

  const s = styles(colors);

  return (
    <KeyboardAvoidingView
      style={s.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={s.inner}>
        <Text style={s.title}>Create account</Text>
        <Text style={s.subtitle}>Start your journey today</Text>

        {register.error && <Text style={s.error}>{register.error.message}</Text>}

        <TextInput
          style={s.input}
          placeholder="Name"
          placeholderTextColor={colors.textTertiary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
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
          placeholder="Password (min. 8 characters)"
          placeholderTextColor={colors.textTertiary}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[s.button, register.isPending && s.buttonDisabled]}
          onPress={handleRegister}
          disabled={register.isPending}
        >
          {register.isPending ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={s.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <Link href="/auth/login" style={s.link}>
          Already have an account? <Text style={{ color: colors.primary }}>Sign In</Text>
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
