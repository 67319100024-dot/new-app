import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';

import { EQUIPMENT_DATA, type Equipment, type EquipmentIcon } from '@/constants/equipment';

const STORAGE_KEY = 'borrowed-equipment';
const BORROW_PERIOD_DAYS = 3;

export type BorrowedItem = {
  id: string;
  equipmentId: string;
  name: string;
  icon: EquipmentIcon;
  borrowDate: string;
  returnDate: string;
};

type BorrowedItemsContextValue = {
  borrowedItems: BorrowedItem[];
  isLoading: boolean;
  addBorrowedItem: (equipment: Equipment) => Promise<void>;
  removeBorrowedItem: (id: string) => Promise<void>;
};

const BorrowedItemsContext = createContext<BorrowedItemsContextValue | null>(null);

function isBorrowedItem(value: unknown): value is BorrowedItem {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const item = value as Record<string, unknown>;
  const equipment = EQUIPMENT_DATA.find((candidate) => candidate.id === item.equipmentId);

  return (
    typeof item.id === 'string' &&
    !!equipment &&
    item.name === equipment.name &&
    item.icon === equipment.icon &&
    typeof item.borrowDate === 'string' &&
    !Number.isNaN(Date.parse(item.borrowDate)) &&
    typeof item.returnDate === 'string' &&
    !Number.isNaN(Date.parse(item.returnDate))
  );
}

function parseBorrowedItems(rawValue: string | null): BorrowedItem[] {
  if (rawValue === null) {
    return [];
  }

  const parsed: unknown = JSON.parse(rawValue);
  if (!Array.isArray(parsed) || !parsed.every(isBorrowedItem)) {
    throw new Error('ข้อมูลรายการยืมที่บันทึกไว้ไม่ถูกต้อง');
  }

  return parsed;
}

export function BorrowedItemsProvider({ children }: { children: ReactNode }) {
  const [borrowedItems, setBorrowedItems] = useState<BorrowedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBorrowedItems = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
        const storedItems = parseBorrowedItems(storedValue);
        if (isMounted) {
          setBorrowedItems(storedItems);
        }
      } catch (error) {
        if (isMounted) {
          const message = error instanceof Error ? error.message : 'ไม่สามารถอ่านข้อมูลรายการยืมได้';
          Alert.alert('โหลดข้อมูลไม่สำเร็จ', message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadBorrowedItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const addBorrowedItem = useCallback(async (equipment: Equipment) => {
    if (borrowedItems.length > 0) {
      throw new Error('กรุณาคืนอุปกรณ์ชิ้นก่อนหน้าก่อนยืมชิ้นใหม่');
    }

    const borrowDate = new Date();
    const returnDate = new Date(borrowDate);
    returnDate.setDate(returnDate.getDate() + BORROW_PERIOD_DAYS);

    const item: BorrowedItem = {
      id: `${equipment.id}-${borrowDate.getTime()}`,
      equipmentId: equipment.id,
      name: equipment.name,
      icon: equipment.icon,
      borrowDate: borrowDate.toISOString(),
      returnDate: returnDate.toISOString(),
    };
    const nextItems = [...borrowedItems, item];

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    setBorrowedItems(nextItems);
  }, [borrowedItems]);

  const removeBorrowedItem = useCallback(async (id: string) => {
    const nextItems = borrowedItems.filter((item) => item.id !== id);
    if (nextItems.length === borrowedItems.length) {
      throw new Error('ไม่พบรายการยืมที่ต้องการคืน');
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextItems));
    setBorrowedItems(nextItems);
  }, [borrowedItems]);

  const value = useMemo(
    () => ({ borrowedItems, isLoading, addBorrowedItem, removeBorrowedItem }),
    [borrowedItems, isLoading, addBorrowedItem, removeBorrowedItem]
  );

  return <BorrowedItemsContext.Provider value={value}>{children}</BorrowedItemsContext.Provider>;
}

export function useBorrowedItems() {
  const context = useContext(BorrowedItemsContext);
  if (!context) {
    throw new Error('useBorrowedItems ต้องใช้ภายใน BorrowedItemsProvider');
  }

  return context;
}
