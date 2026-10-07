"use client";
import Modal from "../ui/Modal";

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function ConfirmActionModal({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
  loading = false,
}: ConfirmActionModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <h2 className="text-xl font-bold text-[#13315c]">{title}</h2>

      <p className="mt-4 tracking-wide text-gray-600">{message}</p>

      <div className="modal-action">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn bg-[#13315c] text-white border-none hover:bg-[#155daf]"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            confirmText
          )}
        </button>
      </div>
    </Modal>
  );
}




//   <ConfirmActionModal
//   open={showCompleteModal}
//   title="Complete Order"
//   message="Are you sure you want to mark this order as completed?"
//   confirmText="Complete"
//   onCancel={() => setShowCompleteModal(false)}
//   onConfirm={handleComplete}
// />