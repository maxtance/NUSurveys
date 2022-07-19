import styles from "./MySurveysPage.module.css";
import Navbar from "../navbar/Navbar";
import SearchBar from "../SearchBar/SearchBar";
import SurveyCard from "../SurveyCard/SurveyCard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseClient } from "../../lib/client";
import createSurveyIcon from "../../assets/create_survey_img.png";
import { useAuth } from "../../contexts/Auth";
import { isSurveyClosed } from "../../helpers/helperFunctions";

function MySurveys() {
  const { userInfo } = useAuth();
  const userId = userInfo.id;

  const [numSurveys, setNumSurveys] = useState(0);
  // stores the data fetched in MySurveys which is not edited
  const [uneditedSurveys, setUneditedSurveys] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Last created");
  const [view, setView] = useState("View all");
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSortBy(sortValue) {
    setSortBy(sortValue);
    if (sortValue === "Last created") {
      surveys.sort((a, b) => b.id - a.id);
    } else if (sortValue === "First created") {
      surveys.sort((a, b) => a.id - b.id);
    } else {
      surveys.sort((a, b) => b.last_updated.localeCompare(a.last_updated));
    }
  }

  function handleView(viewValue) {
    setView(viewValue);
    let currDate = new Date();
    let todaysDate = `${currDate.getFullYear()}-${String(
      currDate.getMonth() + 1
    ).padStart(2, 0)}-${String(currDate.getDate()).padStart(2, 0)}`;

    if (viewValue === "View all") {
      setSurveys(uneditedSurveys);
    } else if (viewValue === "View ongoing") {
      const notClosedSurveys = uneditedSurveys.filter(
        (survey) => survey.closing_date >= todaysDate
      );
      setSurveys(notClosedSurveys);
    } else {
      const closedSurveys = uneditedSurveys.filter(
        (survey) => survey.closing_date < todaysDate
      );
      setSurveys(closedSurveys);
    }
  }

  const fetchMySurveys = async () => {
    let { data: surveys, error } = await supabaseClient
      .from("surveys")
      .select("*")
      .order("id", { ascending: false })
      .eq("published_by", userId)
      .eq("is_deleted", false);

    if (error) {
      navigate("/error");
    }

    //searching logic
    if (keyword != "") {
      //console.log(keyword);
      surveys = surveys.filter((survey) => {
        return (
          survey.title.toLowerCase().includes(keyword.toLowerCase()) ||
          survey.description.toLowerCase().includes(keyword.toLowerCase())
        );
      });
      //console.log(surveys);
    }

    setNumSurveys(
      surveys.filter((survey) => !isSurveyClosed(survey.closing_date)).length
    );

    setUneditedSurveys(surveys);
    setSurveys(surveys);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchMySurveys();
  }, [userInfo, keyword]);

  const renderMySurveys = () => {
    return surveys.map((survey) => {
      return <SurveyCard survey={survey} />;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.searchBarForm}>
          <SearchBar setKeyword={setKeyword} />
        </div>
        <div className="row pb-3">
          <div className={`col-md-4 ${styles.pageHeader}`}>
            You have{" "}
            <span className={styles.numSurveysColor}>{numSurveys}</span> Ongoing
            Survey{numSurveys > 1 ? "s" : ""}
          </div>
          <div className="offset-md-3 col-md-3 offset-xl-4 col-xl-2 dropdown text-end">
            <span className={styles.sortBy}>Sort by:</span>
            <button
              className={`btn dropdown-toggle btn-sm ${styles.btnWhite}`}
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortBy}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleSortBy("Last created")}
                >
                  Last created
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleSortBy("First created")}
                >
                  First created
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleSortBy("Last edited")}
                >
                  Last edited
                </button>
              </li>
            </ul>
          </div>
          <div className="col-md-2 dropdown text-end">
            <span className={styles.sortBy}>View:</span>
            <button
              className={`btn dropdown-toggle btn-sm ${styles.btnWhite}`}
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {view}
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleView("View all")}
                >
                  View all
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleView("View ongoing")}
                >
                  View ongoing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleView("View closed")}
                >
                  View closed
                </button>
              </li>
            </ul>
          </div>
        </div>
        {isLoading ? (
          <p>
            <span class="spinner-border spinner-border-sm" role="status" />{" "}
            Loading your surveys...
          </p>
        ) : (
          <div className={styles.mySurveys}>
            <MakeNewSurvey />
            {renderMySurveys()}
          </div>
        )}
      </div>
    </div>
  );
}

function MakeNewSurvey() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={styles.surveyCard}
      onClick={() => navigate("/mysurveys/create-survey")}
    >
      <img className={styles.surveyCardImage} src={createSurveyIcon} alt="" />
      <p className={styles.surveyCardText}>Create new survey</p>
    </button>
  );
}

export default MySurveys;
