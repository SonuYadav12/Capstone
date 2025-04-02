"use client";

import React, { useRef } from "react";
import MDEditor from "@uiw/react-md-editor";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const CoverLetterPreview = ({ content }) => {
  const previewRef = useRef(null);

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, {
      scale: 2, // Improves quality
      useCORS: true, // Ensures proper image rendering
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // Add image to PDF
    const imgWidth = 190; // mm
    const pageHeight = 297; // A4 page height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    // Save the PDF
    pdf.save("CoverLetter.pdf");
  };

  return (
    <div className="py-4 space-y-4">
      {/* Download Button at the Top */}
      <div className="flex justify-end">
        <Button onClick={handleDownloadPDF} className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Cover Letter Preview */}
      <div ref={previewRef} className="bg-white p-4 rounded-lg shadow">
        <MDEditor value={content} preview="preview" height={700} />
      </div>
    </div>
  );
};

export default CoverLetterPreview;
