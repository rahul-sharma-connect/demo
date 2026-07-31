import { cn } from '@/utils/cn'
import { images } from '@/assets/images'

interface LogoProps {
  className?: string
  markOnly?: boolean
  light?: boolean
}

export function Logo({ className, markOnly = false, light = false }: LogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <img
        src={images.icon}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 rounded-xl object-cover shadow-lg shadow-primary/20"
        aria-hidden="true"
      />
      {!markOnly ? (
        <span
          className={cn(
            'text-lg font-bold tracking-tight',
            light ? 'text-white' : 'text-slate-900',
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
