import { useState } from "react";
import DeskScene from "./components/DeskScene";
import ModelQueryPanel from "./components/ModelQueryPanel";

export default function App() {
  const [notifications] = useState([]);

  return (
    <main className="app-shell">
      <DeskScene notifications={notifications}>
        <ModelQueryPanel />
      </DeskScene>
    </main>
  );
}
