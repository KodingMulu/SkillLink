'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../DashboardLayout';
import {
    Wallet, ArrowUpRight, ArrowDownLeft, Building2,
    Download, CreditCard, Loader2, AlertCircle, Sparkles,
    CheckCircle2, ShieldCheck, RefreshCw, X, ArrowRight, History
} from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import { getApiUrl } from '@/lib/api';

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

interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export default function FreelancerWalletPage() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterType, setFilterType] = useState<'ALL' | 'IN' | 'OUT'>('ALL');

    const ADMIN_FEE = 5000;

    const fetchWalletData = async (showRefreshIndicator = false) => {
        if (showRefreshIndicator) setIsRefreshing(true);
        try {
            const apiUrl = getApiUrl();
            const response = await axios.get(`${apiUrl}/user/freelancer/wallet`, {
                withCredentials: true
            });
            if (response.data.code === 200) {
                setWallet(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching wallet:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleWithdraw = async () => {
        if (!withdrawAmount || Number(withdrawAmount) <= 0) {
            return alert("Masukkan nominal penarikan yang valid.");
        }

        setIsSubmitting(true);
        try {
            const apiUrl = getApiUrl();
            const response = await axios.post(
                `${apiUrl}/user/freelancer/wallet`,
                { amount: Number(withdrawAmount) },
                { withCredentials: true }
            );

            if (response.data.code === 200) {
                alert("Penarikan dana berhasil diproses!");

                setWallet(prev => prev ? {
                    ...prev,
                    balance: response.data.data.newBalance
                } : null);
                setIsWithdrawModalOpen(false);
                setWithdrawAmount('');

                await fetchWalletData();
            } else {
                alert(response.data.message || "Penarikan dana gagal");
            }
        } catch (error) {
            const err = error as AxiosErrorResponse;
            const errorMessage = err.response?.data?.message || "Penarikan gagal diproses";
            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatRupiah = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'FAILED':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getTransactionIcon = (type: string) => {
        if (type === 'WITHDRAWAL' || type === 'PAYMENT_OUT') {
            return <ArrowUpRight className="w-5 h-5 text-red-600" />;
        }
        return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />;
    };

    const getTransactionTitle = (type: string) => {
        switch (type) {
            case 'PAYMENT_IN': return 'Pembayaran Diterima';
            case 'WITHDRAWAL': return 'Penarikan Saldo';
            case 'DEPOSIT': return 'Deposit Saldo';
            case 'REFUND': return 'Pengembalian Dana';
            default: return type;
        }
    };

    const totalDeduction = Number(withdrawAmount) + ADMIN_FEE;
    const isBalanceSufficient = wallet ? wallet.balance >= totalDeduction : false;

    const filteredTransactions = wallet?.transactions.filter(t => {
        if (filterType === 'IN') return t.type === 'PAYMENT_IN' || t.type === 'DEPOSIT';
        if (filterType === 'OUT') return t.type === 'WITHDRAWAL' || t.type === 'PAYMENT_OUT';
        return true;
    }) || [];

    return (
        <DashboardLayout role="freelancer">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saldo & Dompet Saya</h1>
                        <p className="text-slate-500 text-sm sm:text-base mt-1">Pantau total saldo aktif, riwayat pendapatan, dan lakukan penarikan dana</p>
                    </div>

                    <button
                        onClick={() => fetchWalletData(true)}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
                        <span>Refresh Data</span>
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-3" />
                    <span className="text-sm font-bold text-slate-500">Memuat Informasi Dompet...</span>
                </div>
            ) : wallet ? (
                <div className="space-y-8">
                    {/* Top Section: Digital Card + Bank Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Digital Wallet Card */}
                        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white shadow-lg flex flex-col justify-between min-h-[240px]">
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2.5 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
                                        <Wallet className="w-4 h-4 text-emerald-400" />
                                        <span className="text-xs font-bold text-blue-100 uppercase tracking-wider">Saldo Aktif</span>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-white/50 tracking-widest">SKILLLINK WALLET</span>
                                </div>

                                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-6">
                                    {formatRupiah(wallet.balance)}
                                </div>
                            </div>

                            <div className="relative z-10 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4 text-xs font-semibold text-blue-100">
                                    <span>Biaya Admin Penarikan: <strong className="text-white">Rp 5.000</strong></span>
                                    <span>•</span>
                                    <span>Pencairan: <strong className="text-emerald-300">Instant</strong></span>
                                </div>

                                <button
                                    onClick={() => setIsWithdrawModalOpen(true)}
                                    className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-800 px-6 py-3 rounded-2xl font-black text-sm shadow-lg shadow-black/10 transition active:scale-95"
                                >
                                    <Download className="w-4 h-4 text-blue-700" />
                                    <span>Tarik Dana</span>
                                </button>
                            </div>
                        </div>

                        {/* Bank Account Info Card */}
                        <div className="bg-white rounded-[2.5rem] border border-slate-200/90 p-8 shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-blue-600" />
                                        <span>Rekening Penerima</span>
                                    </h3>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                                        <ShieldCheck size={12} className="text-emerald-600" />
                                        Terverifikasi
                                    </span>
                                </div>

                                {wallet.bankName && wallet.accountNumber !== '-' ? (
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bank Terdaftar</p>
                                        <p className="font-black text-slate-900 text-xl">{wallet.bankName}</p>
                                        <p className="text-slate-700 font-mono font-bold text-base tracking-wider">{wallet.accountNumber}</p>
                                        <p className="text-xs font-bold text-slate-500 uppercase pt-1 border-t border-slate-200/60">{wallet.accountHolder}</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-4">
                                        <Building2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                                        <p className="text-slate-600 font-bold text-sm mb-1">Belum Ada Rekening Bank</p>
                                        <p className="text-slate-400 text-xs mb-3">Atur rekening bank Anda di menu Pengaturan untuk menerima penarikan dana.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400">Ingin mengubah rekening?</span>
                                <Link
                                    href="/dashboard/freelancer/settings"
                                    className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                                >
                                    <span>Pengaturan</span>
                                    <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History Section */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-black text-xl text-slate-900 tracking-tight flex items-center gap-2">
                                    <History className="w-5 h-5 text-blue-600" />
                                    <span>Riwayat Transaksi</span>
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Daftar mutasi masuk dan keluar dari dompet Anda</p>
                            </div>

                            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/60 w-fit">
                                <button
                                    onClick={() => setFilterType('ALL')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${filterType === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Semua
                                </button>
                                <button
                                    onClick={() => setFilterType('IN')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${filterType === 'IN' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Masuk
                                </button>
                                <button
                                    onClick={() => setFilterType('OUT')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${filterType === 'OUT' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                                >
                                    Keluar
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/70 border-b border-slate-100">
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Jenis Transaksi</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Tanggal & Waktu</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Jumlah (IDR)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredTransactions.length > 0 ? (
                                        filteredTransactions.map((trx) => (
                                            <tr key={trx.id} className="hover:bg-slate-50/60 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2.5 rounded-xl border ${trx.type === 'WITHDRAWAL' || trx.type === 'PAYMENT_OUT' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                                            {getTransactionIcon(trx.type)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-900 text-sm">
                                                                {getTransactionTitle(trx.type)}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-0.5 font-medium">{trx.description || 'Transaksi Sistem'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                                                    {new Date(trx.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(trx.status)}`}>
                                                        {trx.status}
                                                    </span>
                                                </td>
                                                <td className={`px-6 py-4 text-right font-black text-base ${trx.type === 'WITHDRAWAL' || trx.type === 'PAYMENT_OUT' ? 'text-slate-900' : 'text-emerald-600'}`}>
                                                    {trx.type === 'WITHDRAWAL' || trx.type === 'PAYMENT_OUT' ? '-' : '+'}
                                                    {formatRupiah(trx.amount)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                                Belum ada mutasi transaksi pada filter ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Modal Tarik Dana (Withdrawal) */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-6 sm:p-8 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Tarik Dana ke Bank</h3>
                                <p className="text-xs text-slate-500 mt-0.5">Transfer saldo ke rekening bank terdaftar Anda</p>
                            </div>
                            <button
                                onClick={() => setIsWithdrawModalOpen(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Balance Info Box */}
                        <div className="mb-6 p-5 bg-blue-50/70 rounded-2xl border border-blue-100 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-semibold">Saldo Tersedia</span>
                                <span className="font-black text-slate-900 text-sm">{wallet ? formatRupiah(wallet.balance) : 0}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-semibold">Biaya Layanan Admin</span>
                                <span className="font-bold text-red-600">-{formatRupiah(ADMIN_FEE)}</span>
                            </div>
                        </div>

                        {/* Withdraw Amount Input */}
                        <div className="mb-6 space-y-3">
                            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">Jumlah Penarikan (IDR)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">Rp</span>
                                <input
                                    type="number"
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none font-bold text-lg text-slate-900 transition"
                                    placeholder="0"
                                />
                            </div>

                            {/* Preset Buttons */}
                            {wallet && wallet.balance > ADMIN_FEE && (
                                <div className="flex gap-2 pt-1">
                                    {[100000, 500000, 1000000].map((preset) => (
                                        preset <= wallet.balance - ADMIN_FEE && (
                                            <button
                                                key={preset}
                                                type="button"
                                                onClick={() => setWithdrawAmount(preset.toString())}
                                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-bold text-slate-700 transition"
                                            >
                                                +{preset / 1000}rb
                                            </button>
                                        )
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => setWithdrawAmount(Math.max(0, wallet.balance - ADMIN_FEE).toString())}
                                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-xl text-xs font-bold text-blue-600 border border-blue-100 transition ml-auto"
                                    >
                                        Maksimal
                                    </button>
                                </div>
                            )}

                            {/* Calculation Preview */}
                            {withdrawAmount && Number(withdrawAmount) > 0 && (
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1.5 mt-3">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Nominal Penarikan:</span>
                                        <span className="font-semibold text-slate-700">{formatRupiah(Number(withdrawAmount))}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Biaya Admin:</span>
                                        <span className="font-semibold text-red-600">+{formatRupiah(ADMIN_FEE)}</span>
                                    </div>
                                    <div className="flex justify-between font-black text-slate-900 pt-2 border-t border-slate-200">
                                        <span>Total Saldo Dipotong:</span>
                                        <span className={isBalanceSufficient ? 'text-blue-700' : 'text-red-600'}>
                                            {formatRupiah(totalDeduction)}
                                        </span>
                                    </div>
                                    {!isBalanceSufficient && (
                                        <p className="text-red-600 text-[11px] font-bold flex items-center gap-1 pt-1">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Saldo tidak mencukupi (Total + Biaya Admin Rp 5.000)
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setIsWithdrawModalOpen(false)}
                                className="flex-1 py-3.5 font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition text-sm disabled:opacity-50"
                                disabled={isSubmitting}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleWithdraw}
                                disabled={isSubmitting || !withdrawAmount || !isBalanceSufficient}
                                className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm active:scale-95"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <span>Konfirmasi Penarikan</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}