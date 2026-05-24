"use client";

import { toPng, toJpeg, toSvg } from "html-to-image";

export type ImageFormat = "png" | "jpg" | "svg";

export async function exportImage({
  node,
  format,
  scale,
  filename,
}: {
  node: HTMLElement;
  format: ImageFormat;
  scale: 1 | 2 | 3;
  filename: string;
}): Promise<void> {
  // Use the actual rendered size, multiplied by `scale`. html-to-image
  // renders at devicePixelRatio * pixelRatio, so we pass `pixelRatio: scale`.
  const opts = {
    pixelRatio: scale,
    cacheBust: true,
    backgroundColor: "#06080B",
    // Embed external fonts so the exported image isn't using a fallback.
    skipFonts: false,
    style: {
      // Make sure text uses Manrope inside the snapshot.
      fontFamily: "Manrope, system-ui, sans-serif",
    },
  } as const;

  let dataUrl: string;
  switch (format) {
    case "png":
      dataUrl = await toPng(node, opts);
      break;
    case "jpg":
      dataUrl = await toJpeg(node, { ...opts, quality: 0.95 });
      break;
    case "svg":
      dataUrl = await toSvg(node, opts);
      break;
  }

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
