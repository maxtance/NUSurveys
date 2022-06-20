import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage/HomePage";
import MySurveysPage from "./components/MySurveysPage/MySurveysPage";
import CreateSurvey from "./components/createSurvey/CreateSurvey";
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import { AuthProvider } from "./contexts/Auth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ThankYou from "./components/thankYou/ThankYou";
import Welcome from "./components/Welcome/Welcome";
import GeneralMessage from "./components/GeneralMessage/GeneralMessage";
import { useEffect } from "react";
import SurveyInfo from "./components/SurveyInfo/SurveyInfo";
import WishlistPage from "./components/WishlistPage/WishlistPage";

function App() {
  const errorTitle = "Oops!";
  const doubleSignUpMessage =
    "It appears that you have already confirmed your email. \
    Click on the button below to sign in directly.";

  const navigate = useNavigate();

  useEffect(() => {
    if (
      window.location.hash ==
      "#error_code=404&error_description=Confirmation+Token+not+found"
    ) {
      navigate("/error");
    }
  }, []);

  return (
    <div id="body" className="App">
      <AuthProvider>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mysurveys"
            element={
              <ProtectedRoute>
                <MySurveysPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mysurveys/create-survey"
            element={
              <ProtectedRoute>
                <CreateSurvey />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route
            path="/error"
            element={
              <GeneralMessage
                title={errorTitle}
                message={doubleSignUpMessage}
              />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/surveys/:surveyId" element={<SurveyInfo />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
