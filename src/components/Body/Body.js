import styles from "./Body.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/client";
import SurveyCard from "../SurveyCard/SurveyCard";
import { useAuth } from "../../contexts/Auth";
import { isSurveyClosed } from "../../helpers/helperFunctions";

function Body(props) {
  const { userInfo } = useAuth();
  const userId = userInfo.id;

  const [numSurveys, setNumSurveys] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [surveysIsLoading, setSurveysIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Newest survey");

  useEffect(() => {
    fetchSurveyListings();
  }, []);

  function handleSortBy(sortValue) {
    setSortBy(sortValue);
    if (sortValue === "Newest survey") {
      surveys.sort((a, b) => b.id - a.id);
    } else if (sortValue === "Oldest survey") {
      surveys.sort((a, b) => a.id - b.id);
    } else {
      surveys.sort((a, b) => a.closing_date.localeCompare(b.closing_date));
    }
  }

  const fetchSurveyListings = async () => {
    setSurveysIsLoading(true);
    const { data: surveys, error: surveysError } = await supabaseClient
      .from("surveys")
      .select("*")
      .neq("published_by", userId)
      .order("id", { ascending: false });

    if (surveysError) {
      console.log(surveysError);
    }
    const { data: wishlists, error: wishlistsError } = await supabaseClient
      .from("wishlisted_surveys")
      .select("*")
      .eq("user_id", userId);

    if (wishlistsError) {
      console.log(wishlistsError);
    }

    surveys.map((survey) => {
      const match = wishlists.filter(
        (wishlist) => wishlist.survey_id === survey.id
      );
      if (match.length === 0) {
        survey.isWishlisted = false;
      } else {
        survey.isWishlisted = true;
      }
      return survey;
    });

    // Filter survey listings based on Page
    if (props.page === "Home") {
      // Filter surveys based on Home page criteria
      const newSurveys = surveys.filter(
        (survey) => !isSurveyClosed(survey.closing_date)
      );
      setNumSurveys(newSurveys.length);
      setSurveys(newSurveys);
    } else if (props.page === "Wishlist") {
      // Filter surveys based on Wishlist page criteria
      const newSurveys = surveys.filter((survey) => survey.isWishlisted);
      // console.log(newSurveys);
      setNumSurveys(newSurveys.length);
      setSurveys(newSurveys);
    }

    setSurveysIsLoading(false);
  };

  const renderSurveys = () => {
    return surveys.map((survey) => {
      return <SurveyCard survey={survey} userInfo={userInfo} />;
    });
  };

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.searchBarForm}>
          <SearchBar />
        </div>
        <div className="d-flex justify-content-between pb-3">
          {props.page === "Home" ? (
            <div className={styles.pageHeader}>
              Showing{" "}
              <span className={styles.numSurveysColor}>{numSurveys}</span>{" "}
              Survey Listing
              {numSurveys > 1 ? "s" : ""}
            </div>
          ) : (
            <div className={styles.pageHeader}>
              You have{" "}
              <span className={styles.numSurveysColor}>{numSurveys}</span>{" "}
              Survey
              {numSurveys === 1 ? " " : "s "}
              in your Wishlist
            </div>
          )}
          <div className="dropdown">
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
                  class="dropdown-item"
                  onClick={() => handleSortBy("Newest survey")}
                >
                  Newest survey
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  onClick={() => handleSortBy("Oldest survey")}
                >
                  Oldest survey
                </button>
              </li>
              <li>
                <button
                  type="button"
                  class="dropdown-item"
                  onClick={() => handleSortBy("Closing first")}
                >
                  Closing first
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {surveysIsLoading ? (
        <div>Loading surveys...</div>
      ) : (
        <div className={styles.surveyListings}>{renderSurveys()}</div>
      )}
    </div>
  );
}

export default Body;
