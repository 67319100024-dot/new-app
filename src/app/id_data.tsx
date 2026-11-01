import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useBorrowedItems } from '@/contexts/borrowed-items-context';
import { formatEquipmentDate } from '@/utils/equipment-dates';

export default function IdDataPage() {
  const router = useRouter();
  const { borrowedItems, isLoading } = useBorrowedItems();

  return (
    <View style={styles.container}>
      {/* ส่วนหัว */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={28} color="#0f172a" />
        </Pressable>
        <Text style={styles.headerTitle}>รายการอุปกรณ์ที่ยืม</Text>
        <View style={{ width: 28 }} /> {/* ช่องว่างเพื่อดันให้ข้อความอยู่ตรงกลาง */}
      </View>

      {/* รายการอุปกรณ์ที่ยืม */}
      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.emptyText}>กำลังโหลดรายการยืม...</Text>
        </View>
      ) : borrowedItems.length > 0 ? (
        <FlatList
          data={borrowedItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <MaterialCommunityIcons name={item.icon} size={40} color="#475569" />
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{item.name}</Text>
                  <Text style={styles.dateText}>วันที่ยืม: {formatEquipmentDate(item.borrowDate)}</Text>
                  <Text style={styles.dateTextWarning}>กำหนดคืน: {formatEquipmentDate(item.returnDate)}</Text>
                </View>
              </View>

              {/* ปุ่มคืนอุปกรณ์ */}
              <Pressable
                style={styles.returnButton}
                onPress={() => router.push({ pathname: '/return_id', params: { itemId: item.id } })}
              >
                <Text style={styles.returnButtonText}>คืนอุปกรณ์</Text>
              </Pressable>
            </View>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={64} color="#94a3b8" />
          <Text style={styles.emptyText}>ไม่มีอุปกรณ์ที่กำลังยืม</Text>
        </View>
      )}
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
  listContainer: {
    padding: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
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
    color: '#ea580c', // สีส้มเพื่อเตือนให้รู้กำหนดคืน
    fontWeight: '600',
  },
  returnButton: {
    backgroundColor: '#2563eb',
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