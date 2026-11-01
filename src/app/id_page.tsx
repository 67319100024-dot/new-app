import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { EQUIPMENT_DATA } from '@/constants/equipment';
import { useBorrowedItems } from '@/contexts/borrowed-items-context';

export default function IdPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { borrowedItems, isLoading, addBorrowedItem } = useBorrowedItems();
  const [showPopup, setShowPopup] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const equipment = EQUIPMENT_DATA.find((item) => item.id === id);
  const hasPendingItem = borrowedItems.length > 0;
  const isAvailable = equipment?.status === 'ว่าง' &&
    !borrowedItems.some((item) => item.equipmentId === equipment.id);

  const handleBorrow = async () => {
    if (isLoading || isSaving || !equipment) {
      return;
    }

    if (hasPendingItem) {
      setShowPopup(true);
      return;
    }

    setIsSaving(true);
    try {
      await addBorrowedItem(equipment);
      Alert.alert('สำเร็จ', 'บันทึกการขอยืมอุปกรณ์เรียบร้อยแล้ว', [
        { text: 'ตกลง', onPress: () => router.replace('/home') },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ไม่สามารถบันทึกข้อมูลการยืมได้';
      Alert.alert('บันทึกไม่สำเร็จ', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* ข้อมูลอุปกรณ์ */}
      <View style={styles.card}>
        <MaterialCommunityIcons name={equipment?.icon ?? 'help-circle'} size={120} color="#475569" />
        <Text style={styles.title}>{equipment?.name ?? 'ไม่พบอุปกรณ์'}</Text>

        <Text style={[
          styles.status,
          { color: isAvailable ? '#16a34a' : '#dc2626' }
        ]}>
          สถานะ: {isLoading ? 'กำลังโหลด...' : isAvailable ? 'ว่าง' : 'ไม่ว่าง'}
        </Text>

        {/* เงื่อนไขการยืม */}
        <View style={styles.conditionBox}>
          <MaterialCommunityIcons name="information" size={24} color="#0284c7" />
          <Text style={styles.conditionText}>เงื่อนไขการยืม: ต้องคืนภายใน 3 วัน</Text>
        </View>
      </View>

      {/* ปุ่มยืนยันการยืม (เช็กว่าของว่างหรือไม่) */}
      {isAvailable ? (
        <Pressable
          style={[styles.borrowButton, (isLoading || isSaving) && styles.disabledButton]}
          onPress={handleBorrow}
          disabled={isLoading || isSaving}
        >
          <Text style={styles.borrowButtonText}>
            {isSaving ? 'กำลังบันทึก...' : 'ยืนยันการขอยืมอุปกรณ์'}
          </Text>
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