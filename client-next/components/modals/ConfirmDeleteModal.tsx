"use client";

import React from "react";
import Modal from "@/components/ui/Modal";

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmDeleteModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <h2 className="text-xl text-[#13315c] font-bold">
        {title}
      </h2>

      <p className="tracking-wide mt-4">
        {message}
      </p>

      <div className="modal-action">
        <button
          type="button"
          onClick={onCancel}
          className="btn bg-[#155daf] text-white border-none hover:bg-[#155daf]"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onConfirm}
          className="btn bg-red-200 hover:bg-red-300 "
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
