'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  History, 
  Download, 
  CreditCard,
  Loader2,
  MoreVertical
} from 'lucide-react';
import axios from 'axios';

interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'PAYMENT_IN' | 'PAYMENT_OUT' | 'REFUND';
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  description?: string;
  createdAt: string;
}

interface WalletData {
  balance: number;
  bankName: string | null;
  accountNumber: string | null;
  accountHolder: string | null;
  transactions: Transaction[];
}

export default function FreelancerWalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const mockData: WalletData = {
    balance: 2500000,
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "1234567890",
    accountHolder: "Fulan bin Fulan",
    transactions: [
      { id: '1', type: 'PAYMENT_IN', amount: 1500000, status: 'COMPLETED', description: 'Payment for Logo Project', createdAt: '2025-12-30T10:00:00Z' },
      { id: '2', type: 'WITHDRAWAL', amount: 500000, status: 'COMPLETED', description: 'Withdrawal to BCA', createdAt: '2025-12-28T09:00:00Z' },
      { id: '3', type: 'PAYMENT_IN', amount: 1500000, status: 'PENDING', description: 'Escrow Release - Website Design', createdAt: '2025-12-25T14:00:00Z' },
    ]
  };

  const fetchWallet = async () => {
    setIsLoading(true);
    try {
      setTimeout(() => {
        setWallet(mockData);
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error("Failed to fetch wallet", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet()
  }, []);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'FAILED': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type === 'WITHDRAWAL' || type === 'PAYMENT_OUT') {
      return <ArrowUpRight className="w-5 h-5 text-red-500" />;
    }
    return <ArrowDownLeft className="w-5 h-5 text-emerald-500" />;
  };

  return (
    <DashboardLayout role="freelancer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dompet Saya</h1>
        <p className="text-slate-500">Kelola pendapatan dan penarikan dana Anda</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : wallet ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full transform translate-x-10 -translate-y-10"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 opacity-90">
                  <Wallet className="w-5 h-5" />
                  <span className="font-medium">Total Saldo Aktif</span>
                </div>
                <div className="text-4xl font-bold mb-6">
                  {formatRupiah(wallet.balance)}
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setIsWithdrawModalOpen(true)}
                    className="flex items-center gap-2 bg-white text-blue-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Tarik Dana
                  </button>
                  <button className="flex items-center gap-2 bg-blue-700 text-white border border-blue-500 px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition">
                    <History className="w-4 h-4" />
                    Analitik
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-slate-500" />
                    Akun Bank
                  </h3>
                  <button className="text-sm text-blue-600 hover:underline">Ubah</button>
                </div>
                
                {wallet.bankName ? (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1">Bank Terdaftar</p>
                    <p className="font-bold text-slate-900 text-lg">{wallet.bankName}</p>
                    <p className="text-slate-600 font-mono mt-1 tracking-wide">{wallet.accountNumber}</p>
                    <p className="text-xs text-slate-400 mt-2 uppercase">{wallet.accountHolder}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-500 text-sm mb-2">Belum ada rekening terhubung</p>
                    <button className="text-blue-600 font-medium text-sm hover:underline">
                      + Tambah Rekening
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Status Akun</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    Verified
                    <CreditCard className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-900">Riwayat Transaksi</h3>
              <button className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1">
                Filter
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Transaksi</th>
                    <th className="px-6 py-4">Tanggal</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {wallet.transactions.length > 0 ? (
                    wallet.transactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${trx.type === 'WITHDRAWAL' ? 'bg-red-50' : 'bg-emerald-50'}`}>
                              {getTransactionIcon(trx.type)}
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {trx.type === 'PAYMENT_IN' ? 'Terima Pembayaran' : 
                                 trx.type === 'WITHDRAWAL' ? 'Penarikan Dana' : trx.type}
                              </p>
                              <p className="text-xs text-slate-500">{trx.description || '-'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(trx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(trx.status)}`}>
                            {trx.status}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${
                          trx.type === 'WITHDRAWAL' || trx.type === 'PAYMENT_OUT' ? 'text-slate-900' : 'text-emerald-600'
                        }`}>
                          {trx.type === 'WITHDRAWAL' || trx.type === 'PAYMENT_OUT' ? '-' : '+'} 
                          {formatRupiah(trx.amount)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                        Belum ada transaksi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Tarik Dana</h3>
            <p className="text-slate-500 text-sm mb-6">
              Dana akan ditransfer ke rekening {wallet?.bankName} ({wallet?.accountNumber}). 
              Proses memakan waktu 1-2 hari kerja.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Jumlah Penarikan (IDR)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                <input 
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none font-bold text-lg"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-slate-500 mt-2 text-right">
                Saldo tersedia: {wallet ? formatRupiah(wallet.balance) : 0}
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsWithdrawModalOpen(false)}
                className="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition"
              >
                Batal
              </button>
              <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}