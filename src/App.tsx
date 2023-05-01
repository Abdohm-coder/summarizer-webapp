import "./App.css";
import Demo from "./components/demo";
import Hero from "./components/hero";

function App() {
  return (
    <main>
      <div className="main">
        <div className="gradient"></div>
      </div>

      <div className="app">
        <Hero />
        <Demo />
      </div>
    </main>
  );
}

export default App;
