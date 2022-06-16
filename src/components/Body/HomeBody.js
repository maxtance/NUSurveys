import styles from "./HomeBody.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../lib/client";
import SurveyCard from "../SurveyCard/SurveyCard";
import useFetchUser from "../../helpers/useFetchUser";

function HomeBody() {
  const { userInfo, userInfoIsLoading } = useFetchUser();
  const userId = userInfo?.id;

  const [numSurveys, setNumSurveys] = useState(0);
  const [surveys, setSurveys] = useState([]);
  const [surveysIsLoading, setSurveysIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Newest survey");

  useEffect(() => {
    fetchSurveyListings();
  }, [userInfo]);

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
    if (!userInfoIsLoading) {
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

      // console.log(surveys);

      setNumSurveys(surveys.length);
      setSurveys(surveys);
      setSurveysIsLoading(false);
    } else {
      setSurveysIsLoading(true);
    }
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
          <div className={styles.pageHeader}>
            Showing <span className={styles.numSurveysColor}>{numSurveys}</span>{" "}
            Survey Listing
            {numSurveys > 1 ? "s" : ""}
          </div>
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

export default HomeBody;
