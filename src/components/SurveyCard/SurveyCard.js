import styles from "./SurveyCard.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import bookmarkEmpty from "../../assets/bookmark/bookmark_empty.png";
import bookmarkFilled from "../../assets/bookmark/bookmark_filled.png";
import { supabaseClient } from "../../lib/client";
import useBookmark from "../../helpers/useBookmark";

function SurveyCard(props) {
  const userId = 1; // dummy userId
  const navigate = useNavigate();

  const [isBookmarked, setAndUpdateIsBookmarked] = useBookmark(
    props.survey.isWishlisted,
    props.survey.id,
    userId
  );

  function toggleBookmark() {
    setAndUpdateIsBookmarked();
  }

  return (
    <div className={styles.surveyCard}>
      <div className={styles.surveyCard__body}>
        {props.survey.published_by !== userId ? (
          <input
            type="image"
            className={styles.surveyCard__bookmark}
            src={isBookmarked ? bookmarkFilled : bookmarkEmpty}
            onClick={toggleBookmark}
          ></input>
        ) : (
          <></>
        )}

        <h2 className={styles.surveyCard__title}>{props.survey.title}</h2>
        <p className={styles.surveyCard__description}>
          {props.survey.description}
        </p>
      </div>
      <button
        className={styles.surveyCard__btn}
        onClick={() => navigate("/surveys/" + props.survey.id)}
      >
        More information
      </button>
    </div>
  );
}

export default SurveyCard;
