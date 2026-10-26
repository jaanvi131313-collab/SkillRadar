import React, { useState } from 'react';
import { 
  X, 
  Database, 
  FileSpreadsheet, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Upload, 
  CheckCircle2, 
  Info,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DatasetProvenanceModal: React.FC = () => {
  const { 
    showProvenanceModal, 
    setShowProvenanceModal, 
    provenance, 
    jobsSample, 
    notify, 
    playBeep 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'sheets' | 'quality' | 'sample'>('overview');

  if (!showProvenanceModal) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(provenance, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "skillradar_dataset_provenance.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify('Provenance Exported', 'Dataset metadata downloaded as JSON', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md animate-in fade-in select-text">
      <div className="w-full max-w-5xl max-h-[90vh] rounded-3xl bg-space-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-space-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Dataset Provenance & Quality Audit</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                  {provenance.dataset_file}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transparent inspection of 15 workbook sheets, provenance origins, and data quality limitations.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playBeep(440, 'sine');
              setShowProvenanceModal(false);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex px-5 border-b border-slate-800 bg-space-900/60 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Executive Summary & Provenance
          </button>
          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sheets' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            All 15 Sheets ({provenance.total_sheets})
          </button>
          <button
            onClick={() => setActiveTab('quality')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'quality' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Data Quality Checks (Q001–Q010)
          </button>
          <button
            onClick={() => setActiveTab('sample')}
            className={`py-3 px-4 border-b-2 transition-all cursor-pointer ${
              activeTab === 'sample' ? 'border-cyan-400 text-cyan-300' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Clean Job Postings Sample ({jobsSample.length})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Volume Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-space-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">Raw Job Records</span>
                  <div className="text-xl font-bold font-mono text-white mt-0.5">16,458</div>
                </div>
                <div className="p-4 rounded-2xl bg-space-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">Clean Canonical Jobs</span>
                  <div className="text-xl font-bold font-mono text-cyan-300 mt-0.5">16,001</div>
                </div>
                <div className="p-4 rounded-2xl bg-space-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">Standardized Roles</span>
                  <div className="text-xl font-bold font-mono text-amber-300 mt-0.5">66</div>
                </div>
                <div className="p-4 rounded-2xl bg-space-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono">Taxonomy Skills</span>
                  <div className="text-xl font-bold font-mono text-emerald-300 mt-0.5">136</div>
                </div>
              </div>

              {/* Source Registers Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-white text-sm">Registered Data Sources (01_Source_Register)</h4>
                <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-space-950">
                  {provenance.sources.map(src => (
                    <div key={src.source_id} className="p-4 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-cyan-300">{src.source_id}</span>
                          <span className="font-semibold text-white">{src.source_name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {src.license_terms}
                        </span>
                      </div>
                      <p className="text-slate-400 text-xs">{src.fields_and_coverage}</p>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Coverage: {src.date_coverage} • Status: {src.import_status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explicit Grounding Disclaimers */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-600/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Mandatory Dataset Grounding Disclaimers</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-300 text-xs leading-relaxed">
                  {provenance.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: ALL 15 SHEETS */}
          {activeTab === 'sheets' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Workbook Structure & Catalog</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {provenance.sheet_names.map((sheet, idx) => (
                  <div key={sheet} className="p-3 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                      <span className="font-mono text-slate-200">{sheet}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Sheet {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DATA QUALITY AUDITS */}
          {activeTab === 'quality' && (
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm">Quality Acceptance Audits (11_Data_Quality)</h4>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-space-950">
                {provenance.data_quality_audits.map(check => (
                  <div key={check.check_id} className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-cyan-300">{check.check_id}</span>
                        <span className="font-semibold text-white">{check.check_name}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                        check.status.toLowerCase().includes('pass') ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        {check.status}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{check.action}</p>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Method: {check.method} • Rule: {check.acceptance_rule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SAMPLE JOBS */}
          {activeTab === 'sample' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-sm">Clean Job Postings Preview (Preserved IDs)</h4>
                <span className="font-mono text-slate-400 text-xs">{jobsSample.length} Curated Records</span>
              </div>
              <div className="max-h-[420px] overflow-y-auto border border-slate-800 rounded-2xl bg-space-950 divide-y divide-slate-800/80">
                {jobsSample.slice(0, 50).map(j => (
                  <div key={j.job_id} className="p-3 flex items-center justify-between font-mono text-xs">
                    <div>
                      <div className="font-semibold text-white">{j.title}</div>
                      <div className="text-[11px] text-slate-400">{j.company} • {j.city}, {j.state}</div>
                    </div>
                    <div className="text-right">
                      {j.salary_min && j.salary_max ? (
                        <span className="text-emerald-400 font-bold">
                          ₹{(j.salary_min / 100000).toFixed(1)}L - ₹{(j.salary_max / 100000).toFixed(1)}L
                        </span>
                      ) : (
                        <span className="text-slate-500">Salary Not Stated</span>
                      )}
                      <div className="text-[10px] text-slate-500">{j.job_id}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-space-950/60">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Clean records extracted directly from Dataset.xlsx</span>
          </div>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-space-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Provenance JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
