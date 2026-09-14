import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  type Timestamp,
} from 'firebase/firestore'
import type { WishlistPlatform } from '@/api/client'
import type { DeviceInfo } from '@/lib/deviceInfo'
import { getFirestoreDb } from '@/lib/firebase'

export type WishlistEntry = {
  id: string
  email: string
  platform: WishlistPlatform
  source: string
  device: DeviceInfo
  createdAt: Date | null
}

function toDate(value: Timestamp | Date | null | undefined): Date | null {
  if (!value) return null
  if (value instanceof Date) return value
  if (typeof value.toDate === 'function') return value.toDate()
  return null
}

function mapDoc(id: string, data: Record<string, unknown>): WishlistEntry {
  return {
    id,
    email: String(data.email ?? ''),
    platform: (data.platform as WishlistPlatform) ?? 'both',
    source: String(data.source ?? ''),
    device: (data.device as DeviceInfo) ?? ({} as DeviceInfo),
    createdAt: toDate(data.createdAt as Timestamp | undefined),
  }
}

function mapSnapshot(snap: Awaited<ReturnType<typeof getDocs>>) {
  return snap.docs.map((d) => mapDoc(d.id, d.data() as Record<string, unknown>))
}

export async function fetchWishlistEntries(): Promise<WishlistEntry[]> {
  const db = getFirestoreDb()
  const col = collection(db, 'wishlist')

  try {
    const q = query(col, orderBy('createdAt', 'desc'))
    return mapSnapshot(await getDocs(q))
  } catch (err) {
    const code = (err as { code?: string }).code
    if (code === 'failed-precondition') {
      const entries = mapSnapshot(await getDocs(col))
      return entries.sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
    }
    throw err
  }
}

export async function fetchWishlistEntry(id: string): Promise<WishlistEntry | null> {
  const db = getFirestoreDb()
  const snap = await getDoc(doc(db, 'wishlist', id))
  if (!snap.exists()) return null
  return mapDoc(snap.id, snap.data())
}
