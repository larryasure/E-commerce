"use client";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string
}

export default function Modal({ open, onClose, children, className="" }: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal modal-open">
      <div className={`modal-box ${className}`} >{children}</div>

      <div className="modal-backdrop" onClick={onClose}>
        <button type="button">close</button>
      </div>
    </div>
  );
}
