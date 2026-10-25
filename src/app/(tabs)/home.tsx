import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, type ComponentProps } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

// ข้อมูลจำลองอุปกรณ์ 4 ชิ้น (Mock Data)
const EQUIPMENT_DATA: {
  id: string;
  name: string;
  icon: IconName;
  status: string;
}[] = [
  { id: '1', name: 'กล้อง', icon: 'camera', status: 'ว่าง' },
  { id: '2', name: 'โน้ตบุ๊ก', icon: 'laptop', status: 'ไม่ว่าง' },
  { id: '3', name: 'สายชาร์จ USB-C', icon: 'usb', status: 'ว่าง' },
  { id: '4', name: 'โปรเจกเตอร์', icon: 'projector', status: 'ไม่ว่าง' },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const query = searchQuery.trim().toLowerCase();
  const filteredEquipment = EQUIPMENT_DATA.filter((item) =>
    item.name.toLowerCase().includes(query)
  );

  return (
    <View style={styles.container}>
      {/* โซนเนื้อหาหลัก */}
      <View style={styles.content}>
        <Text style={styles.headerTitle}>อุปกรณ์ใน บริษัท</Text>
        <Text style={styles.subHeader}>กรุณาเลือกอุปกรณ์ 1 ชิ้น</Text>

        {/* กล่องค้นหา */}
        <View style={styles.searchBox}>
          <MaterialCommunityIcons name="magnify" size={24} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="ค้นหาอุปกรณ์..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* โซนแสดงรายการอุปกรณ์ */}
        <FlatList
          data={filteredEquipment}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable 
              style={styles.card}
              // ลิงก์ไปหน้าที่ 3 พร้อมแนบข้อมูลของชิ้นที่กดไปด้วย
              onPress={() => router.push({
                pathname: '/id_page',
                params: { id: item.id, name: item.name, icon: item.icon, status: item.status }
              })}
            >
              <View style={styles.cardLeft}>
              <MaterialCommunityIcons name={item.icon} size={32} color="#475569" />
                <Text style={styles.deviceName}>{item.name}</Text>
              </View>
              
              {/* สถานะอุปกรณ์ */}
              <Text style={[
                styles.statusText, 
                { color: item.status === 'ว่าง' ? '#16a34a' : '#dc2626' }
              ]}>
                {item.status}
              </Text>
            </Pressable>
          )}
        />
      </View>

      {/* โซน Footer Bar */}
      <View style={styles.footer}>
        <Pressable style={styles.footerItem} onPress={() => router.replace('/home')}>
          <MaterialCommunityIcons name="home" size={28} color="#2563eb" />
          <Text style={[styles.footerText, { color: '#2563eb', fontWeight: 'bold' }]}>หน้าหลัก</Text>
        </Pressable>

        <Pressable style={styles.footerItem} onPress={() => router.push('/id_data')}>
          <MaterialCommunityIcons name="calendar" size={28} color="#64748b" />
          <Text style={styles.footerText}>ปฏิทิน</Text>
        </Pressable>

        <Pressable style={styles.footerItem} onPress={() => router.push('/id_data_warn')}>
          <MaterialCommunityIcons name="bell" size={28} color="#64748b" />
          <Text style={styles.footerText}>แจ้งเตือน</Text>
        </Pressable>

        <Pressable style={styles.footerItem}>
          <MaterialCommunityIcons name="cog" size={28} color="#64748b" />
          <Text style={styles.footerText}>ตั้งค่า</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#0f172a',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  footerItem: {
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});