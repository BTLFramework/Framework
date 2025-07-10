import React from "react";

interface SessionDialogShellProps {
  icon: React.ReactNode;
  title: string;
  pills: React.ReactNode[];
  onClose: () => void;
  children: React.ReactNode;
  footerButton?: React.ReactNode;
}

export function SessionDialogShell({
  icon,
  title,
  pills,
  onClose,
  children,
  footerButton,
}: SessionDialogShellProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-btl-100">
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-r from-btl-400 via-btl-500 to-btl-600 rounded-t-3xl flex flex-col items-center">
          <div className="absolute right-6 top-6 cursor-pointer" onClick={onClose}>
            <svg className="w-7 h-7 text-white hover:text-btl-100 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="w-16 h-16 bg-btl-100 rounded-xl flex items-center justify-center mb-3 shadow-md">
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 text-center drop-shadow">{title}</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-1">
            {pills.map((pill, i) => (
              <span key={i}>{pill}</span>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
          {children}
        </div>
        {/* Footer */}
        {footerButton && (
          <div className="px-8 py-5 bg-btl-50 border-t border-btl-100 flex justify-end rounded-b-3xl">
            {footerButton}
          </div>
        )}
      </div>
    </div>
  );
} 