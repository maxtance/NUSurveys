import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/Auth";
import { supabaseClient } from "../../lib/client";
import { useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./CompletedSurveys.module.css";
import { isSurveyClosed } from "../../helpers/helperFunctions";
import { SurveyTable } from "../SurveyTable/SurveyTable";

function CompletedSurveys() {
  return (
    <>
      <Navbar />
      <CompletedSurveysBody />
    </>
  );
}

function CompletedSurveysBody() {
  const navigate = useNavigate();
  const { completedSurveys, isLoading } = FetchCompletedSurveys();
  const numCompletedSurveys = completedSurveys.length;

  if (isLoading) {
    return <LoadingPage />;
  }

  if (numCompletedSurveys === 0) {
    return <NoCompletedSurveysBody navigate={navigate} />;
  } else {
    return (
      <HaveCompletedSurveysBody
        completedSurveys={completedSurveys}
        navigate={navigate}
      />
    );
  }
}

function NoCompletedSurveysBody(props) {
  const { navigate } = props;
  return (
    <div className={styles.bodyContainer}>
      <p className={styles.noSurveysHeader}>
        You have not completed any surveys.
      </p>{" "}
      <p>
        See available surveys{" "}
        <span className={styles.toHomeLink} onClick={() => navigate("/home")}>
          here
        </span>
        .
      </p>
    </div>
  );
}

function HaveCompletedSurveysBody(props) {
  let { completedSurveys, navigate } = props;
  const [keyword, setKeyword] = useState("");

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.searchBar}>
        <SearchBar setKeyword={setKeyword} />
      </div>
      <div className={styles.pageHeader}>
        My <span className={styles.colouredHeader}>Completed</span> Surveys
      </div>
      <div className={styles.surveyTableContainer}>
        <SurveyTable keyword={keyword} completedSurveys={completedSurveys} />
      </div>
    </div>
  );
}

function LoadingPage() {
  return (
    <div className="container-fluid">
      <p>
        <span class="spinner-border spinner-border-sm" role="status" />{" "}
        Loading...
      </p>
    </div>
  );
}

function FetchCompletedSurveys() {
  const { userInfo } = useAuth();
  const userId = userInfo.id;

  const [completedSurveys, setCompletedSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      let { data: completed_surveys, error } = await supabaseClient
        .from("completed_surveys")
        .select(
          `
        survey_id,
        date_added, 
        surveyTitle: surveys(title),
        surveyClosingDate: surveys(closing_date)
      `
        )
        .eq("user_id", userId)
        .eq("surveys.is_deleted", false)
        .order("id", { ascending: false });
      if (error) {
        navigate("/error");
      }
      setCompletedSurveys(completed_surveys);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return { completedSurveys, isLoading };
}

export default CompletedSurveys;
