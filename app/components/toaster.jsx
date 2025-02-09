import { Toast, Frame } from "@shopify/polaris";
import { useEffect, useState } from "react";

export function Toaster({ toasterMessage, setToasterMessage }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (toasterMessage) {
      setActive(true);
      setTimeout(() => {
        setActive(false);
        setToasterMessage(null); 
      }, 3000); 
    }
  }, [toasterMessage, setToasterMessage]);

  return (
    <Frame>
      {active && <Toast content={toasterMessage} onDismiss={() => setActive(false)} />}
    </Frame>
  );
}
