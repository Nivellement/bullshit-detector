"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAnalysisById } from "@/services/api";
import { ChevronLeft, AlertCircle } from "lucide-react";

export default function ReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getAnalysisById(id as string)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  // STATES UI
  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Chargement du rapport d'audit...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500">
        Rapport introuvable.
      </div>
    );
  }

  // 🔥 NORMALISATION ROBUSTE (évite crash backend mismatch)
  const analysis = data.raw_analysis ?? data.analysis ?? {};
  const issues = analysis.critical_issues ?? [];

  return (
    <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <ChevronLeft size={20} />
          Retour au Dashboard
        </button>

        {/* HEADER */}
        <header className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex justify-between items-start">

            <div>
              <h1 className="text-2xl font-bold">
                Rapport d'Audit # {id}
              </h1>
              <p className="text-slate-500">
                Analysé le {new Date(data.created_at).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <div className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Score de Risque
              </div>

              <div
                className={`text-4xl font-black ${
                  data.risk_level === "HIGH"
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {analysis?.bullshit_score ?? "N/A"}/100
              </div>
            </div>

          </div>
        </header>

        {/* ISSUES */}
        <section className="space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertCircle className="text-amber-500" />
            Points de Vigilance Détectés
          </h2>

          <div className="grid gap-4">

            {issues.length > 0 ? (
              issues.map((issue: any, index: number) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border-l-4 border-l-amber-500 shadow-sm border border-slate-200"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      {issue.type ?? "UNKNOWN"}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      Gravité: {issue.severity ?? "N/A"}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed">
                    {issue.description ?? "Pas de description"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-500">
                Aucun problème critique détecté.
              </p>
            )}

          </div>
        </section>

        {/* TRANSCRIPT */}
        <section className="mt-12 bg-slate-900 text-white p-8 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">
            Transcription Analysée
          </h3>

          <div className="text-slate-400 font-mono text-sm whitespace-pre-wrap">
            {data.transcript}
          </div>
        </section>

      </div>
    </main>
  );
}