import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNAndroidNotificationListener, {
  RNAndroidNotificationListenerHeadlessJsName,
} from "react-native-android-notification-listener";
import * as TaskManager from "expo-task-manager";

// --- CONFIGURATION ---
// Replace with the user's actual local IP or production URL when deploying.
// For now, prompt the user or default to a placeholder.
const DEFAULT_API_URL = "https://rendeplus.vercel.app/api/sync/notification";

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);
  const [token, setToken] = useState("");
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    checkPermission();
    loadSettings();
  }, []);

  const checkPermission = async () => {
    const status = await RNAndroidNotificationListener.getPermissionStatus();
    setHasPermission(status !== "denied");
  };

  const requestPermission = async () => {
    RNAndroidNotificationListener.requestPermission();
  };

  const loadSettings = async () => {
    const savedToken = await AsyncStorage.getItem("sync_token");
    const savedUrl = await AsyncStorage.getItem("api_url");
    if (savedToken) setToken(savedToken);
    if (savedUrl) setApiUrl(savedUrl);
  };

  const saveSettings = async () => {
    await AsyncStorage.setItem("sync_token", token);
    await AsyncStorage.setItem("api_url", apiUrl);
    Alert.alert(
      "Salvo!",
      "Configurações salvas. O serviço rodará em segundo plano.",
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Rende+ Sync (Android)</Text>

      {/* Permission Status */}
      <View style={styles.card}>
        <Text style={styles.label}>Permissão de Notificação:</Text>
        <Text
          style={[styles.status, { color: hasPermission ? "green" : "red" }]}
        >
          {hasPermission ? "ATIVO" : "INATIVO"}
        </Text>
        {!hasPermission && (
          <Button title="Ativar Permissões" onPress={requestPermission} />
        )}
      </View>

      {/* Settings */}
      <View style={styles.card}>
        <Text style={styles.label}>Token de Sincronização:</Text>
        <TextInput
          style={styles.input}
          placeholder="Cole o token do site aqui"
          value={token}
          onChangeText={setToken}
        />

        <Text style={styles.label}>URL da API:</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          value={apiUrl}
          onChangeText={setApiUrl}
        />

        <Button title="Salvar Configurações" onPress={saveSettings} />
      </View>

      <Text style={styles.footer}>
        Este app deve permanecer instalado para a sincronização funcionar.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  status: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    color: "#999",
    textAlign: "center",
  },
});
