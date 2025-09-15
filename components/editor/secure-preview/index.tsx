"use client";
import { useUpdateEffect } from "react-use";
import { useMemo, useState } from "react";
import classNames from "classnames";
import { toast } from "sonner";


import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magic-ui/grid-pattern";
import { htmlTagToText } from "@/lib/html-tag-to-text";
import { Page } from "@/types";
import { HTMLSanitizer } from "@/lib/html-sanitizer";
import { SecurityAlert } from "../secure-preview/security-alert";

export const SecurePreview = ({
  html,
  isResizing,
  isAiWorking,
  ref,
  device,
  currentTab,
  iframeRef,
  pages,
  setCurrentPage,
  isEditableModeEnabled,
  onClickElement,
}: {
  html: string;
  isResizing: boolean;
  isAiWorking: boolean;
  pages: Page[];
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  ref: React.RefObject<HTMLDivElement | null>;
  iframeRef?: React.RefObject<HTMLIFrameElement | null>;
  device: "desktop" | "mobile";
  currentTab: string;
  isEditableModeEnabled?: boolean;
  onClickElement?: (element: HTMLElement) => void;
}) => {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [securityReport, setSecurityReport] = useState<string>("");
  const [showSecurityAlert, setShowSecurityAlert] = useState(false);

  // Sanitize HTML with comprehensive security measures
  const { sanitizedHtml, securityWarnings } = useMemo(() => {
    if (!html) return { sanitizedHtml: '', securityWarnings: [] };
    
    const result = HTMLSanitizer.sanitize(html);
    const report = HTMLSanitizer.generateSecurityReport(result);
    
    setSecurityReport(report);
    
    // Show security alert if there are blocked items or warnings
    if (result.blocked.length > 0 || result.warnings.length > 0) {
      setShowSecurityAlert(true);
    }
    
    return {
      sanitizedHtml: result.sanitizedHtml,
      securityWarnings: [...result.warnings, ...result.blocked]
    };
  }, [html]);

  const handleMouseOver = (event: MouseEvent) => {
    if (iframeRef?.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const targetElement = event.target as HTMLElement;
        if (
          hoveredElement !== targetElement &&
          targetElement !== iframeDocument.body
        ) {
          setHoveredElement(targetElement);
          targetElement.classList.add("hovered-element");
        } else {
          return setHoveredElement(null);
        }
      }
    }
  };

  const handleMouseOut = () => {
    setHoveredElement(null);
  };

  const handleClick = (event: MouseEvent) => {
    if (iframeRef?.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const targetElement = event.target as HTMLElement;
        if (targetElement !== iframeDocument.body) {
          onClickElement?.(targetElement);
        }
      }
    }
  };

  const handleCustomNavigation = (event: MouseEvent) => {
    if (iframeRef?.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        const findClosestAnchor = (
          element: HTMLElement
        ): HTMLAnchorElement | null => {
          let current = element;
          while (current && current !== iframeDocument.body) {
            if (current.tagName === "A") {
              return current as HTMLAnchorElement;
            }
            current = current.parentElement as HTMLElement;
          }
          return null;
        };

        const anchorElement = findClosestAnchor(event.target as HTMLElement);
        if (anchorElement) {
          let href = anchorElement.getAttribute("href");
          if (href) {
            event.stopPropagation();
            event.preventDefault();

            if (href.includes("#") && !href.includes(".html")) {
              const targetElement = iframeDocument.querySelector(href);
              if (targetElement) {
                targetElement.scrollIntoView({ behavior: "smooth" });
              }
              return;
            }

            href = href.split(".html")[0] + ".html";
            const isPageExist = pages.some((page) => page.path === href);
            if (isPageExist) {
              setCurrentPage(href);
            }
          }
        }
      }
    }
  };

  useUpdateEffect(() => {
    const cleanupListeners = () => {
      if (iframeRef?.current?.contentDocument) {
        const iframeDocument = iframeRef.current.contentDocument;
        iframeDocument.removeEventListener("mouseover", handleMouseOver);
        iframeDocument.removeEventListener("mouseout", handleMouseOut);
        iframeDocument.removeEventListener("click", handleClick);
      }
    };

    if (iframeRef?.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        cleanupListeners();

        if (isEditableModeEnabled) {
          iframeDocument.addEventListener("mouseover", handleMouseOver);
          iframeDocument.addEventListener("mouseout", handleMouseOut);
          iframeDocument.addEventListener("click", handleClick);
        }
      }
    }

    return cleanupListeners;
  }, [iframeRef, isEditableModeEnabled]);

  const selectedElement = useMemo(() => {
    if (!isEditableModeEnabled) return null;
    if (!hoveredElement) return null;
    return hoveredElement;
  }, [hoveredElement, isEditableModeEnabled]);

  return (
    <>
      {showSecurityAlert && (
        <SecurityAlert
          report={securityReport}
          onClose={() => setShowSecurityAlert(false)}
        />
      )}
      
      <div
        ref={ref}
        className={classNames(
          "w-full border-l border-gray-900 h-full relative z-0 flex items-center justify-center",
          {
            "lg:p-4": currentTab !== "preview",
            "max-lg:h-0": currentTab === "chat",
            "max-lg:h-full": currentTab === "preview",
          }
        )}
        onClick={(e) => {
          if (isAiWorking) {
            e.preventDefault();
            e.stopPropagation();
            toast.warning("Please wait for the AI to finish working.");
          }
        }}
      >
        <GridPattern
          x={-1}
          y={-1}
          strokeDasharray={"4 2"}
          className={cn(
            "[mask-image:radial-gradient(900px_circle_at_center,white,transparent)]"
          )}
        />
        
        {/* Security indicator */}
        {securityWarnings.length > 0 && (
          <div className="absolute top-2 right-2 z-20">
            <div 
              className="bg-amber-500/20 border border-amber-500 rounded-lg px-2 py-1 text-xs text-amber-300 cursor-pointer"
              onClick={() => setShowSecurityAlert(true)}
            >
              🛡️ {securityWarnings.length} security {securityWarnings.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        )}
        
        {!isAiWorking && hoveredElement && selectedElement && (
          <div
            className="cursor-pointer absolute bg-sky-500/10 border-[2px] border-dashed border-sky-500 rounded-r-lg rounded-b-lg p-3 z-10 pointer-events-none"
            style={{
              top:
                selectedElement.getBoundingClientRect().top +
                (currentTab === "preview" ? 0 : 24),
              left:
                selectedElement.getBoundingClientRect().left +
                (currentTab === "preview" ? 0 : 24),
              width: selectedElement.getBoundingClientRect().width,
              height: selectedElement.getBoundingClientRect().height,
            }}
          >
            <span className="bg-sky-500 rounded-t-md text-sm text-neutral-100 px-2 py-0.5 -translate-y-7 absolute top-0 left-0">
              {htmlTagToText(selectedElement.tagName.toLowerCase())}
            </span>
          </div>
        )}
        
        <iframe
          id="secure-preview-iframe"
          ref={iframeRef}
          title="Secure Preview"
          className={classNames(
            "w-full select-none transition-all duration-200 bg-black h-full",
            {
              "pointer-events-none": isResizing || isAiWorking,
              "lg:max-w-md lg:mx-auto lg:!rounded-[42px] lg:border-[8px] lg:border-neutral-700 lg:shadow-2xl lg:h-[80dvh] lg:max-h-[996px]":
                device === "mobile",
              "lg:border-[8px] lg:border-neutral-700 lg:shadow-2xl lg:rounded-[24px]":
                currentTab !== "preview" && device === "desktop",
            }
          )}
          // Enhanced security sandbox attributes
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          srcDoc={sanitizedHtml}
          onLoad={() => {
            if (iframeRef?.current?.contentWindow?.document?.body) {
              iframeRef.current.contentWindow.document.body.scrollIntoView({
                block: isAiWorking ? "end" : "start",
                inline: "nearest",
                behavior: isAiWorking ? "instant" : "smooth",
              });
            }
            // Add event listener to all links in the iframe to handle navigation
            if (iframeRef?.current?.contentWindow?.document) {
              const links =
                iframeRef.current.contentWindow.document.querySelectorAll("a");
              links.forEach((link) => {
                link.addEventListener("click", handleCustomNavigation);
              });
            }
          }}
          // Additional security attributes
          allow="accelerometer 'none'; camera 'none'; encrypted-media 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; midi 'none'; payment 'none'; usb 'none'"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
    </>
  );
}; 