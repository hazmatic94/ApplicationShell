import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "@joker/design-system/styles.css";
import "@joker/design-system/styles/coin-receiver.css";

createRoot(document.getElementById("root")).render(<App />);
