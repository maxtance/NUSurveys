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
import EditSurvey from "./components/editSurvey/EditSurvey";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import CompletedSurveys from "./components/CompletedSurveys/CompletedSurveys";
import Profile from "./components/Profile/Profile";
import { supabaseClient } from "./lib/client";

function App() {
  const errorTitle = "Oops!";
  const doubleSignUpMessage =
    "It appears that you have already confirmed your email. \
    Click on the button below to sign in directly.";

  const navigate = useNavigate();

  useEffect(() => {
    let hash = window.location.hash;
    console.log(hash);
    if (
      hash ==
        "#error_code=404&error_description=Confirmation+Token+not+found" ||
      hash == "#error_code=404&error_description=User+not+found"
    ) {
      navigate("/error", {
        state: {
          title: "Oops!",
          message: "An unknown error occurred. Please try again.",
        },
      });
    } else if (hash != "") {
      const hashArr = hash
        .substring(1)
        .split("&")
        .map((param) => param.split("="));
      let type;
      let accessToken;
      for (const [key, value] of hashArr) {
        if (key === "type") {
          type = value;
        } else if (key === "access_token") {
          accessToken = value;
        }
      }
      if (type === "recovery" && accessToken) {
        navigate("/reset-password", {
          state: {
            type: type,
            access_token: accessToken,
          },
        });
      } else {
        //navigate("/home");
      }
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
            path="/mysurveys/published-surveys"
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
            path="/mysurveys/completed-surveys"
            element={
              <ProtectedRoute>
                <CompletedSurveys />
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
          <Route
            path="/mysurveys/edit-survey/"
            element={
              <ProtectedRoute>
                <EditSurvey />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/success" element={<GeneralMessage />} />
          <Route path="/error" element={<GeneralMessage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          {/* I think need to protect route */}
          <Route path="/surveys/:surveyId" element={<SurveyInfo />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
