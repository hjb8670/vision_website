import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

const ACCENT_MAP: Record<string, string> = {
  á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', ü: 'u', ñ: 'n',
};

function stripAccents(value: string): string {
  return value.replace(/[áéíóúüñ]/g, (ch) => ACCENT_MAP[ch] ?? ch);
}

function slugify(name: string): string {
  return stripAccents(name.toLowerCase())
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const CATEGORY_ORDER = [
  'deportes',
  'politica',
  'elecciones',
  'cultura',
  'entretenimiento',
  'cripto',
  'clima',
  'economia',
  'finanzas',
  'tecnologia',
  'ciencia',
];

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany({ orderBy: { name: 'asc' } });
    return categories.sort((a, b) => {
      const ai = CATEGORY_ORDER.indexOf(a.slug);
      const bi = CATEGORY_ORDER.indexOf(b.slug);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }

  async findByIdOrThrow(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: { name: dto.name, slug: slugify(dto.name) },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new BadRequestException('A category with that name already exists');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findByIdOrThrow(id);
    try {
      return await this.prisma.category.update({
        where: { id },
        data: {
          ...(dto.name ? { name: dto.name, slug: slugify(dto.name) } : {}),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new BadRequestException('A category with that name already exists');
      }
      throw err;
    }
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { markets: true } } },
    });
    if (!category) throw new NotFoundException('Category not found');
    if (category._count.markets > 0) {
      throw new BadRequestException(
        'Cannot delete a category with existing markets — reassign or delete its markets first',
      );
    }
    await this.prisma.category.delete({ where: { id } });
  }
}
