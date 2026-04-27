"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAnalyses } from "@/services/api";
import UploadZone from "@/components/UploadZone";
import { AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [analyses, setAnalyses] = useState<any[]>([]);

  const fetchAnalyses = () => {
    getAnalyses().then(setAnalyses).catch(console.error);
  };

  useEffect(() => {
    fetchAnalyses();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Decision Clarity Engine
          </h1>
          <p className="text-slate-500">
            Audit de gouvernance et détection de zones de flou.
          </p>
        </header>

        {/* UPLOAD */}
        <div className="mb-12">
          <UploadZone onUploadSuccess={fetchAnalyses} />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4 text-amber-600 mb-2">
              <AlertTriangle size={24} />
              <span className="font-semibold uppercase text-xs tracking-wider">
                Risques Élevés
              </span>
            </div>

            <p className="text-2xl font-bold">
              {analyses.filter(a => a.risk_level === "HIGH").length}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <h2 className="text-xl font-semibold mb-4 text-slate-800">
          Historique des Analyses
        </h2>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">

            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Bullshit Score
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Risque
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {analyses.map((analysis) => (
                <tr
                  key={analysis.id}
                  className="hover:bg-slate-50 transition-colors"
                >

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(analysis.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 font-mono font-bold text-slate-700">
                    {analysis.bullshit_score}/100
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        analysis.risk_level === "HIGH"
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {analysis.risk_level}
                    </span>
                  </td>

                  <td
                    className="px-6 py-4 text-sm text-blue-600 font-medium cursor-pointer hover:underline"
                    onClick={() => router.push(`/reports/${analysis.id}`)}
                  >
                    Consulter le rapport →
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  );
}