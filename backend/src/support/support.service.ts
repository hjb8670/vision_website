import { Injectable } from '@nestjs/common';
import { SupportTicketPriority } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  async createTicket(userId: string, dto: CreateTicketDto) {
    const priority = (dto.priority ?? 'normal').toUpperCase() as SupportTicketPriority;

    return this.prisma.supportTicket.create({
      data: {
        userId,
        subject: dto.subject,
        message: dto.message,
        priority,
      },
    });
  }
}
