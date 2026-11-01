import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type EquipmentIcon = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type Equipment = {
  id: string;
  name: string;
  icon: EquipmentIcon;
  status: 'ว่าง' | 'ไม่ว่าง';
};

export const EQUIPMENT_DATA = [
  { id: '1', name: 'กล้อง', icon: 'camera', status: 'ว่าง' },
  { id: '2', name: 'โน้ตบุ๊ก', icon: 'laptop', status: 'ว่าง' },
  { id: '3', name: 'สายชาร์จ USB-C', icon: 'usb', status: 'ว่าง' },
  { id: '4', name: 'โปรเจกเตอร์', icon: 'projector', status: 'ว่าง' },
] satisfies readonly Equipment[];
