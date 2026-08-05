import { Injectable } from '@nestjs/common';
import { ReportContentType, ReportReason } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(reporterId: string, dto: CreateReportDto) {
    const contentType = (dto.content_type ?? 'post').toUpperCase() as ReportContentType;
    const reason = dto.reason.toUpperCase() as ReportReason;

    return this.prisma.report.create({
      data: {
        reporterId,
        contentId: dto.content_id,
        contentType,
        reason,
      },
    });
  }
}
