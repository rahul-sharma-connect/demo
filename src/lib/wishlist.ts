import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { collectDeviceInfo } from '@/lib/deviceInfo'
import { getFirestoreDb } from '@/lib/firebase'
import type { WishlistPlatform } from '@/api/client'

export type WishlistRecord = {
  email: string
  platform: WishlistPlatform
  source: 'yetiwize-web'
  device: ReturnType<typeof collectDeviceInfo>
  createdAt: ReturnType<typeof serverTimestamp>
}

export async function joinWishlist(email: string, platform: WishlistPlatform) {
  const db = getFirestoreDb()
  const device = collectDeviceInfo()

  const docRef = await addDoc(collection(db, 'wishlist'), {
    email: email.trim().toLowerCase(),
    platform,
    source: 'yetiwize-web',
    device,
    createdAt: serverTimestamp(),
  })

  return { id: docRef.id }
}
