import { QuartzComponentConstructor } from "./types";

/**
 * Asks for confirmation before opening a specific external link.
 *
 * Renders a hidden <dialog>. A click on any <a> whose href equals `url`
 * (in the footer or inside a note) opens the dialog instead of following
 * the link; the link opens in a new tab only after "Open" is pressed.
 *
 * This file lives in the wiki repo under .quartz/quartz/components/ and is
 * copied into Quartz at build time. It is used in quartz.layout.ts.
 */

interface Options {
  url: string;
  title: string;
  // Each line is shown as its own paragraph
  message: string[];
  confirmLabel: string;
  cancelLabel: string;
}

export default ((opts: Options) => {
  function ConfirmLink() {
    return (
      <dialog class="confirm-link" data-url={opts.url}>
        <form method="dialog">
          <h3>{opts.title}</h3>
          {opts.message.map((line) => (
            <p>{line}</p>
          ))}
          <div class="confirm-link-actions">
            <button value="cancel" class="confirm-link-cancel">
              {opts.cancelLabel}
            </button>
            <button value="open" class="confirm-link-open">
              {opts.confirmLabel}
            </button>
          </div>
        </form>
      </dialog>
    );
  }

  ConfirmLink.afterDOMLoaded = `
    // Registered once on document, so it keeps working across Quartz's
    // client-side page navigation (the dialog element itself may be replaced).
    if (!window.__confirmLinkInstalled) {
      window.__confirmLinkInstalled = true

      document.addEventListener("click", (e) => {
        const link = e.target.closest && e.target.closest("a[href]")
        if (!link) return
        const dialog = document.querySelector("dialog.confirm-link")
        if (!dialog || link.href !== new URL(dialog.dataset.url).href) return

        e.preventDefault()
        e.stopPropagation()
        dialog.returnValue = ""
        dialog.showModal()
      }, true)

      document.addEventListener("close", (e) => {
        const dialog = e.target
        if (!(dialog instanceof HTMLDialogElement) || !dialog.classList.contains("confirm-link")) return
        if (dialog.returnValue === "open") {
          window.open(dialog.dataset.url, "_blank", "noopener,noreferrer")
        }
      }, true)

      // Click on the dimmed backdrop closes the dialog
      document.addEventListener("click", (e) => {
        if (e.target instanceof HTMLDialogElement && e.target.classList.contains("confirm-link")) {
          e.target.close("cancel")
        }
      })
    }
  `;

  ConfirmLink.css = `
    dialog.confirm-link {
      max-width: min(28rem, calc(100vw - 2rem));
      padding: 1.5rem;
      border: 1px solid var(--lightgray);
      border-radius: 10px;
      background: var(--light);
      color: var(--darkgray);
    }
    dialog.confirm-link::backdrop {
      background: rgba(0, 0, 0, 0.5);
    }
    dialog.confirm-link h3 {
      margin: 0 0 0.75rem;
      color: var(--dark);
    }
    dialog.confirm-link p {
      margin: 0.4rem 0;
    }
    .confirm-link-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin-top: 1.25rem;
    }
    .confirm-link-actions button {
      font: inherit;
      padding: 0.45rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      border: 1px solid var(--lightgray);
      background: transparent;
      color: var(--darkgray);
    }
    .confirm-link-actions .confirm-link-open {
      border-color: var(--secondary);
      background: var(--secondary);
      color: var(--light);
      font-weight: 600;
    }
  `;

  return ConfirmLink;
}) satisfies QuartzComponentConstructor<Options>;
