import { useEffect } from "react";
import "./DeleteConfirmationModal.css";

export default function DeleteConfirmationModal({
  open,
  title = "Delete Research Note",
  message = "Are you sure you want to delete this research note? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onCancel?.();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onCancel]);

  if (!open) return null;

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onCancel?.();
    }
  }

  return (
    <div
      className="delete-modal-backdrop"
      onClick={handleBackdropClick}
    >
      <div className="delete-modal">
        <div className="delete-modal-header">
          <h2>{title}</h2>
        </div>

        <div className="delete-modal-body">
          <p>{message}</p>
        </div>

        <div className="delete-modal-footer">
          <button
            className="delete-modal-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>

          <button
            className="delete-modal-confirm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}