"use client";

import { Menu } from "lucide-react";

type AdminHeaderProps = {
  onMenuClick: () => void;
};

export function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-[73px] border-b border-[#DCD2C3] bg-[#F6F1E8]/95 backdrop-blur">
      <div className="flex h-full items-center justify-between px-5 sm:px-8 lg:px-10">
        <button
          type="button"
          aria-label="Open admin navigation"
          className="grid h-10 w-10 place-items-center rounded-full text-[#174D3D] hover:bg-[#EAE1D2] lg:hidden"
          onClick={onMenuClick}
        >
          <Menu size={21} strokeWidth={1.6} />
        </button>

        <div className="hidden lg:block">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A958B]">
            Catalogue administration
          </p>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-medium text-[#242B27]">Administrator</p>

            <p className="mt-0.5 text-[11px] text-[#8B938D]">
              Catalogue management
            </p>
          </div>

          <div
            className="grid h-9 w-9 place-items-center rounded-full bg-[#174D3D] text-xs font-medium text-white"
            aria-hidden="true"
          >
            A
          </div>
        </div>
      </div>
    </header>
  );
}
