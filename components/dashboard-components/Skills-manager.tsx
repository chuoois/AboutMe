"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skillsService } from "@/services/skills.service";
import { useDebounce } from "@/hooks/useDebounce";

// --- TYPE DEFINITIONS ---
type Skill = {
  id: number;
  category: string;
  skill_name: string;
  icon: string | null;
  color: string | null;
  created_at: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });

  // Search + Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Skill>>({
    category: "",
    skill_name: "",
    icon: "bxs-cube",
    color: "text-white",
  });

  // Derived: Danh sách category duy nhất (an toàn)
  const uniqueCategories = useMemo(() => {
    if (!Array.isArray(skills) || skills.length === 0) return [];
    const cats = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));
    return cats.sort();
  }, [skills]);

  // --- FETCH SKILLS (AN TOÀN + DEBUG) ---
  const fetchSkills = useCallback(async () => {
    setLoading(true);
    try {
      const response = await skillsService.getSkills({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchQuery || undefined,
        category: selectedCategory || undefined,
      });

      console.log("=== RAW RESPONSE FROM API (skills) ===");
      console.log(response.data);

      const res = response.data || {};

      // Data luôn là mảng
      const data: Skill[] = Array.isArray(res.data) ? res.data : [];

      // Pagination an toàn
      let page = pagination.page;
      let limit = pagination.limit;
      let total = 0;
      let totalPages = 1;

      if (res.pagination && typeof res.pagination === "object") {
        const pag = res.pagination;
        page = Number(pag.page) || page;
        limit = Number(pag.limit) || limit;
        total = Number(pag.total) || 0;
        totalPages = Number(pag.totalPages) || (total > 0 ? Math.ceil(total / limit) : 1);
      } else {
        page = Number(res.page) || page;
        limit = Number(res.limit) || limit;
        total = Number(res.total) || 0;
        totalPages = Number(res.totalPages) || (total > 0 ? Math.ceil(total / limit) : 1);
      }

      setSkills(data);
      setPagination({ page, limit, total, totalPages });

      console.log("=== PAGINATION STATE SAU KHI XỬ LÝ ===");
      console.log({ page, limit, total, totalPages, dataLength: data.length });
    } catch (err) {
      console.error("Failed to fetch skills", err);
      setSkills([]);
      setPagination({ page: 1, limit: pagination.limit, total: 0, totalPages: 1 });
      alert("Failed to load skills. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchQuery, selectedCategory]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // Reset page khi search/filter thay đổi
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery, selectedCategory]);

  // --- HANDLERS ---
  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setFormData({
        category: skill.category,
        skill_name: skill.skill_name,
        icon: skill.icon || "bxs-cube",
        color: skill.color || "text-white",
      });
    } else {
      setEditingSkill(null);
      setFormData({
        category: uniqueCategories[0] || "",
        skill_name: "",
        icon: "bxs-cube",
        color: "text-white",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.skill_name || !formData.category) {
      alert("Skill name and category are required.");
      return;
    }

    setSaving(true);
    try {
      if (editingSkill) {
        await skillsService.updateSkill(editingSkill.id, formData);
      } else {
        await skillsService.createSkill(formData);
      }
      setIsModalOpen(false);
      await fetchSkills();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save skill. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    setDeletingId(id);
    try {
      await skillsService.deleteSkill(id);
      await fetchSkills();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete skill.");
    } finally {
      setDeletingId(null);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page }));
    }
  };

  // Kiểm tra có cần hiển thị pagination không
  const showPagination = !loading && pagination.total > pagination.limit;

  return (
    <div className="flex flex-col h-full relative">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Skills Manager</h2>
          <p className="text-sm text-gray-500 mt-1">Manage technical skills & technologies.</p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-95"
        >
          <i className="bx bx-plus text-lg"></i>
          New Skill
        </button>
      </div>

      {/* --- SEARCH + CATEGORY FILTER --- */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <i className="bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"></i>
          <input
            type="text"
            placeholder="Search skills or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          {searchQuery !== debouncedSearchQuery && (
            <i className="bx bx-loader-alt animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"></i>
          )}
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* --- TABLE CONTENT (FIX ĐỂ PAGINATION HIỂN THỊ ĐÚNG) --- */}
      <div className="flex-1 flex flex-col rounded-xl border border-white/10 bg-[#1e1e1e] shadow-inner">
        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <i className="bx bx-loader-alt animate-spin text-4xl block mb-4"></i>
              Loading skills...
            </div>
          ) : skills.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <i className="bx bx-cube text-4xl mb-2 block opacity-50"></i>
              No skills found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#252525] sticky top-0 z-10">
                <tr>
                  <th className="p-4 w-16 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10 text-center">
                    Icon
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10">
                    Skill Name
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10">
                    Category
                  </th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {skills.map((skill) => (
                  <tr key={skill.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center">
                      <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] border border-white/5 flex items-center justify-center mx-auto">
                        <i className={`bx ${skill.icon || "bxs-cube"} text-2xl ${skill.color || "text-white"}`}></i>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{skill.skill_name}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-white/5
                          ${skill.category === "Frontend" ? "bg-blue-500/10 text-blue-400" :
                            skill.category === "Backend" ? "bg-green-500/10 text-green-400" :
                            skill.category === "Database" ? "bg-purple-500/10 text-purple-400" :
                            "bg-orange-500/10 text-orange-400"
                          }`}
                      >
                        {skill.category}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(skill)}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <i className="bx bxs-edit-alt"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          disabled={deletingId === skill.id}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          {deletingId === skill.id ? (
                            <i className="bx bx-loader-alt animate-spin"></i>
                          ) : (
                            <i className="bx bx-trash"></i>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- PAGINATION (LUÔN Ở DƯỚI CÙNG) --- */}
        {showPagination && (
          <div className="shrink-0 px-4 py-3 border-t border-white/10 bg-[#252525] flex items-center justify-between text-sm text-gray-400">
            <span>
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </span>
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

      {/* --- MODAL --- */}
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
              <div className="w-full max-w-lg bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl pointer-events-auto flex flex-col">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#252525] rounded-t-xl">
                  <h3 className="text-lg font-bold text-white">
                    {editingSkill ? "Edit Skill" : "New Skill"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                    <i className="bx bx-x text-2xl"></i>
                  </button>
                </div>

                <div className="p-6">
                  <form id="skill-form" onSubmit={handleSave} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Skill Name</label>
                      <input
                        required
                        value={formData.skill_name || ""}
                        onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="e.g. React.js"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Category</label>
                      <input
                        list="categories"
                        required
                        value={formData.category || ""}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="Type or select..."
                      />
                      <datalist id="categories">
                        {uniqueCategories.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Icon Class</label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded bg-[#252525] border border-white/10 flex items-center justify-center shrink-0">
                            <i className={`bx ${formData.icon || "bxs-cube"} text-xl ${formData.color || "text-white"}`}></i>
                          </div>
                          <input
                            value={formData.icon || ""}
                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                            className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="bxl-react"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Color Class</label>
                        <input
                          value={formData.color || ""}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="text-blue-500"
                        />
                      </div>
                    </div>

                    <div className="bg-[#1a1a1a] border border-white/5 rounded-lg p-4 flex items-center gap-4">
                      <span className="text-xs text-gray-500">Preview:</span>
                      <div className="flex items-center gap-3">
                        <i className={`bx ${formData.icon || "bxs-cube"} text-3xl ${formData.color || "text-white"}`}></i>
                        <span className="text-lg font-medium text-white">
                          {formData.skill_name || "Skill Name"}
                        </span>
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
                    form="skill-form"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : editingSkill ? "Save Changes" : "Create Skill"}
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