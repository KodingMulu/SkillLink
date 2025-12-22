import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Avatar, Appbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  
  // Ambil nama dari params dengan aman
  const chatName = (params.name as string) || "User";

  const [messages, setMessages] = useState([
    { id: '1', text: 'Halo, bagaimana progresnya?', sender: 'other', time: '10:30' },
    { id: '2', text: 'Sudah 75%, tinggal bagian integrasi API.', sender: 'me', time: '10:35' },
  ]);

  const renderMessage = ({ item }: any) => (
    <View style={[styles.messageBubble, item.sender === 'me' ? styles.myMessage : styles.otherMessage]}>
      <Text style={item.sender === 'me' ? styles.myMessageText : styles.otherMessageText}>{item.text}</Text>
      <Text style={styles.timeText}>{item.time}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.appbar} elevated>
        <Appbar.BackAction onPress={() => router.back()} />
        <Avatar.Text size={36} label={chatName.substring(0, 2).toUpperCase()} style={styles.avatar} />
        <Appbar.Content title={chatName} titleStyle={styles.title} />
      </Appbar.Header>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatList}
      />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ketik pesan..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton} onPress={() => setMessage('')}>
            <MaterialCommunityIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  appbar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  title: { fontSize: 16, fontWeight: 'bold' },
  avatar: { backgroundColor: '#3b82f6', marginLeft: 8 },
  chatList: { padding: 16 },
  messageBubble: { padding: 12, borderRadius: 16, marginBottom: 8, maxWidth: '80%' },
  myMessage: { backgroundColor: '#3b82f6', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  otherMessage: { backgroundColor: '#fff', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  myMessageText: { color: '#fff' },
  otherMessageText: { color: '#1e293b' },
  timeText: { fontSize: 10, color: '#94a3b8', marginTop: 4, alignSelf: 'flex-end' },
  inputContainer: { flexDirection: 'row', padding: 12, backgroundColor: '#fff', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e2e8f0' },
  input: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 },
  sendButton: { backgroundColor: '#3b82f6', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' }
});