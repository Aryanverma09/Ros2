import { Settings, X } from "lucide-react";
import React, { useState } from "react";

const Setting = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Settings Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 z-[10000] flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-white shadow-2xl transition hover:bg-gray-700 active:scale-95 sm:bottom-5 sm:right-5"
      >
        {open ? <X size={22} /> : <Settings size={22} />}
      </button>

      {/* Settings Popup */}
      {open && (
        <div className="fixed bottom-20 right-4 z-[9999] w-[calc(100vw-2rem)] max-w-[320px] rounded-2xl bg-gray-900 p-5 text-white shadow-2xl sm:right-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Settings</h2>

            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-white/10 p-1 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <button className="w-full rounded-lg bg-gray-700 px-4 py-2 text-left text-sm font-medium hover:bg-gray-600">
              Robot Speed
            </button>

            <button className="w-full rounded-lg bg-gray-700 px-4 py-2 text-left text-sm font-medium hover:bg-gray-600">
              Camera Settings
            </button>

            <button className="w-full rounded-lg bg-gray-700 px-4 py-2 text-left text-sm font-medium hover:bg-gray-600">
              Map Settings
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Setting;