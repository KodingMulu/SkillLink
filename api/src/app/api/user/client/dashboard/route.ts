import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/server-auth";

// --- DEFINISI TIPE RESPONSE API (Agar Frontend tidak pakai ANY) ---
export interface ApplicantData {
  id: string;
  name: string;
  role: string;
  appliedFor: string;
  date: string;
  match: number;
}

export interface ActiveContractData {
  id: string;
  freelancerName: string;
  projectName: string;
  progress: number;
  deadline: string;
  amount: number;
  status: string;
}

export interface ActivityData {
  id: string;
  text: string;
  time: string;
  type: 'payment' | 'work' | 'system';
}

export interface ClientDashboardData {
  stats: {
    totalSpent: number;
    activeJobs: number;
    newApplicants: number;
    completedContracts: number;
  };
  recentApplicants: ApplicantData[];
  activeContracts: ActiveContractData[];
  activities: ActivityData[];
}

export async function GET(req: NextRequest) {
  try {
    // 1. Auth Check
    const user = await getAuthUser(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // 2. Query Database Secara Paralel (Promise.all biar cepat)
    const [
      totalSpentAggregate,
      activeJobsCount,
      newApplicantsCount,
      completedContractsCount,
      recentProposals,
      activeProjects,
      recentTransactions
    ] = await prisma.$transaction([
      // A. Hitung Total Pengeluaran (Transaction OUT)
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: {
          wallet: { userId: user.id },
          type: { in: ['PAYMENT_OUT', 'WITHDRAWAL'] }, // Sesuaikan Enum Anda
          status: 'COMPLETED'
        }
      }),
      
      // B. Hitung Job Aktif
      prisma.job.count({
        where: { clientId: user.id, status: 'OPEN' }
      }),

      // C. Hitung Pelamar Baru (Pending)
      prisma.proposal.count({
        where: { job: { clientId: user.id }, status: 'PENDING' }
      }),

      // D. Hitung Kontrak Selesai
      prisma.project.count({
        where: { clientId: user.id, status: 'COMPLETED' }
      }),

      // E. Ambil 5 Pelamar Terbaru
      prisma.proposal.findMany({
        where: { job: { clientId: user.id }, status: 'PENDING' },
        include: { 
            freelancer: true, // Join ke tabel User freelancer
            job: true 
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      }),

      // F. Ambil Kontrak Berjalan
      prisma.project.findMany({
        where: { clientId: user.id, status: 'IN_PROGRESS' },
        include: { freelancer: true },
        orderBy: { updatedAt: 'desc' },
        take: 2
      }),

      // G. Mock Aktivitas dari Transaksi Terakhir
      prisma.transaction.findMany({
        where: { wallet: { userId: user.id } },
        orderBy: { createdAt: 'desc' },
        take: 3
      })
    ]);

    // 3. Data Transformation (DB -> API Interface)
    const responseData: ClientDashboardData = {
      stats: {
        totalSpent: totalSpentAggregate._sum.amount || 0,
        activeJobs: activeJobsCount,
        newApplicants: newApplicantsCount,
        completedContracts: completedContractsCount,
      },
      recentApplicants: recentProposals.map(p => ({
        id: p.id,
        name: p.freelancer.username || "Freelancer",
        role: p.freelancer.title || "Specialist",
        appliedFor: p.job.title,
        date: new Date(p.createdAt).toLocaleDateString('id-ID'),
        match: Math.floor(Math.random() * (99 - 70) + 70) // Mock Match Score (Logic real butuh AI)
      })),
      activeContracts: activeProjects.map(p => ({
        id: p.id,
        freelancerName: p.freelancer.username || "Freelancer",
        projectName: p.title,
        progress: 50, // Bisa diambil dari kolom p.progress jika ada
        deadline: p.endDate ? new Date(p.endDate).toLocaleDateString('id-ID') : "-",
        amount: p.budget,
        status: p.status
      })),
      activities: recentTransactions.map(t => ({
        id: t.id,
        text: t.type === 'DEPOSIT' ? 'Top Up Saldo Berhasil' : 'Pembayaran ke Freelancer',
        time: new Date(t.createdAt).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}),
        type: 'payment'
      }))
    };

    return NextResponse.json({
      code: 200,
      message: "Success",
      data: responseData
    });

  } catch (error) {
    console.error("Dashboard Client API Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}