"use client";

import { useEffect, useRef, useState } from "react";
import { deleteOfferInPlaceAction } from "../actions";

const PANEL_SRC: Record<string, (id: string) => string> = {
  offer: (id) => `/admin/oferte/${id}`,
  destination: (id) => `/admin/destinatii/${id}`,
  campaign: (id) => `/admin/campanii/${id}`,
  section: (id) => `/admin/home/${id}`,
};

export function EditorShell() {
  const [path, setPath] = useState("/");
  const [panel, setPanel] = useState<{ type: string; id: string; src: string; publicHref: string } | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.data?.source !== "hg-edit") return;
      if (e.data.kind === "nav") setPath(e.data.path);
      if (e.data.kind === "edit") {
        const build = PANEL_SRC[e.data.type];
        if (build) setPanel({ type: e.data.type, id: e.data.id, src: build(e.data.id), publicHref: e.data.href ?? path });
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [path]);

  return (
    <div className="editor-shell">
      <div className="editor-topbar">
        <span className="editor-path">{path}</span>
        <button type="button" onClick={() => iframeRef.current?.contentWindow?.location.reload()}>
          Reîmprospătează
        </button>
      </div>
      <iframe ref={iframeRef} src="/?hg-edit=1" className="editor-iframe" title="Previzualizare site" />
      {panel && (
        <div className="editor-modal-backdrop" onClick={() => setPanel(null)}>
          <div className="editor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="editor-modal-bar">
              <div className="editor-modal-bar-left">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    if (iframeRef.current) iframeRef.current.src = `${panel.publicHref}${panel.publicHref.includes("?") ? "&" : "?"}hg-edit=1`;
                    setPanel(null);
                  }}
                >
                  Accesează ↗
                </button>
                {panel.type === "offer" && (
                  <form
                    action={deleteOfferInPlaceAction.bind(null, panel.id)}
                    onSubmit={(e) => {
                      if (!confirm("Ștergi definitiv această ofertă?")) { e.preventDefault(); return; }
                      setPanel(null);
                      iframeRef.current?.contentWindow?.location.reload();
                    }}
                  >
                    <button className="btn btn-danger btn-sm" type="submit">Șterge oferta</button>
                  </form>
                )}
              </div>
              <button type="button" className="editor-panel-close" onClick={() => setPanel(null)}>✕</button>
            </div>
            <iframe src={panel.src} className="editor-panel-iframe" title="Editare" />
          </div>
        </div>
      )}
    </div>
  );
}
