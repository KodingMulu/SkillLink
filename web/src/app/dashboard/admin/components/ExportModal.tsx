'use client';

import { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, FileJson, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPeriod: string;
}

type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json';

interface ExportOption {
  id: ExportFormat;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

export default function ExportModal({ isOpen, onClose, selectedPeriod }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const exportOptions: ExportOption[] = [
    {
      id: 'pdf',
      name: 'PDF Document',
      description: 'Export sebagai dokumen PDF',
      icon: FileText,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'excel',
      name: 'Excel Spreadsheet',
      description: 'Export sebagai file Excel (.xlsx)',
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      id: 'csv',
      name: 'CSV File',
      description: 'Export sebagai file CSV',
      icon: FileSpreadsheet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'json',
      name: 'JSON Data',
      description: 'Export sebagai file JSON',
      icon: FileJson,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const getPeriodText = () => {
    const periods: Record<string, string> = {
      '7days': '7 Hari Terakhir',
      '30days': '30 Hari Terakhir',
      '90days': '90 Hari Terakhir',
      'all': 'Semua Data'
    };
    return periods[selectedPeriod] || '30 Hari Terakhir';
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const data = {
      period: selectedPeriod,
      exportDate: new Date().toISOString(),
      stats: {
        totalUsers: 2847,
        activeProjects: 1234,
        totalTransactions: 'Rp 2.4M',
        pendingReports: 23
      },
      users: [
        {
          id: 1,
          name: 'Budi Santoso',
          email: 'budi@email.com',
          role: 'Freelancer',
          status: 'active',
          joined: '2024-12-20',
          projects: 3,
          rating: 4.8
        },
        {
          id: 2,
          name: 'PT Digital Innovation',
          email: 'contact@digital.com',
          role: 'Client',
          status: 'active',
          joined: '2024-12-20',
          projects: 8,
          rating: 4.9
        }
      ]
    };

    let content: string;
    let mimeType: string;
    let filename: string;

    switch (selectedFormat) {
      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        filename = `admin-report-${selectedPeriod}-${Date.now()}.json`;
        break;
      
      case 'csv':
        const csvHeaders = 'ID,Name,Email,Role,Status,Joined,Projects,Rating\n';
        const csvRows = data.users.map(u => 
          `${u.id},"${u.name}","${u.email}",${u.role},${u.status},${u.joined},${u.projects},${u.rating}`
        ).join('\n');
        content = csvHeaders + csvRows;
        mimeType = 'text/csv';
        filename = `admin-report-${selectedPeriod}-${Date.now()}.csv`;
        break;
      
      case 'excel':
        const excelHeaders = 'ID\tName\tEmail\tRole\tStatus\tJoined\tProjects\tRating\n';
        const excelRows = data.users.map(u => 
          `${u.id}\t${u.name}\t${u.email}\t${u.role}\t${u.status}\t${u.joined}\t${u.projects}\t${u.rating}`
        ).join('\n');
        content = '\uFEFF' + excelHeaders + excelRows;
        mimeType = 'application/vnd.ms-excel';
        filename = `admin-report-${selectedPeriod}-${Date.now()}.xls`;
        break;
      
      case 'pdf':
      default:
        content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Admin Report - ${getPeriodText()}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; }
    h1 { color: #1e293b; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
    th { background-color: #f1f5f9; }
  </style>
</head>
<body>
  <h1>Admin Dashboard Report</h1>
  <p><strong>Period:</strong> ${getPeriodText()}</p>
  <table>
    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
    <tbody>
      ${data.users.map(u => `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td></tr>`).join('')}
    </tbody>
  </table>
</body>
</html>
        `;
        mimeType = 'text/html';
        filename = `admin-report-${selectedPeriod}-${Date.now()}.html`;
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportSuccess(true);

    setTimeout(() => {
      setExportSuccess(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Export Data</h2>
            <p className="text-sm text-slate-500 mt-1">
              Pilih format export untuk periode: <span className="font-semibold">{getPeriodText()}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors" disabled={isExporting}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6">
          {exportSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Export Berhasil!</h3>
              <p className="text-sm text-slate-500">File berhasil diunduh ke perangkat Anda</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {exportOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedFormat(option.id)}
                      disabled={isExporting}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        selectedFormat === option.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      } ${isExporting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${option.bgColor}`}>
                          <IconComponent className={`w-5 h-5 ${option.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 text-sm">{option.name}</h3>
                            {selectedFormat === option.id && (
                              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1">{option.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <div className="text-blue-600 mt-0.5">ℹ️</div>
                  <div>
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">Informasi Export</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Data akan di-export sesuai periode yang dipilih</li>
                      <li>• File akan otomatis terunduh ke perangkat Anda</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {!exportSuccess && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 bg-slate-50 sticky bottom-0">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export {selectedFormat.toUpperCase()}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}