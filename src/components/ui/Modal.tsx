import {
  useEffect,
  type FormEvent,
  type ReactNode,
} from "react"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

type ModalSize = "sm" | "md" | "lg"

type ModalProps = {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  size?: ModalSize
  /** Hide the header close button */
  hideClose?: boolean
  footer?: ReactNode
}

const sizeClass: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
}

function useLockBody(open: boolean) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])
}

function useEscapeClose(open: boolean, onClose: () => void, enabled = true) {
  useEffect(() => {
    if (!open || !enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, onClose, enabled])
}

export function Modal({
  open,
  title,
  description,
  onClose,
  children,
  size = "md",
  hideClose = false,
  footer,
}: ModalProps) {
  useLockBody(open)
  useEscapeClose(open, onClose)

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close dialog backdrop"
            className="absolute inset-0 cursor-pointer bg-slate-900/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl border border-border/60 bg-card p-5 shadow-card sm:p-6 ${sizeClass[size]}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  id="modal-title"
                  className="text-[16px] font-bold tracking-tight text-ink"
                >
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    {description}
                  </p>
                ) : null}
              </div>
              {!hideClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-bg text-muted transition hover:bg-primary-soft hover:text-primary"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            {children}

            {footer ? <div className="mt-5">{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

type ConfirmModalProps = {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onClose: () => void
  icon?: ReactNode
}

export function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  onConfirm,
  onClose,
  icon,
}: ConfirmModalProps) {
  useLockBody(open)
  useEscapeClose(open, onClose, !loading)

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close dialog backdrop"
            className="absolute inset-0 cursor-pointer bg-slate-900/35 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={loading ? undefined : onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-border/60 bg-card p-6 text-center shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            {icon ? (
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                {icon}
              </div>
            ) : null}

            <h2
              id="confirm-modal-title"
              className="text-[17px] font-bold tracking-tight text-ink"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                {description}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="cursor-pointer rounded-full border border-border bg-card px-4 py-2.5 text-[13px] font-semibold text-ink transition hover:bg-bg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => void onConfirm()}
                className="cursor-pointer rounded-full bg-primary px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Please wait…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

type FieldProps = {
  label: string
  children: ReactNode
}

export function Field({ label, children }: FieldProps) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[12px] font-medium text-muted">
        {label}
      </span>
      {children}
    </label>
  )
}

export const inputClass =
  "w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-[13.5px] text-ink outline-none focus:border-primary/40"

type FormActionsProps = {
  onCancel: () => void
  saving?: boolean
  submitLabel?: string
  danger?: boolean
  onSubmit?: (e: FormEvent) => void
}

export function FormActions({
  onCancel,
  saving,
  submitLabel = "Save",
  danger,
}: FormActionsProps) {
  return (
    <div className="mt-4 flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="cursor-pointer rounded-full border border-border px-4 py-2 text-[13px] font-semibold text-ink hover:bg-bg"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className={`cursor-pointer rounded-full px-4 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
          danger ? "bg-chart-expense" : "bg-primary"
        }`}
      >
        {saving ? "Saving…" : submitLabel}
      </button>
    </div>
  )
}
