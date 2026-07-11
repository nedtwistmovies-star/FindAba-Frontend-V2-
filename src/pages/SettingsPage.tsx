import React, { useState } from 'react';
import { Settings, Shield, Bell, Moon, Sun, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useStore();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage your FindAba OS preferences, appearance, and notifications.</p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center gap-3">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>Settings updated successfully!</span>
        </div>
      )}

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-zinc-900 dark:text-white text-base">Appearance</h3>
        
        <div className="flex items-center justify-between py-3 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Dark Mode</h4>
            <p className="text-xs text-zinc-500">Toggle dark visual theme across FindAba OS</p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow flex items-center gap-2"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span className="capitalize">{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-zinc-900 dark:text-white text-base">Notifications & Alerts</h3>

        <div className="flex items-center justify-between py-3 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Town Hall Announcements</h4>
            <p className="text-xs text-zinc-500">Receive alerts on city council meetings and merchant dispatches</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600 rounded" />
        </div>

        <div className="flex items-center justify-between py-3 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">Order Status Updates</h4>
            <p className="text-xs text-zinc-500">Get notified when shoes or goods are ready for pickup</p>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-600 rounded" />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all"
      >
        Save Preferences
      </button>
    </div>
  );
};
