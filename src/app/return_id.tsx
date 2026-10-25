import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

export default function ReturnIdPage() {
  const router = useRouter();
  
  // State เช็กว่าผู้ใช้ได้ทำการ "ถ่ายรูป" แล้วหรือยัง
  const [hasPhoto, setHasPhoto] = useState(false);

  // ฟังก์ชันจำลองการถ่ายรูป
  const handleTakePhoto = () => {
    setHasPhoto(true);
    Alert.alert('ถ่ายรูปสำเร็จ', 'บันทึกภาพสภาพอุปกรณ์เรียบร้อยแล้ว');
  };

  // ฟังก์ชันยืนยันการคืน
  const handleConfirmReturn = () => {
    if (!hasPhoto) {
      Alert.alert('แจ้งเตือน', 'กรุณาถ่ายภาพอุปกรณ์ก่อนทำการคืนครับ');
      return;
    }

    // เมื่อถ่ายรูปแล้วและกดยืนยัน จะแสดง Popup สำเร็จและเด้งกลับหน้าหลัก
    Alert.alert(
      'คืนอุปกรณ์สำเร็จ', 
      'ขอบคุณที่คืนอุปกรณ์ตรงเวลาครับ!',
      [
        {
          text: 'ตกลง',
          onPress: () => router.replace('/home')
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#0f172a" />
        </Pressable>
        <Text style={styles.headerTitle}>คืนอุปกรณ์</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructionText}>
          กรุณาถ่ายภาพอุปกรณ์เพื่อยืนยันสภาพก่อนทำการคืน
        </Text>

        {/* กล่องสำหรับถ่ายภาพ */}
        <Pressable 
          style={[styles.cameraBox, hasPhoto && styles.cameraBoxSuccess]} 
          onPress={handleTakePhoto}
        >
          {hasPhoto ? (
            <>
              <MaterialCommunityIcons name="check-circle" size={64} color="#16a34a" />
              <Text style={styles.cameraTextSuccess}>ถ่ายภาพเรียบร้อยแล้ว (แตะเพื่อถ่ายใหม่)</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="camera-plus" size={64} color="#94a3b8" />
              <Text style={styles.cameraText}>แตะที่นี่เพื่อถ่ายภาพอุปกรณ์</Text>
            </>
          )}
        </Pressable>

        {/* ปุ่มยืนยันการคืน */}
        <Pressable 
          style={[styles.confirmButton, !hasPhoto && styles.confirmButtonDisabled]} 
          onPress={handleConfirmReturn}
        >
          <Text style={styles.confirmButtonText}>ยืนยันการคืนอุปกรณ์</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ส่วนตกแต่งความสวยงาม
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 16,
  },
  cameraBox: {
    width: '100%',
    height: 250,
    backgroundColor: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  cameraBoxSuccess: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
    borderStyle: 'solid',
  },
  cameraText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  cameraTextSuccess: {
    marginTop: 12,
    fontSize: 16,
    color: '#16a34a',
    fontWeight: 'bold',
  },
  confirmButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#94a3b8',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});