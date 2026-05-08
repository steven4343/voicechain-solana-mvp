import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { BookOpen, Plus, Search } from "lucide-react";
import ScholarshipCard from "../components/ScholarshipCard";
import { useAppContext } from "../context/AppContext";
import { Scholarship } from "../types";

export default function ScholarshipsPage() {
  const { connected } = useWallet();
  const { scholarships } = useAppContext();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = scholarships.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Scholarships</h1>
          <p className="text-dark-400">Manage and fund blockchain-based scholarships</p>
        </div>
        {connected && (
          <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create Scholarship
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
        <input
          type="text"
          placeholder="Search scholarships..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field w-full pl-12"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <BookOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No scholarships found</h3>
          <p className="text-dark-400">
            {search ? "Try a different search term" : "Create your first scholarship to get started"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} />
          ))}
        </div>
      )}

      {showCreateModal && <CreateScholarshipModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}

function CreateScholarshipModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [student, setStudent] = useState("");
  const [totalAmount, setTotalAmount] = useState("");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-6">Create New Scholarship</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Scholarship Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field w-full"
              placeholder="e.g. Blockchain Education Fund"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field w-full h-24 resize-none"
              placeholder="Describe the scholarship purpose..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Student Wallet Address</label>
            <input
              type="text"
              value={student}
              onChange={(e) => setStudent(e.target.value)}
              className="input-field w-full"
              placeholder="Solana wallet address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Total Amount (SOL)</label>
            <input
              type="number"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
              className="input-field w-full"
              placeholder="e.g. 100"
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            className="btn-primary flex-1"
            onClick={() => {
              console.log("Create scholarship:", { name, description, student, totalAmount });
              onClose();
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
