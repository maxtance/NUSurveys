import CreateSurveyForm from "../createSurveyForm/CreateSurveyForm";
import NavBarWrapper from "../../helpers/NavBarWrapper";
import styles from "./CreateSurvey.module.css";

function CreateSurvey() {
    return (
        <div id={styles.createSurveyWindow}>
            <h1 id={styles.createSurveyHeader}>Create New Survey</h1>
            <CreateSurveyForm />
        </div>
    )
}

export default NavBarWrapper(CreateSurvey);