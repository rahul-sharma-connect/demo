import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { Modal } from '@/components/ui/Modal'
import { WishlistForm } from '@/components/landing/WishlistForm'
import type { WishlistPlatform } from '@/api/client'

type WishlistContextValue = {
  openWishlist: (platform?: WishlistPlatform) => void
  closeWishlist: () => void
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [platform, setPlatform] = useState<WishlistPlatform>('both')

  const openWishlist = useCallback((nextPlatform: WishlistPlatform = 'both') => {
    setPlatform(nextPlatform)
    setOpen(true)
  }, [])

  const closeWishlist = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ openWishlist, closeWishlist }),
    [openWishlist, closeWishlist],
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <Modal
        open={open}
        onClose={closeWishlist}
        title="Join the YetiWize wishlist"
        description="Be first to know when we launch on the App Store and Google Play."
        size="md"
      >
        <WishlistForm
          defaultPlatform={platform}
          onSuccess={() => {
            window.setTimeout(closeWishlist, 1800)
          }}
        />
      </Modal>
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return ctx
}
