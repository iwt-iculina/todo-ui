import React, { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

interface CustomToastProps {
  message: string;
  duration?: number;
  variant?: string;
}

function CustomToast({
  message,
  duration = 3000,
  variant = "info",
}: CustomToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!show) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        textAlign: "center",
      }}
    >
      <Toast
        onClose={() => setShow(false)}
        autohide
        delay={duration}
        bg={variant}
      >
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );
}

export default CustomToast;