"use client";
import { useState } from "react";
import { X, Shield, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SecurityAlertProps {
  report: string;
  onClose: () => void;
}

export const SecurityAlert = ({ report, onClose }: SecurityAlertProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  // Parse the report to extract different types of issues
  const lines = report.split('\n').filter(line => line.trim());
  const warnings = lines.filter(line => line.includes('⚠️')).map(line => line.replace(/^\s*•\s*/, ''));
  const blocked = lines.filter(line => line.includes('🚫')).map(line => line.replace(/^\s*•\s*/, ''));
  const hasIssues = warnings.length > 0 || blocked.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            <DialogTitle className="text-lg">Security Scan Results</DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClose}
              className="ml-auto"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {!hasIssues ? (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium text-green-400">All Clear!</p>
                <p className="text-sm text-green-300">No security issues detected in the generated code.</p>
              </div>
            </div>
          ) : (
            <>
              {blocked.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <h3 className="font-medium text-red-400">Blocked Items ({blocked.length})</h3>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-xs text-red-300 mb-2">
                      The following potentially dangerous items were blocked for security:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {blocked.map((item, index) => (
                        <li key={index} className="text-red-200 pl-2 border-l-2 border-red-500/30">
                          {item.replace('• ', '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {warnings.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-amber-500" />
                    <h3 className="font-medium text-amber-400">Warnings ({warnings.length})</h3>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-xs text-amber-300 mb-2">
                      External resources that were allowed but flagged for review:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {warnings.map((warning, index) => (
                        <li key={index} className="text-amber-200 pl-2 border-l-2 border-amber-500/30">
                          {warning.replace('• ', '')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-400 mt-0.5" />
              <div>
                <p className="font-medium text-blue-400 text-sm">Security Measures Applied</p>
                <ul className="text-xs text-blue-300 mt-1 space-y-1">
                  <li>• Content Security Policy (CSP) headers injected</li>
                  <li>• Network requests blocked (fetch, XMLHttpRequest)</li>
                  <li>• Browser storage access restricted</li>
                  <li>• Parent window communication blocked</li>
                  <li>• Iframe sandbox with limited permissions</li>
                  <li>• External resources filtered to trusted domains</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleClose} className="flex-1">
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 