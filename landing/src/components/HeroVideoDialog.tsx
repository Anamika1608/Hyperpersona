import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

type HeroVideoDialogProps = {
  videoSrc: string;
};

export function HeroVideoDialog({ videoSrc }: HeroVideoDialogProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    const triggerButton = triggerButtonRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key === "Tab") {
        const focusable = Array.from(
          dialogRef.current?.querySelectorAll<HTMLElement>(
            'button, video[controls], a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ) ?? [],
        ).filter((element) => !element.hasAttribute("disabled") && element.tabIndex >= 0);

        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && active === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      triggerButton?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Play HyperPersona demo"
        className="video-shell"
        ref={triggerButtonRef}
        onClick={() => setOpen(true)}
      >
        <span className="video-orbit" aria-hidden />
        <span className="video-frame">
          <span className="video-toolbar" aria-hidden>
            <span />
            <span />
            <span />
          </span>
          <video
            aria-label="HyperPersona demo preview"
            className="video-preview"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <span className="play-button" aria-hidden>
            <Play size={28} fill="currentColor" />
          </span>
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="dialog-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="video-dialog"
              ref={dialogRef}
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="dialog-head">
                <h3 id={titleId}>HyperPersona product demo</h3>
                <button
                  type="button"
                  ref={closeButtonRef}
                  onClick={() => setOpen(false)}
                  aria-label="Close video dialog"
                >
                  <X size={18} />
                </button>
              </div>
              <video className="dialog-video" controls autoPlay playsInline tabIndex={0}>
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
