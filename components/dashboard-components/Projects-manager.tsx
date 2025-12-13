"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projectsService } from "@/services/projects.service";
import { useDebounce } from "@/hooks/useDebounce";

// --- TYPES ---
type Project = {
  id: number;
  title: string;
  icon: string;
  color?: string;
  description: string;
  tags: string[];
  git_url?: string;
  live_demo_url?: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Search với debounce
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    icon: "bxs-folder",
    color: "text-blue-400",
    tags: [],
    git_url: "",
    live_demo_url: "",
  });
  const [tagInput, setTagInput] = useState("");

  // --- FETCH PROJECTS ---
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await projectsService.getProjects({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchQuery || undefined,
      });

      // ==== DEBUG LOG 1: Xem toàn bộ response từ API ====
      console.log("=== RAW RESPONSE FROM API (projects) ===");
      console.log(response.data);

      const { data, pagination: pag } = response.data;
      setProjects(data);

      // FIX: Đảm bảo totalPages luôn đúng dù backend có trả về hay không
      const total = pag.total ?? 0;
      const limit = pag.limit ?? pagination.limit;
      const calculatedTotalPages = pag.totalPages ?? Math.ceil(total / limit);

      setPagination({
        page: pag.page ?? pagination.page,
        limit,
        total,
        totalPages: calculatedTotalPages,
      });

      // ==== DEBUG LOG 2: Xem trạng thái pagination sau khi set ====
      console.log("=== PAGINATION STATE SAU KHI SET ===");
      console.log({
        page: pag.page ?? pagination.page,
        limit,
        total,
        totalPages: calculatedTotalPages,
      });
    } catch (err) {
      console.error("Failed to fetch projects", err);
      alert("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchQuery]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Reset page khi search thay đổi
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery]);

  // --- HANDLERS ---
  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: "",
        description: "",
        icon: "bxs-folder",
        color: "text-blue-400",
        tags: [],
        git_url: "",
        live_demo_url: "",
      });
    }
    setTagInput("");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.description?.trim()) {
      alert("Title and description are required.");
      return;
    }

    setSaving(true);
    try {
      if (editingProject) {
        await projectsService.updateProject(editingProject.id, formData);
      } else {
        await projectsService.createProject(formData);
      }
      setIsModalOpen(false);
      await fetchProjects();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save project. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(id);
    try {
      await projectsService.deleteProject(id);
      await fetchProjects();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!formData.tags?.includes(newTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...(prev.tags || []), newTag],
        }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tagToRemove),
    }));
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Project Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your GitHub repositories & portfolio items.</p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-95"
        >
          <i className="bx bx-plus text-lg"></i>
          New Project
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          {searchQuery !== debouncedSearchQuery && (
            <i className="bx bx-loader-alt animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] shadow-inner">
        <div className="overflow-y-auto h-full custom-scrollbar">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <i className="bx bx-loader-alt animate-spin text-4xl block mb-4"></i>
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <i className="bx bx-folder-open text-4xl mb-2 block opacity-50"></i>
              No projects found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#252525] sticky top-0 z-10">
                <tr>
                  <th className="p-4 w-16 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10 text-center">Icon</th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10">Repository</th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10">Tech Stack</th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10">Links</th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {projects.map((project) => (
                  <tr key={project.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center">
                      <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] border border-white/5 flex items-center justify-center mx-auto">
                        <i className={`bx ${project.icon} text-2xl ${project.color || "text-gray-400"}`}></i>
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-white text-sm mb-1 truncate">{project.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{project.description}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                        {project.tags?.slice(0, 3).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-[#2a2a2a] text-gray-400 border border-white/5 font-mono">
                            {tag}
                          </span>
                        ))}
                        {project.tags && project.tags.length > 3 && (
                          <span className="px-2 py-0.5 rounded text-[10px] text-gray-600 bg-[#1a1a1a] border border-white/5">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {project.git_url && project.git_url !== "#" && (
                          <a href={project.git_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors" title="Source Code">
                            <i className="bx bxl-github text-lg"></i>
                          </a>
                        )}
                        {project.live_demo_url && project.live_demo_url !== "#" && (
                          <a href={project.live_demo_url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors" title="Live Demo">
                            <i className="bx bx-link-external text-lg"></i>
                          </a>
                        )}
                        {!project.git_url && !project.live_demo_url && <span className="text-gray-700 text-xs">-</span>}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(project)}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <i className="bx bxs-edit-alt"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          disabled={deletingId === project.id}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          {deletingId === project.id ? <i className="bx bx-loader-alt animate-spin"></i> : <i className="bx bx-trash"></i>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {!loading && pagination.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-white/10 bg-[#252525] flex items-center justify-between text-sm text-gray-400">
            <span>Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)</span>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 rounded bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 rounded bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4"
            >
              <div className="w-full max-w-2xl bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl pointer-events-auto flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#252525] rounded-t-xl">
                  <h3 className="text-lg font-bold text-white">
                    {editingProject ? "Edit Project" : "New Project"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                    <i className="bx bx-x text-2xl"></i>
                  </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <form id="project-form" onSubmit={handleSave} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Title</label>
                        <input
                          required
                          value={formData.title || ""}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. spotify-clone"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase flex items-center gap-2">
                          Icon Class & Color
                          <i className={`bx ${formData.icon} text-xl ${formData.color}`}></i>
                        </label>
                        <div className="flex gap-2">
                          <input
                            value={formData.icon || ""}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="bxl-spotify"
                          />
                          <input
                            value={formData.color || ""}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-36 bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="text-green-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        placeholder="Project description..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">GitHub URL</label>
                        <input
                          value={formData.git_url || ""}
                          onChange={(e) => setFormData({ ...formData, git_url: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="https://github.com/username/repo"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Live Demo URL</label>
                        <input
                          value={formData.live_demo_url || ""}
                          onChange={(e) => setFormData({ ...formData, live_demo_url: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="https://yourproject.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Tags (Press Enter)</label>
                      <div className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 flex flex-wrap gap-2 min-h-[44px] items-center">
                        {formData.tags?.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-white">
                              <i className="bx bx-x text-sm"></i>
                            </button>
                          </span>
                        ))}
                        <input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={addTag}
                          className="bg-transparent text-sm text-white focus:outline-none flex-1 min-w-[120px]"
                          placeholder={formData.tags?.length === 0 ? "Type tag and press Enter..." : ""}
                        />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="p-4 border-t border-white/10 flex justify-end gap-3 bg-[#252525] rounded-b-xl">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-transparent hover:bg-white/5 border border-white/10 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="project-form"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <i className="bx bx-loader-alt animate-spin"></i> Saving...
                      </>
                    ) : editingProject ? (
                      "Save Changes"
                    ) : (
                      "Create Project"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}