import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export default function IdPage() {
  const router = useRouter();
  const { name, icon, status } = useLocalSearchParams<{
    name?: string;
    icon?: IconName;
    status?: string;
  }>();

  // State สำหรับเปิด/ปิด Popup แจ้งเตือน
  const [showPopup, setShowPopup] = useState(false);

  // ตัวแปรจำลองว่า "มีของค้างอยู่หรือไม่" 
  // (ตั้งเป็น true ไว้เพื่อให้เห็น Popup แจ้งเตือนตามเงื่อนไข ถ้าเปลี่ยนเป็น false จะยืมได้เลย)
  const hasPendingItem = true; 

  const handleBorrow = () => {
    if (hasPendingItem) {
      // ถ้ามีของค้าง ให้แสดง Popup
      setShowPopup(true);
    } else {
      // ถ้าไม่มีของค้าง ให้ผ่านเงื่อนไข
      Alert.alert('สำเร็จ', 'บันทึกการขอยืมอุปกรณ์เรียบร้อยแล้ว');
      router.replace('/home');
    }
  };

  return (
    <View style={styles.container}>
      {/* ข้อมูลอุปกรณ์ */}
      <View style={styles.card}>
        <MaterialCommunityIcons name={icon ?? 'help-circle'} size={120} color="#475569" />
        <Text style={styles.title}>{name || 'ชื่ออุปกรณ์'}</Text>
        
        <Text style={[
          styles.status, 
          { color: status === 'ว่าง' ? '#16a34a' : '#dc2626' }
        ]}>
          สถานะ: {status || 'ไม่ทราบ'}
        </Text>

        {/* เงื่อนไขการยืม */}
        <View style={styles.conditionBox}>
          <MaterialCommunityIcons name="information" size={24} color="#0284c7" />
          <Text style={styles.conditionText}>เงื่อนไขการยืม: ต้องคืนภายใน 3 วัน</Text>
        </View>
      </View>

      {/* ปุ่มยืนยันการยืม (เช็กว่าของว่างหรือไม่) */}
      {status === 'ว่าง' ? (
        <Pressable style={styles.borrowButton} onPress={handleBorrow}>
          <Text style={styles.borrowButtonText}>ยืนยันการขอยืมอุปกรณ์</Text>
        </Pressable>
      ) : (
        <Pressable style={[styles.borrowButton, styles.disabledButton]} disabled>
          <Text style={styles.borrowButtonText}>อุปกรณ์ไม่ว่าง</Text>
        </Pressable>
      )}

      {/* Popup แจ้งเตือนกรณีมีของค้าง (สร้างด้วย Modal ให้มีไอคอนตามต้องการ) */}
      <Modal visible={showPopup} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="alert-circle" size={64} color="#ef4444" />
            <Text style={styles.modalText}>กรุณาคืนอุปกรณ์ชิ้นก่อนหน้านี้ที่ยืมไป</Text>
            
            <View style={styles.modalButtonGroup}>
              {/* ปุ่ม 1: คืนอุปกรณ์ */}
              <Pressable 
                style={styles.modalButtonReturn} 
                onPress={() => {
                  setShowPopup(false);
                  router.push('/id_data');
                }}
              >
                <Text style={styles.modalButtonReturnText}>คืนอุปกรณ์</Text>
              </Pressable>

              {/* ปุ่ม 2: ปิด */}
              <Pressable 
                style={styles.modalButtonClose} 
                onPress={() => {
                  setShowPopup(false);
                  router.replace('/home');
                }}
              >
                <Text style={styles.modalButtonCloseText}>ปิด</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 16,
    marginBottom: 8,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  conditionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  conditionText: {
    fontSize: 14,
    color: '#0284c7',
    fontWeight: '600',
  },
  borrowButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  borrowButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  modalButtonGroup: {
    width: '100%',
    gap: 12,
  },
  modalButtonReturn: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonReturnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalButtonClose: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  modalButtonCloseText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
  },
});