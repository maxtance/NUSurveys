import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import MySurveysPage from "./components/MySurveys/MySurveysPage";
import CreateSurvey from "./components/createSurvey/CreateSurvey";
import SurveyInfo from "./components/SurveyInfo/SurveyInfo";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mysurveys" element={<MySurveysPage />} />
          <Route
            path="/mysurveys/create-survey"
            element={<CreateSurvey />}
          ></Route>
          <Route path="/surveys/:surveyId" element={<SurveyInfo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
