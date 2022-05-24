import { useState } from "react";
import CreateSurveyForm from "../createSurveyForm/CreateSurveyForm";
import NavBarWrapper from "../../helpers/NavBarWrapper";
import styles from "./CreateSurvey.module.css";

function CreateSurvey() {
    const setDefaultClosingDate = () => {
        const date = new Date()
        const closingDate = new Date(date.setMonth(date.getMonth() + 1))
        const closingDateMonth = closingDate.getMonth() + 1 < 10 ? '0' + (closingDate.getMonth() + 1) : closingDate.getMonth() + 1
        const closingDateDay = closingDate.getDate() < 10 ? '0' + closingDate.getDate() : closingDate.getDate()
        return closingDate.getFullYear() + "-" + closingDateMonth + "-" + closingDateDay;
    }

    const [ethnicityEligibility, setEthnicityEligibility] = useState({
        chinese: false,
        malay: false,
        indian: false,
        others: false
    })

    const [survey, setSurvey] = useState({
        title: "",
        description: "",
        link: "",
        surveyType: 1,
        remuneration: null,
        photo: "",
        closingDate: setDefaultClosingDate(),
        genderEligibility: 3,
        minAge: "",
        maxAge: "",
        ethnicityEligibility: ethnicityEligibility,
        otherRequirements: ""
    })

    const handleSubmit = (e) => {
        //TODO: Add survey listing to database (API)
        //addSurveyListing();
        //prints out survey responses for now
        e.preventDefault()
        console.log(JSON.stringify({
            title: survey.title,
            description: survey.description,
            link: survey.link,
            surveyType: survey.surveyType,
            remuneration: survey.remuneration,
            photo: survey.photo,
            closingDate: survey.closingDate,
            genderEligibility: survey.genderEligibility,
            minAge: survey.minAge,
            maxAge: survey.maxAge,
            ethnicityEligibility: survey.ethnicityEligibility,
            otherRequirements: survey.otherRequirements
        }))
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSurvey({ ...survey, [name]: value })
    }

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        console.log(name, checked);
        setEthnicityEligibility({ ...ethnicityEligibility, [name]: checked})
        console.log(ethnicityEligibility);
        setSurvey({ ...survey, [ethnicityEligibility]: ethnicityEligibility });
    }

    return (
        <div id={styles.createSurveyWindow}>
            <h1 id={styles.createSurveyHeader}>Create New Survey</h1>
            <button onClick={handleSubmit}>Submit</button> 
            <CreateSurveyForm survey={survey} ethnicityEligibility={ethnicityEligibility} handleInputChange={handleInputChange} handleCheckboxChange={handleCheckboxChange} handleSubmit={handleSubmit}/>
        </div>
    )
}

export default NavBarWrapper(CreateSurvey);