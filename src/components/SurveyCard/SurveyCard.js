import styles from "./SurveyCard.module.css";
import { useNavigate } from "react-router-dom";
import bookmarkEmpty from "../../assets/bookmark/bookmark_empty.png";
import bookmarkFilled from "../../assets/bookmark/bookmark_filled.png";
import useBookmark from "../../helpers/useBookmark";
import { isSurveyClosed } from "../../helpers/helperFunctions";

function SurveyCard(props) {
  const userInfo = props.userInfo;
  const userId = userInfo?.id;
  const navigate = useNavigate();

  const [isBookmarked, setAndUpdateIsBookmarked] = useBookmark(
    props.survey.isWishlisted,
    props.survey.id
  );

  function toggleBookmark() {
    setAndUpdateIsBookmarked();
  }

  return (
    <div className={styles.surveyCard}>
      <div className={styles.surveyCard__body}>
        {userId && props.survey.published_by !== userId ? (
          <input
            type="image"
            className={styles.surveyCard__bookmark}
            src={isBookmarked ? bookmarkFilled : bookmarkEmpty}
            onClick={toggleBookmark}
          ></input>
        ) : (
          <></>
        )}

        <h2 className={styles.surveyCard__title}>
          {isSurveyClosed(props.survey.closing_date) ? (
            <span className={styles.closedTitle}>(CLOSED) </span>
          ) : (
            <></>
          )}
          {props.survey.title}
        </h2>
        <p className={styles.surveyCard__description}>
          {props.survey.description.trim().length === 0
            ? "No description provided by the publisher."
            : props.survey.description}
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
