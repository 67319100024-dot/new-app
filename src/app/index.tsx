import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginPage() {
  const router = useRouter();

  // State สำหรับเก็บข้อมูลที่ผู้ใช้พิมพ์ (ยังคงไว้เผื่อให้ผู้ใช้พิมพ์เล่นได้ แต่จะไม่เช็กเงื่อนไข)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ฟังก์ชันข้ามไปหน้าหลักทันทีเมื่อกดปุ่ม
  const handleLogin = () => {
    router.replace('/home');
  };

  return (
    <View style={styles.container}>
      {/* ส่วนหัวข้อ */}
      <Text style={styles.title}>ยินดีต้อนรับ</Text>

      {/* กล่องกรอกข้อมูล */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* ลืมรหัสผ่าน */}
      <View style={styles.optionsRow}>
        <Pressable onPress={() => {}}>
          <Text style={styles.forgotPasswordText}>ลืมรหัสผ่าน?</Text>
        </Pressable>
      </View>

      {/* ปุ่มเข้าสู่ระบบ */}
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>

      {/* ปุ่มสมัครสมาชิก */}
      <Pressable style={styles.registerButton} onPress={() => {}}>
        <Text style={styles.registerButtonText}>สมัครสมาชิก</Text>
      </Pressable>
    </View>
  );
}

// ส่วนตกแต่งความสวยงาม (Styles)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    gap: 16,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 32,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
  },
});