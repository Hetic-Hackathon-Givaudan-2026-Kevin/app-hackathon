'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, X } from 'lucide-react';
import { downloadReportPdf, type PdfReportInput } from '@/lib/pdf';
import type { ReportSection } from '@/lib/report';

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  sections: ReportSection[];
  onSectionChange: (id: string, text: string) => void;
  meta: Omit<PdfReportInput, 'sections'>;
}

export default function ReportModal({
  open,
  onClose,
  sections,
  onSectionChange,
  meta,
}: ReportModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(false);

  // <dialog> natif : focus piégé, fermeture avec Échap, fond inerte
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Bloque le défilement de la page derrière la modale
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function handleDownload() {
    setIsExporting(true);
    setExportError(false);
    try {
      await downloadReportPdf({ ...meta, sections });
    } catch {
      setExportError(true);
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      // Un clic sur le fond (et non sur le contenu) ferme la modale
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      aria-labelledby="report-modal-title"
      className="m-auto max-h-[90vh] w-[calc(100%-1.5rem)] max-w-3xl flex-col overflow-hidden rounded-3xl bg-white p-0 text-[#172033] backdrop:bg-[#172033]/50 open:flex"
    >
      <header className="flex items-start justify-between gap-4 border-b border-[#E6E9EF] p-5 sm:p-6">
        <div>
          <h2
            id="report-modal-title"
            className="text-xl font-semibold tracking-tight sm:text-2xl"
          >
            Compte rendu du rendez-vous
          </h2>
          <p className="mt-1 text-sm text-[#667085]">
            {meta.clientName} • {meta.opportunityTitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fermer"
          className="shrink-0 rounded-full bg-[#F6F7F9] p-2 text-[#667085] transition-colors hover:bg-[#EFE9FC] hover:text-[#6542C2]"
        >
          <X size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-5 sm:p-6">
        <p className="mb-4 text-sm text-[#667085]">
          Brouillon généré à partir du contexte, des réponses et des notes.
          Modifiez chaque section avant de le télécharger.
        </p>
        <div className="flex flex-col gap-3">
          {sections.map((section, index) => (
            <label
              key={section.id}
              className="block rounded-2xl bg-[#F6F7F9] p-4 sm:p-5"
            >
              <span className="text-sm font-semibold">
                {index + 1}. {section.title}
              </span>
              <textarea
                value={section.text}
                rows={Math.max(
                  3,
                  section.text.split('\n').length +
                    Math.floor(section.text.length / 80),
                )}
                onChange={(event) =>
                  onSectionChange(section.id, event.target.value)
                }
                className="mt-2 w-full resize-y rounded-2xl bg-white p-4 text-sm outline-none transition-colors focus:bg-[#EFE9FC]/60"
              />
            </label>
          ))}
        </div>
      </div>

      <footer className="flex flex-col-reverse gap-3 border-t border-[#E6E9EF] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <p aria-live="polite" className="text-sm text-[#D94848]">
          {exportError && "Le PDF n'a pas pu être généré. Réessayez."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-full bg-[#F6F7F9] px-6 text-sm font-medium transition-colors hover:bg-[#EFE9FC]"
          >
            Fermer
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#6542C2] px-6 text-sm font-medium text-white transition-all duration-300 ease-out hover:opacity-90 disabled:opacity-60"
          >
            <Download size={16} />
            {isExporting ? 'Génération...' : 'Télécharger en PDF'}
          </button>
        </div>
      </footer>
    </dialog>
  );
}