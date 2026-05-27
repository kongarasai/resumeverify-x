// ResumeVerify X™ — Placement Cell Service
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PlacementCellService {
  constructor(private prisma: PrismaService) {}

  async getEligibleStudents(companyId: string, criteria: {
    minCgpa: number; minTrustScore: number; minLeetcodeRating: number; departments: string[];
  }) {
    const students = await this.prisma.candidates.findMany({
      where: {
        cgpa: { gte: criteria.minCgpa },
        department_id: criteria.departments.length ? { in: criteria.departments } : undefined,
      },
      include: {
        users: true, trust_scores: { orderBy: { calculated_at: 'desc' }, take: 1 },
        departments: true,
      }
    });

    return students.filter(s => {
      const trust = s.trust_scores[0]?.total_score || 0;
      return trust >= criteria.minTrustScore;
    }).map(s => ({
      id: s.id, name: `${s.users.first_name} ${s.users.last_name}`,
      cgpa: s.cgpa, trustScore: s.trust_scores[0]?.total_score,
      department: s.departments?.name, graduationYear: s.graduation_year,
    }));
  }

  async getPlacementAnalytics(universityId: string) {
    const [total, placed, inProcess] = await Promise.all([
      this.prisma.candidates.count({ where: { university_id: universityId } }),
      this.prisma.job_applications.count({ where: { status: 'hired', candidates: { university_id: universityId } } }),
      this.prisma.job_applications.count({ where: { status: { in: ['screening','assessment','technical','hr_round','final_round'] }, candidates: { university_id: universityId } } }),
    ]);

    return { total, placed, inProcess, placementRate: total > 0 ? (placed / total * 100).toFixed(1) : 0 };
  }

  async getDepartmentStats(universityId: string) {
    const departments = await this.prisma.departments.findMany({ where: { university_id: universityId } });
    const stats = [];
    for (const dept of departments) {
      const deptTotal = await this.prisma.candidates.count({ where: { department_id: dept.id } });
      const deptPlaced = await this.prisma.job_applications.count({ where: { status: 'hired', candidates: { department_id: dept.id } } });
      stats.push({ department: dept.name, total: deptTotal, placed: deptPlaced, rate: deptTotal > 0 ? (deptPlaced / deptTotal * 100).toFixed(1) : 0 });
    }
    return stats;
  }

  async scheduleDrive(data: { companyId: string; universityId: string; date: Date; mode: string; eligibleStudents: string[] }) {
    // Create drive event, notify eligible students
    await this.prisma.notifications.createMany({
      data: data.eligibleStudents.map(studentId => ({
        user_id: studentId,
        title: 'Placement Drive Scheduled',
        body: `A campus drive has been scheduled for ${data.date.toDateString()}. Check eligibility and register now.`,
        type: 'placement_drive',
        metadata: { companyId: data.companyId, date: data.date } as any,
      }))
    });
    return { success: true, notified: data.eligibleStudents.length };
  }
}
