import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import MySurveysPage from "./components/MySurveys/MySurveysPage";
import CreateSurvey from "./components/createSurvey/CreateSurvey";
import Login from "./components/Login/Login";

function App() {
  return (
    <Router>
      <div id="body" className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mysurveys" element={<MySurveysPage />} />
          <Route
            path="/mysurveys/create-survey"
            element={<CreateSurvey />}
          ></Route>
          <Route path="/login" element={<Login />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
