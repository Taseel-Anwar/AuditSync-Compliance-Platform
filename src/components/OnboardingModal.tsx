import React, { useState } from 'react';
import { CheckCircle2, ArrowRight, X, ShieldCheck } from 'lucide-react';
import { ComplianceFramework } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFrameworkSelected: (framework: ComplianceFramework) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onFrameworkSelected,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework>('SOC2');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleContinue = async () => {
    setIsSubmitting(true);
    try {
      await fetch('/api/onboarding/select-framework', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameworks: [selectedFramework],
        }),
      });
      onFrameworkSelected(selectedFramework);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const frameworks: {
    id: ComplianceFramework;
    title: string;
    description: string;
    tag: string;
  }[] = [
    {
      id: 'SOC2',
      title: 'SOC 2 Type II',
      description: 'Trust Services Criteria for Security, Availability, and Confidentiality.',
      tag: 'Most Popular for B2B SaaS',
    },
    {
      id: 'HIPAA',
      title: 'HIPAA Security Rule',
      description: 'Mandatory safeguard standard for Protected Health Information (ePHI).',
      tag: 'Healthcare & Biotech',
    },
    {
      id: 'ISO27001',
      title: 'ISO 27001:2022',
      description: 'International benchmark for establishing an Information Security Mgmt System.',
      tag: 'Global Enterprise Standard',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <main className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-200 relative">
        {/* Handle for mobile */}
        <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto sm:hidden" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step Indicator */}
        <div className="pt-2">
          <div className="flex items-center space-x-1.5 text-xs text-blue-600 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Step 1 of 3: Regulatory Scope</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
            Set Up Your Compliance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Select the primary regulatory framework your organization needs to monitor continuously.
          </p>
        </div>

        {/* Radio Cards */}
        <div className="space-y-2.5 pt-1" role="radiogroup">
          {frameworks.map((fw) => {
            const isSelected = selectedFramework === fw.id;
            return (
              <div
                key={fw.id}
                onClick={() => setSelectedFramework(fw.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 active:scale-[0.99] ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{fw.title}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                      {fw.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    {fw.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
          <button
            onClick={handleContinue}
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Configuring...' : 'Continue to Automated Audits'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </main>
    </div>
  );
};
