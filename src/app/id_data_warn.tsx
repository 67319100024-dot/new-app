import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useBorrowedItems } from '@/contexts/borrowed-items-context';
import { formatEquipmentDate, getOverdueDays } from '@/utils/equipment-dates';

export default function IdDataWarnPage() {
  const router = useRouter();
  const { borrowedItems, isLoading } = useBorrowedItems();
  const overdueItems = borrowedItems
    .map((item) => ({ ...item, overdueDays: getOverdueDays(item.returnDate) }))
    .filter((item) => item.overdueDays > 0);

  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#0f172a" />
        </Pressable>
        <Text style={styles.headerTitle}>แจ้งเตือนค้างคืนอุปกรณ์</Text>
        <View style={{ width: 28 }} /> {/* ช่องว่างเพื่อจัดให้อยู่กึ่งกลาง */}
      </View>

      {/* รายการอุปกรณ์ที่เกินกำหนด */}
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.emptyText}>กำลังโหลดรายการแจ้งเตือน...</Text>
        </View>
      ) : overdueItems.length > 0 ? (
        <FlatList
          data={overdueItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/* แถบแจ้งเตือนสีแดงด้านบนของการ์ด */}
              <View style={styles.cardHeaderWarning}>
                <MaterialCommunityIcons name="alert-circle" size={20} color="#ef4444" />
                <Text style={styles.warningText}>เลยกำหนดคืนมาแล้ว {item.overdueDays} วัน!</Text>
              </View>

              <View style={styles.cardTop}>
                <MaterialCommunityIcons name={item.icon} size={40} color="#475569" />
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.dateText}>วันที่ยืม: {formatEquipmentDate(item.borrowDate)}</Text>
                  <Text style={styles.dateTextWarning}>กำหนดคืน: {formatEquipmentDate(item.returnDate)}</Text>
                </View>
              </View>

              {/* ปุ่มคืนอุปกรณ์ (เน้นสีแดงเพราะด่วน) */}
              <Pressable
                style={styles.returnButton}
                onPress={() => router.push({ pathname: '/return_id', params: { itemId: item.id } })}
              >
                <Text style={styles.returnButtonText}>คืนอุปกรณ์ทันที</Text>
              </Pressable>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="check-circle-outline" size={64} color="#16a34a" />
          <Text style={styles.emptyText}>ไม่มีอุปกรณ์ที่ค้างคืนเกินกำหนด</Text>
        </View>
      )}
    </View>
  );
}

// ส่วนตกแต่งความสวยงาม
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef2f2', // พื้นหลังอมแดงอ่อนๆ ให้รู้สึกถึงการแจ้งเตือน
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
    color: '#ef4444', // สีตัวอักษรหัวข้อเป็นสีแดง
  },
  listContainer: {
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fca5a5', // ขอบการ์ดสีแดง
    marginBottom: 16,
  },
  cardHeaderWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  warningText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  dateTextWarning: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  returnButton: {
    backgroundColor: '#ef4444', // เปลี่ยนปุ่มเป็นสีแดงเพื่อความเร่งด่วน
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  returnButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
    marginTop: 12,
  },
});