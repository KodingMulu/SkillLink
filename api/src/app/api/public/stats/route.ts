import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [totalJobs, totalFreelancers, totalClients, completedProjects, categoriesRaw, avgRating] = await Promise.all([
      prisma.job.count(),
      prisma.user.count({ where: { role: 'FREELANCER' } }),
      prisma.user.count({ where: { role: 'CLIENT' } }),
      prisma.project.count({ where: { status: 'COMPLETED' } }),
      prisma.job.groupBy({
        by: ['category'],
        _count: {
          id: true
        }
      }),
      prisma.project.aggregate({
        _avg: { rating: true },
        where: { rating: { not: null } }
      })
    ]);

    const categoryMap: Record<string, number> = {};
    categoriesRaw.forEach(c => {
      if (c.category) {
        categoryMap[c.category] = c._count.id;
      }
    });

    return NextResponse.json({
      code: 200,
      data: {
        totalJobs,
        totalFreelancers,
        totalClients,
        completedProjects,
        rating: avgRating._avg.rating ? Number(avgRating._avg.rating.toFixed(1)) : 4.9,
        categories: categoryMap
      }
    });
  } catch (error) {
    return NextResponse.json({
      code: 200,
      data: {
        totalJobs: 0,
        totalFreelancers: 0,
        totalClients: 0,
        completedProjects: 0,
        rating: 5.0,
        categories: {}
      }
    });
  }
}
