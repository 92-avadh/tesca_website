export interface CropOptions {
  aspectRatio: number;
  file: File;
}

export function openCropModal(options: CropOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const overlay = document.createElement("div");
        overlay.className = "fixed inset-0 z-50 flex items-center justify-center";
        overlay.style.background = "rgba(0,0,0,0.6)";

        const modal = document.createElement("div");
        modal.className = "bg-white rounded-2xl shadow-2xl flex flex-col";
        modal.style.width = "min(90vw, 800px)";
        modal.style.maxHeight = "90vh";

        const header = document.createElement("div");
        header.className = "flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-200";
        const title = document.createElement("h3");
        title.className = "text-base font-bold text-slate-800";
        title.textContent = "Crop Image";
        const closeBtn = document.createElement("button");
        closeBtn.className = "text-slate-400 hover:text-slate-600 text-xl leading-none cursor-pointer";
        closeBtn.innerHTML = "&times;";
        closeBtn.onclick = () => { document.body.removeChild(overlay); reject(new Error("Cancelled")); };
        header.appendChild(title);
        header.appendChild(closeBtn);

        const cropContainer = document.createElement("div");
        cropContainer.className = "relative overflow-hidden bg-slate-900 mx-auto w-full";
        const displayW = Math.min(img.naturalWidth, 700);
        const displayH = Math.min(img.naturalHeight, 500);
        cropContainer.style.width = `${displayW}px`;
        cropContainer.style.height = `${displayH}px`;
        cropContainer.style.maxWidth = "100%";
        cropContainer.style.maxHeight = "55vh";

        const imageEl = document.createElement("img");
        imageEl.src = img.src;
        imageEl.className = "block select-none";
        imageEl.style.width = "100%";
        imageEl.style.height = "100%";
        imageEl.style.objectFit = "contain";
        imageEl.draggable = false;

        const cropWindow = document.createElement("div");
        cropWindow.className = "absolute cursor-move select-none";
        cropWindow.style.boxShadow = "0 0 0 9999px rgba(0,0,0,0.5)";
        cropWindow.style.border = "2px solid #fff";
        cropWindow.style.borderRadius = options.aspectRatio === 1 ? "50%" : "4px";

        // Calculate the scale and offsets of the image rendered inside container via contain
        const scale = Math.min(displayW / img.naturalWidth, displayH / img.naturalHeight);
        const renderedW = img.naturalWidth * scale;
        const renderedH = img.naturalHeight * scale;
        const offsetX = (displayW - renderedW) / 2;
        const offsetY = (displayH - renderedH) / 2;

        let cw = renderedW * 0.85;
        let ch = cw / options.aspectRatio;
        if (ch > renderedH * 0.85) {
          ch = renderedH * 0.85;
          cw = ch * options.aspectRatio;
        }
        let cx = offsetX + (renderedW - cw) / 2;
        let cy = offsetY + (renderedH - ch) / 2;

        function updateCropRect() {
          cropWindow.style.left = `${cx}px`;
          cropWindow.style.top = `${cy}px`;
          cropWindow.style.width = `${cw}px`;
          cropWindow.style.height = `${ch}px`;
        }
        updateCropRect();

        let dragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let dragOrigCX = 0;
        let dragOrigCY = 0;

        cropWindow.addEventListener("mousedown", (e) => {
          dragging = true;
          dragStartX = e.clientX;
          dragStartY = e.clientY;
          dragOrigCX = cx;
          dragOrigCY = cy;
          cropWindow.style.cursor = "grabbing";
          e.preventDefault();
        });

        document.addEventListener("mousemove", (e) => {
          if (!dragging) return;
          const dx = e.clientX - dragStartX;
          const dy = e.clientY - dragStartY;
          let newCX = dragOrigCX + dx;
          let newCY = dragOrigCY + dy;
          newCX = Math.max(offsetX, Math.min(offsetX + renderedW - cw, newCX));
          newCY = Math.max(offsetY, Math.min(offsetY + renderedH - ch, newCY));
          cx = newCX;
          cy = newCY;
          updateCropRect();
        });

        document.addEventListener("mouseup", () => {
          if (dragging) {
            dragging = false;
            cropWindow.style.cursor = "move";
          }
        });

        cropContainer.appendChild(imageEl);
        cropContainer.appendChild(cropWindow);

        const info = document.createElement("p");
        info.className = "text-[11px] text-slate-500 px-6 pt-3 pb-1";
        info.textContent = `Drag the crop area to frame your image. Aspect ratio: ${options.aspectRatio.toFixed(2)}:1`;

        const footer = document.createElement("div");
        footer.className = "flex items-center justify-end gap-3 px-6 pb-5 pt-3 border-t border-slate-200";

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer border border-slate-200";
        cancelBtn.textContent = "Cancel";
        cancelBtn.onclick = () => { document.body.removeChild(overlay); reject(new Error("Cancelled")); };

        const cropBtn = document.createElement("button");
        cropBtn.className = "px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm";
        cropBtn.textContent = "Crop & Save";
        cropBtn.onclick = () => {
          const canvas = document.createElement("canvas");
          const naturalCropX = Math.round((cx - offsetX) / scale);
          const naturalCropY = Math.round((cy - offsetY) / scale);
          const naturalCropW = Math.round(cw / scale);
          const naturalCropH = Math.round(ch / scale);

          canvas.width = naturalCropW;
          canvas.height = naturalCropH;

          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(
            img,
            naturalCropX,
            naturalCropY,
            naturalCropW,
            naturalCropH,
            0,
            0,
            naturalCropW,
            naturalCropH
          );

          canvas.toBlob((blob) => {
            if (blob) {
              document.body.removeChild(overlay);
              resolve(blob);
            } else {
              document.body.removeChild(overlay);
              reject(new Error("Failed to crop image"));
            }
          }, "image/jpeg", 0.92);
        };

        footer.appendChild(cancelBtn);
        footer.appendChild(cropBtn);

        modal.appendChild(header);
        modal.appendChild(cropContainer);
        modal.appendChild(info);
        modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(options.file);
  });
}
