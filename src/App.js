import "./App.css";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <div className="App">
      <header>
        <Navbar />
      </header>

      <main>
        <article></article>
        <aside>
          <Sidebar />
        </aside>
      </main>

      <footer></footer>
    </div>
  );
}

export default App;
