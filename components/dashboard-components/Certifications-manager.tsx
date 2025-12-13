"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { certificationService } from "@/services/certification.service";
import { useDebounce } from "@/hooks/useDebounce";

// --- TYPE DEFINITIONS ---
type Cert = {
  id: number;
  coursera_name: string;
  specialization?: string;
  icon: string;
  color: string;
  issuer: string;
  issue_date: string;
  credential_url: string;
  description: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

// --- HELPER FORMAT DATE ---
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date);
};

export default function CertificationsManager() {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // State cho input tìm kiếm
  const [searchQuery, setSearchQuery] = useState("");
  // Debounce giá trị search (chỉ gọi API khi ngừng gõ 500ms)
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Cert | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Cert>>({
    coursera_name: "",
    specialization: "",
    issuer: "",
    icon: "bxs-award",
    color: "text-yellow-400",
    issue_date: new Date().toISOString().split('T')[0],
    credential_url: "",
    description: ""
  });

  // --- FETCH CERTIFICATES ---
  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    try {
      const response = await certificationService.getCertificates({
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchQuery || undefined,
      });

      const { data, pagination: pag } = response.data;
      setCerts(data);

      // FIX: Đảm bảo totalPages luôn có giá trị đúng
      const total = pag.total ?? 0;
      const limit = pag.limit ?? pagination.limit;
      const calculatedTotalPages = pag.totalPages ?? Math.ceil(total / limit);

      setPagination({
        page: pag.page ?? pagination.page,
        limit,
        total,
        totalPages: calculatedTotalPages,
      });
    } catch (err) {
      console.error("Failed to fetch certificates", err);
      alert("Failed to load certifications. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearchQuery]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // Reset page về 1 khi search thay đổi (debounced)
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [debouncedSearchQuery]);

  // --- HANDLERS ---
  const openModal = (cert?: Cert) => {
    if (cert) {
      setEditingCert(cert);
      setFormData(cert);
    } else {
      setEditingCert(null);
      setFormData({
        coursera_name: "",
        specialization: "",
        issuer: "",
        icon: "bxs-award",
        color: "text-yellow-400",
        issue_date: new Date().toISOString().split('T')[0],
        credential_url: "",
        description: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.coursera_name || !formData.issuer || !formData.issue_date) {
      alert("Please fill in all required fields.");
      return;
    }

    setSaving(true);
    try {
      if (editingCert) {
        await certificationService.updateCertificate(editingCert.id, formData);
      } else {
        await certificationService.createCertificate(formData);
      }
      setIsModalOpen(false);
      await fetchCertificates();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save certification. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    setDeletingId(id);
    try {
      await certificationService.deleteCertificate(id);
      await fetchCertificates();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete certification.");
    } finally {
      setDeletingId(null);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Certifications</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your professional certificates & degrees.</p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-95"
        >
          <i className='bx bx-plus text-lg'></i>
          New Cert
        </button>
      </div>

      {/* --- SEARCH (với debounce) --- */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <i className='bx bx-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'></i>
          <input
            type="text"
            placeholder="Search by name, issuer, or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
          />
          {searchQuery !== debouncedSearchQuery && (
            <i className='bx bx-loader-alt animate-spin absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm'></i>
          )}
        </div>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-[#1e1e1e] shadow-inner">
        <div className="overflow-y-auto h-full custom-scrollbar">
          {loading ? (
            <div className="p-12 text-center text-gray-500">
              <i className='bx bx-loader-alt animate-spin text-4xl block mb-4'></i>
              Loading certifications...
            </div>
          ) : certs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <i className='bx bxs-award text-4xl mb-2 block opacity-50'></i>
              No certifications found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#252525] sticky top-0 z-10">
                <tr>
                  <th className="p-4 w-16 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10 text-center">Icon</th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10">Certificate Name</th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10">Specialization</th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10">Date & Link</th>
                  <th className="p-4 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-white/10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {certs.map((cert) => (
                  <tr key={cert.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4 text-center">
                      <div className="w-10 h-10 rounded-lg bg-[#2a2a2a] border border-white/5 flex items-center justify-center mx-auto">
                        <i className={`bx ${cert.icon} text-2xl ${cert.color}`}></i>
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="font-bold text-white text-sm">{cert.coursera_name}</div>
                      <div className="text-xs text-blue-400 mt-0.5 mb-1">{cert.issuer}</div>
                      <div className="text-xs text-gray-500 line-clamp-1 truncate">{cert.description}</div>
                    </td>

                    <td className="p-4">
                      {cert.specialization ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-[#2a2a2a] text-gray-300 border border-white/5 uppercase tracking-wide">
                          {cert.specialization}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">-</span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-300">{formatDate(cert.issue_date)}</span>
                        {cert.credential_url && (
                          <a href={cert.credential_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                            Verify <i className='bx bx-link-external'></i>
                          </a>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal(cert)}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <i className='bx bxs-edit-alt'></i>
                        </button>
                        <button
                          onClick={() => handleDelete(cert.id)}
                          disabled={deletingId === cert.id}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          {deletingId === cert.id ? <i className='bx bx-loader-alt animate-spin'></i> : <i className='bx bx-trash'></i>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* --- PAGINATION --- */}
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

      {/* --- MODAL (CREATE / EDIT) --- */}
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
                    {editingCert ? "Edit Certification" : "New Certification"}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                    <i className='bx bx-x text-2xl'></i>
                  </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                  <form id="cert-form" onSubmit={handleSave} className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Certificate Name</label>
                      <input
                        required
                        value={formData.coursera_name || ""}
                        onChange={e => setFormData({ ...formData, coursera_name: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Google Data Analytics"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Issuer</label>
                        <input
                          required
                          value={formData.issuer || ""}
                          onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. Google, AWS, Meta"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Specialization / Category</label>
                        <input
                          value={formData.specialization || ""}
                          onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="e.g. Data Science"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Issue Date</label>
                        <input
                          type="date"
                          required
                          value={formData.issue_date || ""}
                          onChange={e => setFormData({ ...formData, issue_date: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Credential URL</label>
                        <input
                          value={formData.credential_url || ""}
                          onChange={e => setFormData({ ...formData, credential_url: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="https://coursera.org/verify/..."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Icon Class</label>
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded bg-[#252525] border border-white/10 flex items-center justify-center shrink-0">
                            <i className={`bx ${formData.icon} text-xl ${formData.color}`}></i>
                          </div>
                          <input
                            value={formData.icon || ""}
                            onChange={e => setFormData({ ...formData, icon: e.target.value })}
                            className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                            placeholder="bxl-google"
                          />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-gray-400 uppercase">Icon Color</label>
                        <input
                          value={formData.color || ""}
                          onChange={e => setFormData({ ...formData, color: e.target.value })}
                          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
                          placeholder="text-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-gray-400 uppercase">Description</label>
                      <textarea
                        rows={3}
                        value={formData.description || ""}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg p-2.5 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        placeholder="What did you learn?"
                      />
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
                    form="cert-form"
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : editingCert ? "Save Changes" : "Create Cert"}
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