import { getDataSource } from "@/server/db/connection";
import { Skill } from "@/server/entities/skills.entity";

export const SkillsController = {
  // ================================
  // GET LIST + SEARCH + FILTER + PAGINATION
  // ================================
  async getSkills(
    page: number,
    limit: number,
    search?: string,
    category?: string
  ) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Skill);
    const qb = repo.createQueryBuilder("skill");

    // Search by skill_name or category
    if (search) {
      qb.andWhere(
        "(skill.skill_name LIKE :s OR skill.category LIKE :s)",
        { s: `%${search}%` }
      );
    }

    // Filter by category
    if (category) {
      qb.andWhere("skill.category = :category", { category });
    }

    // Pagination + order by created_at DESC
    qb.orderBy("skill.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data,
    };
  },

  // ================================
  // GET ONE SKILL
  // ================================
  async getSkill(id: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Skill);
    const skill = await repo.findOne({ where: { id } });

    if (!skill) throw new Error("Skill not found");

    return skill;
  },

  // ================================
  // CREATE NEW SKILL
  // ================================
  async createSkill(payload: Partial<Skill>) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Skill);
    const newSkill = repo.create(payload);
    return await repo.save(newSkill);
  },

  // ================================
  // UPDATE SKILL
  // ================================
  async updateSkill(id: number, payload: Partial<Skill>) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Skill);
    const skill = await repo.findOne({ where: { id } });

    if (!skill) throw new Error("Skill not found");

    Object.assign(skill, payload);
    return await repo.save(skill);
  },

  // ================================
  // DELETE SKILL
  // ================================
  async deleteSkill(id: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Skill);
    const skill = await repo.findOne({ where: { id } });

    if (!skill) throw new Error("Skill not found");

    await repo.remove(skill);
    return { message: "Deleted successfully" };
  },
};