'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { Wallet, CreditCard, History, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import axios from 'axios';
import Script from 'next/script';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT_IN' | 'PAYMENT_OUT' | 'REFUND';
  status: string;
  createdAt: string;
}

interface WalletData {
  id: string;
  balance: number;
  transactions: Transaction[];
}

interface SnapResult {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
}

interface Snap {
  pay: (token: string, options: {
    onSuccess: (result: SnapResult) => void;
    onPending: (result: SnapResult) => void;
    onError: (result: SnapResult) => void;
    onClose: () => void;
  }) => void;
}

declare global {
  interface Window {
    snap: Snap; 
  }
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState<string>('');
  
  const presetAmounts = [50000, 100000, 250000, 500000, 1000000, 2500000];

  const fetchWallet = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${apiUrl}/user/client/wallet`, { withCredentials: true });
      if (response.data.code === 200) {
        setWallet(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleTopUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) < 10000) {
      alert("Minimal top up Rp 10.000");
      return;
    }

    setIsProcessing(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      // 1. Minta Token ke Backend
      const response = await axios.post(`${apiUrl}/user/client/wallet`, { amount }, { withCredentials: true });
      const { token } = response.data.data;

      // 2. Munculkan Pop-up Snap Midtrans
      if (window.snap) {
        window.snap.pay(token, {
          // Callback sekarang menggunakan tipe SnapResult, bukan any
          onSuccess: function(result: SnapResult) {
            console.log(result);
            alert("Pembayaran Berhasil!");
            setAmount('');
            setTimeout(() => fetchWallet(), 2000); 
          },
          onPending: function(result: SnapResult) {
            console.log(result);
            alert("Menunggu pembayaran...");
            setAmount('');
            setTimeout(() => fetchWallet(), 2000); 
          },
          onError: function(result: SnapResult) {
            console.log(result);
            alert("Pembayaran gagal!");
          },
          onClose: function() {
            alert('Anda menutup popup pembayaran sebelum menyelesaikan pembayaran');
          }
        });
      }

    } catch (error) {
      console.error("Top up error:", error);
      alert("Gagal memproses pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-600';
      case 'PENDING': return 'bg-amber-100 text-amber-600';
      case 'FAILED': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  }

  return (
    <DashboardLayout role="client">
      {/* Script Midtrans */}
      <Script 
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL} 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
        strategy="lazyOnload" 
      />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Saldo & Pembayaran</h1>
        <p className="text-slate-500">Kelola saldo akun Anda via Midtrans</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Wallet size={120} /></div>
            <div className="relative z-10">
              <p className="text-blue-100 font-medium mb-2">Total Saldo Aktif</p>
              <h2 className="text-4xl font-bold tracking-tight">
                {isLoading ? "..." : formatRupiah(wallet?.balance || 0)}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Plus size={24} /></div>
              <h3 className="text-xl font-bold text-slate-900">Isi Saldo (Top Up)</h3>
            </div>

            <form onSubmit={handleTopUp}>
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nominal Top Up</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg" />
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-3">Pilihan Cepat</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {presetAmounts.map((val) => (
                    <button key={val} type="button" onClick={() => setAmount(val.toString())} className={`py-2 px-3 rounded-lg border text-sm font-semibold transition ${amount === val.toString() ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 hover:bg-blue-50'}`}>{formatRupiah(val)}</button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isProcessing || isLoading} className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-900/20 disabled:opacity-50 flex justify-center items-center gap-2">
                {isProcessing ? 'Memproses Token...' : <><CreditCard size={18} /> Bayar Sekarang</>}
              </button>
            </form>
          </div>
        </div>

        {/* KOLOM KANAN: History */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full flex flex-col">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><History size={20} className="text-slate-400" /> Riwayat Transaksi</h3>
            <div className="flex-1 overflow-y-auto pr-1 space-y-4">
              {wallet?.transactions.map((trx) => (
                <div key={trx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trx.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {trx.type === 'DEPOSIT' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{trx.type === 'DEPOSIT' ? 'Top Up' : 'Keluar'}</p>
                      <p className="text-[10px] text-slate-400 uppercase">{formatDate(trx.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${trx.type === 'DEPOSIT' ? 'text-emerald-600' : 'text-slate-900'}`}>{trx.type === 'DEPOSIT' ? '+' : '-'}{formatRupiah(trx.amount)}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusColor(trx.status)}`}>{trx.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}