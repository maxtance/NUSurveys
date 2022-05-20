import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import CreateSurvey from "./components/createSurvey/CreateSurvey";
import MainPage from "./components/MainPage/MainPage";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<MainPage />}></Route>
        <Route path='/create-survey' element={<CreateSurvey />}></Route>
      </Routes>
    </Router>
  );
}

export default App;