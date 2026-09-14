import { cn } from '@/utils/cn'
import { images } from '@/assets/images'

interface LogoProps {
  className?: string
  markOnly?: boolean
  light?: boolean
  compact?: boolean
}

export function Logo({
  className,
  markOnly = false,
  light = false,
  compact = false,
}: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <img
        src={images.icon}
        alt=""
        width={compact ? 32 : 40}
        height={compact ? 32 : 40}
        className={cn(
          'rounded-lg object-cover',
          compact ? 'h-8 w-8' : 'h-10 w-10 shadow-lg shadow-primary/20',
        )}
        aria-hidden="true"
      />
      {!markOnly ? (
        <span
          className={cn(
            'font-bold tracking-tight',
            compact ? 'text-base' : 'text-lg',
            light ? 'text-white' : 'text-ink',
          )}
        >
          YetiWize
        </span>
      ) : (
        <span className="sr-only">YetiWize</span>
      )}
    </span>
  )
}
