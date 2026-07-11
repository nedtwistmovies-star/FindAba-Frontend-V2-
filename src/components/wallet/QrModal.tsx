import React, { useState } from 'react';
import { X, QrCode, Camera, Check, ShieldCheck, Download, Share2 } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrModal: React.FC<QrModalProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'myQr' | 'scan'>('myQr');
  const [scanned, setScanned] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative space-y-6">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-2xl">
          <button
            onClick={() => setTab('myQr')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
              tab === 'myQr' ? 'bg-[#0B7A3B] text-white shadow' : 'text-zinc-500'
            }`}
          >
            My QR Code
          </button>
          <button
            onClick={() => setTab('scan')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition-all ${
              tab === 'scan' ? 'bg-[#0B7A3B] text-white shadow' : 'text-zinc-500'
            }`}
          >
            Scan & Pay
          </button>
        </div>

        {tab === 'myQr' ? (
          <div className="text-center space-y-4">
            <div>
              <h3 className="font-black text-lg text-zinc-900 dark:text-white">FindAba City Pay QR</h3>
              <p className="text-xs text-zinc-500">Scan to pay Chinedu Okoro instantly via FindAba OS Wallet.</p>
            </div>

            <div className="w-56 h-56 bg-white border-4 border-[#0B7A3B] rounded-3xl mx-auto flex items-center justify-center p-4 shadow-xl">
              <div className="w-full h-full bg-zinc-950 rounded-2xl flex flex-col items-center justify-center text-white p-4 space-y-2">
                <QrCode className="w-20 h-20 text-[#D4AF37]" />
                <span className="font-mono text-[10px] text-emerald-400">FOS-USER-94821</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => alert('QR Code downloaded as PNG')} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold text-xs flex items-center gap-1.5">
                <Download className="w-4 h-4" /> Download
              </button>
              <button onClick={() => alert('Link copied')} className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl font-bold text-xs flex items-center gap-1.5">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div>
              <h3 className="font-black text-lg text-zinc-900 dark:text-white">Scan Merchant or Citizen QR</h3>
              <p className="text-xs text-zinc-500">Point your camera at any FindAba QR code to pay instantly.</p>
            </div>

            <div className="relative h-64 bg-zinc-950 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center text-white overflow-hidden">
              <Camera className="w-12 h-12 text-[#D4AF37] animate-pulse mb-2" />
              <span className="text-xs text-zinc-400">Camera viewfinder active...</span>
              <div className="absolute inset-8 border-2 border-dashed border-[#0B7A3B] rounded-2xl pointer-events-none" />
            </div>

            <button
              onClick={() => {
                setScanned(true);
                setTimeout(() => {
                  alert('Successfully scanned Ariaria Leather Hub QR! Transfer dialog opened.');
                  onClose();
                }, 1000);
              }}
              className="w-full py-3 bg-[#0B7A3B] text-white font-bold rounded-xl text-xs shadow-lg"
            >
              {scanned ? 'Scanning Verified...' : 'Simulate Successful QR Scan'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
