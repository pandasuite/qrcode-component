import PandaBridge from "pandasuite-bridge";
import QRCode from "qrcode";
import "./index.css";

let properties = null;
let canvas = null;
let currentText = "";

function generateQRCode() {
  if (!canvas || !properties) return;

  const text = properties.text || "";
  if (!text) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    return;
  }

  const size = Math.min(window.innerWidth, window.innerHeight);
  const isLandscape = window.innerWidth > window.innerHeight;
  canvas.style.width = isLandscape ? "auto" : "100%";
  canvas.style.height = isLandscape ? "100%" : "auto";

  const dpr = window.devicePixelRatio || 1;
  const resolution = Math.round(size * dpr);

  const options = {
    errorCorrectionLevel: properties.errorCorrectionLevel || "M",
    margin: properties.margin ?? 4,
    width: resolution,
    color: {
      dark: properties.darkColor || "#000000",
      light: properties.lightColor || "#FFFFFF",
    },
  };

  QRCode.toCanvas(canvas, text, options, (error) => {
    if (error) {
      PandaBridge.send("onError", { error: error.message });
      return;
    }
    currentText = text;
    PandaBridge.send("onGenerated", { text: currentText });
    PandaBridge.setQueryable({ text: currentText });
  });
}

function initComponent() {
  canvas = document.getElementById("qrcode");
  generateQRCode();
}

PandaBridge.init(() => {
  PandaBridge.onLoad((pandaData) => {
    properties = pandaData.properties;

    if (document.readyState === "complete") {
      initComponent();
    } else {
      document.addEventListener("DOMContentLoaded", initComponent, false);
    }
  });

  PandaBridge.onUpdate((pandaData) => {
    properties = pandaData.properties;
    generateQRCode();
  });

  PandaBridge.listen("setText", (args) => {
    if (args && args.text !== undefined) {
      properties.text = args.text;
      generateQRCode();
    }
  });

  PandaBridge.getSnapshotData(() => ({
    text: currentText,
  }));

  PandaBridge.setSnapshotData((pandaData) => {
    if (pandaData.data && pandaData.data.text) {
      properties.text = pandaData.data.text;
      generateQRCode();
    }
  });
});
