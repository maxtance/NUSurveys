import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import MySurveysPage from "./components/MySurveys/MySurveysPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mysurveys" element={<MySurveysPage />} />
          <Route path='/create-survey' element={<CreateSurvey />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;