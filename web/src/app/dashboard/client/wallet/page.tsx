'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from "../../DashboardLayout";
import { getApiUrl } from '@/lib/api';
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
    transaction_status: string;
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
    const presetAmounts = [50000, 100000, 250000, 500000, 1000000];

    const fetchWallet = async () => {
        try {
            const API_URL = getApiUrl();
            const response = await axios.get(`${API_URL}/user/client/wallet`, { withCredentials: true });
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
            const API_URL = getApiUrl();
            const response = await axios.post(
                `${API_URL}/user/client/wallet`,
                { amount: Number(amount) },
                { withCredentials: true }
            );

            const { token } = response.data.data;

            if (window.snap) {
                window.snap.pay(token, {
                    onSuccess: function (result: SnapResult) {
                        alert("Pembayaran Berhasil!");
                        setAmount('');
                        setTimeout(() => fetchWallet(), 2000);
                    },
                    onPending: function (result: SnapResult) {
                        alert("Menunggu pembayaran...");
                        setAmount('');
                        setTimeout(() => fetchWallet(), 2000);
                    },
                    onError: function (result: SnapResult) {
                        alert("Pembayaran gagal!");
                    },
                    onClose: function () {
                        console.log('Snap popup closed');
                    }
                });
            } else {
                alert("Sistem pembayaran Midtrans belum dimuat sepenuhnya. Mohon refresh halaman.");
            }

        } catch (error) {
            console.error("Top up error:", error);
            if (axios.isAxiosError(error)) {
                alert(error.response?.data?.message || "Gagal memproses pembayaran.");
            } else {
                alert("Gagal memproses pembayaran.");
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-100 text-emerald-700';
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'FAILED': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <DashboardLayout role="client">
            <Script
                src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || "https://app.sandbox.midtrans.com/snap/snap.js"}
                data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
            />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Saldo & Dompet Klien</h1>
                <p className="text-slate-500 text-sm">Kelola deposit saldo untuk pembayaran proyek via Midtrans Gateway</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Dark Navy Balance Card */}
                    <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white border border-slate-800 shadow-md relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-slate-800"><Wallet size={100} /></div>
                        <div className="relative z-10">
                            <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Saldo Aktif</p>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                                {isLoading ? "..." : formatRupiah(wallet?.balance || 0)}
                            </h2>
                            <p className="text-slate-400 text-xs">Saldo dapat digunakan untuk langsung mendanai proyek dan escrow.</p>
                        </div>
                    </div>

                    {/* Top Up Form */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Plus size={20} /></div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Isi Saldo (Top Up)</h3>
                                <p className="text-xs text-slate-500">Pilih nominal atau masukkan jumlah top up Anda</p>
                            </div>
                        </div>

                        <form onSubmit={handleTopUp}>
                            <div className="mb-5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Nominal Top Up</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                                    <input 
                                        type="number" 
                                        value={amount} 
                                        onChange={(e) => setAmount(e.target.value)} 
                                        placeholder="0" 
                                        className="w-full pl-12 pr-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-bold text-base text-slate-900" 
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-2">Pilihan Cepat Nominal</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {presetAmounts.map((val) => (
                                        <button 
                                            key={val} 
                                            type="button" 
                                            onClick={() => setAmount(val.toString())} 
                                            className={`py-2 px-3 rounded-lg border text-xs font-bold transition ${
                                                amount === val.toString() 
                                                    ? 'bg-blue-600 text-white border-blue-600' 
                                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            {formatRupiah(val)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isProcessing || isLoading} 
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-50 flex justify-center items-center gap-2 text-sm"
                            >
                                {isProcessing ? 'Memproses Token Midtrans...' : <><CreditCard size={16} /> Bayar Sekarang</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Transaction History */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col">
                        <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
                            <History size={18} className="text-slate-400" /> Riwayat Transaksi
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {!wallet?.transactions || wallet.transactions.length === 0 ? (
                                <p className="text-xs text-slate-400 italic text-center py-8">Belum ada riwayat transaksi</p>
                            ) : (
                                wallet.transactions.map((trx) => (
                                    <div key={trx.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${trx.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {trx.type === 'DEPOSIT' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{trx.type === 'DEPOSIT' ? 'Top Up Saldo' : 'Pembayaran'}</p>
                                                <p className="text-[10px] text-slate-400">{formatDate(trx.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-xs ${trx.type === 'DEPOSIT' ? 'text-emerald-700' : 'text-slate-900'}`}>
                                                {trx.type === 'DEPOSIT' ? '+' : '-'}{formatRupiah(trx.amount)}
                                            </p>
                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getStatusColor(trx.status)}`}>{trx.status}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}