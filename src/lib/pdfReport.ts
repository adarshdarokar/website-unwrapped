import jsPDF from 'jspdf';
import type { AnalysisResult } from '@/hooks/useWebsiteAnalyzer';

const M = 48; // page margin

function scoreLabel(score: number) {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Above Average';
  if (score >= 50) return 'Average';
  if (score >= 40) return 'Below Average';
  return 'Needs Work';
}

function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([a-f\d]{3}|[a-f\d]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

export function generateAnalysisPDF(result: AnalysisResult) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentW = pageW - M * 2;
  let y = M;

  const domain = (() => {
    try { return new URL(result.url).hostname.replace('www.', ''); } catch { return result.url; }
  })();

  const ensureSpace = (needed: number) => {
    if (y + needed > pageH - M) {
      doc.addPage();
      y = M;
    }
  };

  // ---- Header band
  doc.setFillColor(99, 91, 255);
  doc.rect(0, 0, pageW, 110, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('WebVision Design Report', M, 52);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(domain, M, 74);
  doc.setFontSize(9);
  doc.text(new Date().toLocaleString(), pageW - M, 74, { align: 'right' });
  y = 150;

  // ---- Quality rating card
  doc.setDrawColor(226, 226, 235);
  doc.setFillColor(248, 248, 252);
  doc.roundedRect(M, y, contentW, 96, 10, 10, 'FD');

  const cx = M + 60;
  const cy = y + 48;
  doc.setFillColor(235, 234, 250);
  doc.circle(cx, cy, 34, 'F');
  const good = result.score >= 80;
  const mid = result.score >= 60;
  doc.setTextColor(good ? 22 : mid ? 176 : 200, good ? 150 : mid ? 120 : 60, good ? 110 : mid ? 40 : 60);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(String(result.score), cx, cy + 8, { align: 'center' });

  doc.setTextColor(30, 30, 40);
  doc.setFontSize(14);
  doc.text(`${scoreLabel(result.score)} — ${result.score}/100`, cx + 60, y + 38);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 105);
  doc.text('Overall quality rating based on visual design, performance,', cx + 60, y + 58);
  doc.text('accessibility, SEO signals and image optimisation.', cx + 60, y + 72);
  y += 122;

  // ---- Section helper
  const section = (title: string) => {
    ensureSpace(50);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(30, 30, 40);
    doc.text(title, M, y);
    y += 8;
    doc.setDrawColor(99, 91, 255);
    doc.setLineWidth(1);
    doc.line(M, y, M + contentW, y);
    y += 18;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 75);
  };

  const line = (label: string, value: string) => {
    const wrapped = doc.splitTextToSize(value || '—', contentW - 130) as string[];
    ensureSpace(wrapped.length * 14 + 6);
    doc.setTextColor(120, 120, 135);
    doc.text(label, M, y);
    doc.setTextColor(40, 40, 55);
    doc.text(wrapped, M + 130, y);
    y += wrapped.length * 14 + 4;
  };

  // ---- Key metrics
  section('Technical Checks');
  const checks: [string, boolean][] = [
    ['HTTPS', result.meta.isHttps],
    ['Mobile viewport', result.meta.hasViewport],
    ['Resource preload', result.meta.hasPreload || result.meta.hasPreconnect],
    ['Responsive images', result.meta.hasResponsiveImages],
  ];
  checks.forEach(([label, ok], i) => {
    const colW = contentW / 2;
    const px = M + (i % 2) * colW;
    const py = y + Math.floor(i / 2) * 24;
    doc.setFillColor(ok ? 226 : 253, ok ? 245 : 232, ok ? 236 : 232);
    doc.circle(px + 5, py - 3, 5, 'F');
    doc.setTextColor(40, 40, 55);
    doc.text(`${label}: ${ok ? 'Pass' : 'Missing'}`, px + 16, py);
  });
  y += 24 * Math.ceil(checks.length / 2) + 14;

  // ---- Design elements breakdown
  section('Extracted Design Elements');
  const counts: [string, number][] = [
    ['Colors', result.colors.length],
    ['Fonts', result.fonts.detected.length],
    ['Images', result.images.length],
    ['Videos', result.videos?.length ?? 0],
    ['Icons (SVG)', result.icons.svgCount],
    ['Animations', result.animations.cssAnimations.length + result.animations.keyframes.length],
  ];
  const total = counts.reduce((s, [, v]) => s + v, 0) || 1;
  counts.forEach(([label, value]) => {
    ensureSpace(24);
    const barX = M + 130;
    const barW = contentW - 190;
    const pct = value / total;
    doc.setTextColor(120, 120, 135);
    doc.text(label, M, y);
    doc.setFillColor(233, 233, 242);
    doc.roundedRect(barX, y - 8, barW, 9, 4, 4, 'F');
    if (pct > 0) {
      doc.setFillColor(99, 91, 255);
      doc.roundedRect(barX, y - 8, Math.max(barW * pct, 3), 9, 4, 4, 'F');
    }
    doc.setTextColor(40, 40, 55);
    doc.text(String(value), M + contentW, y, { align: 'right' });
    y += 22;
  });
  y += 8;

  // ---- Color palette swatches
  if (result.colors.length) {
    section('Color Palette');
    const sw = 44;
    const gap = 8;
    const perRow = Math.floor((contentW + gap) / (sw + gap));
    result.colors.slice(0, perRow * 4).forEach((color, i) => {
      const row = Math.floor(i / perRow);
      if (i % perRow === 0) ensureSpace(sw + 22);
      const px = M + (i % perRow) * (sw + gap);
      const py = y + row * (sw + 22);
      const rgb = hexToRgb(color);
      if (rgb) doc.setFillColor(rgb[0], rgb[1], rgb[2]);
      else doc.setFillColor(220, 220, 230);
      doc.setDrawColor(215, 215, 225);
      doc.roundedRect(px, py, sw, sw, 6, 6, 'FD');
      doc.setFontSize(6.5);
      doc.setTextColor(110, 110, 125);
      doc.text(color.slice(0, 9), px, py + sw + 10);
      doc.setFontSize(10);
    });
    y += Math.ceil(Math.min(result.colors.length, perRow * 4) / perRow) * (sw + 22) + 14;
  }

  // ---- Typography
  section('Typography');
  line('Detected fonts', result.fonts.detected.join(', '));
  line('Google Fonts', result.fonts.googleFonts.join(', '));
  y += 8;

  // ---- Icons & animations
  section('Icons & Animations');
  line('Icon libraries', result.icons.libraries.join(', '));
  line('CSS animations', result.animations.cssAnimations.slice(0, 12).join(', '));
  line('Transitions', String(result.animations.transitions.length));
  line('Keyframes', result.animations.keyframes.slice(0, 12).join(', '));

  // ---- Footer on every page
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 165);
    doc.text(`Generated by WebVision · ${result.url}`, M, pageH - 24);
    doc.text(`Page ${p} of ${pages}`, pageW - M, pageH - 24, { align: 'right' });
  }

  doc.save(`webvision-${domain}-${new Date().toISOString().split('T')[0]}.pdf`);
}
