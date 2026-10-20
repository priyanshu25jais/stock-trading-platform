import React from "react";

import { useTrading } from "./GeneralContext";

const Toast = () => {
  const { toast, dismissToast } = useTrading();
  return (
    <div className="toast-region" aria-live="polite" role="status">
      {toast && (
        <div className={`toast toast-${toast.kind}`} key={toast.id}>
          <span>{toast.message}</span>
          <button type="button" className="toast-close" onClick={dismissToast} aria-label="Dismiss message">
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Toast;
