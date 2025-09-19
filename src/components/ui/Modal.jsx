"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export const Modal = ({ title, onClose, children }) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-[1000px] w-3/5 p-4 flex flex-col gap-y-2 bg-[#eee] rounded-lg"
      >
        <div className="modal-header flex justify-between">
          <h1 className="text-xl font-bold">{title}</h1>
          <button className="modal-close" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <div className="h-[2px] bg-[#ddd]"></div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
  // return createPortal(
  //   <div
  //     onClick={onClose}
  //     className="fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50"
  //   >
  //     <div
  //       onClick={(e) => e.stopPropagation()}
  //       className="max-w-[1000px] w-3/5 p-4 flex flex-col gap-y-2 bg-[#eee] rounded-lg"
  //     >
  //       <div className="modal-header flex justify-between">
  //         <h1 className="text-xl font-bold">Insert Node</h1>
  //         <button className="modal-close" onClick={onClose}>
  //           <IoClose />
  //         </button>
  //       </div>
  //       <div className="h-[2px] bg-[#ddd]"></div>
  //       <div className="modal-body">{children}</div>
  //     </div>
  //   </div>,
  //   document.body
  // );
};
