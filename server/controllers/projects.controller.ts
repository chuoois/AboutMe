import { getDataSource } from "@/server/db/connection";
import { Projects } from "@/server/entities/projects.entity";

export const ProjectsController = {
  // ================================
  // GET LIST + SEARCH + FILTER + PAGINATION
  // ================================
  async getProjects(
    page: number,
    limit: number,
    search?: string,
    tag?: string
  ) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Projects);
    const qb = repo.createQueryBuilder("project");

    // Search by title or description
    if (search) {
      qb.andWhere(
        "(project.title LIKE :s OR project.description LIKE :s)",
        { s: `%${search}%` }
      );
    }

    // Filter by tag (check if tag exists in JSON array)
    if (tag) {
      qb.andWhere(":tag = ANY(project.tags)", { tag });
    }

    // Pagination + order by created_at DESC
    qb.orderBy("project.created_at", "DESC")
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
  // GET ONE PROJECT
  // ================================
  async getProject(id: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Projects);
    const project = await repo.findOne({ where: { id } });

    if (!project) throw new Error("Project not found");

    return project;
  },

  // ================================
  // CREATE NEW PROJECT
  // ================================
  async createProject(payload: Partial<Projects>) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Projects);
    const newProject = repo.create(payload);
    return await repo.save(newProject);
  },

  // ================================
  // UPDATE PROJECT
  // ================================
  async updateProject(id: number, payload: Partial<Projects>) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Projects);
    const project = await repo.findOne({ where: { id } });

    if (!project) throw new Error("Project not found");

    Object.assign(project, payload);
    return await repo.save(project);
  },

  // ================================
  // DELETE PROJECT
  // ================================
  async deleteProject(id: number) {
    const ds = await getDataSource();
    const repo = ds.getRepository(Projects);
    const project = await repo.findOne({ where: { id } });

    if (!project) throw new Error("Project not found");

    await repo.remove(project);
    return { message: "Deleted successfully" };
  },
};