import { render } from "preact";
import Synth from "./components/Synth";
import "./style.css";

export function App() {
  return <Synth />;
}

render(<App />, document.getElementById("app"));
