import { useForm } from "react-hook-form";
import { supabaseClient } from "../../lib/client";
import { fetchSurveyInfo } from "../SurveyInfo/SurveyInfo";
import { useAuth } from "../../contexts/Auth";
import { useEffect, useState } from "react";
import styles from "./EditSurvey.module.css";
import CreateSurveyForm from "../createSurveyForm/CreateSurveyForm";
import { useNavigate } from "react-router-dom";
import NavBarWrapper from "../../helpers/NavBarWrapper";

function EditSurvey() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  let surveyId = 7; //dummy survey id
  const navigate = useNavigate();
  let surveyInfo = {};
  const { userInfo } = useAuth();

  const userId = userInfo?.id;

  const [survey, setSurvey] = useState({
    title: surveyInfo.title,
    description: surveyInfo.description,
    link: surveyInfo.link,
    category_id: surveyInfo.category_id,
    remuneration_id: "",
    photo: surveyInfo.photo,
    closing_date: surveyInfo.closing_date,
    other_eligibility_requirements: surveyInfo.other_eligibility_requirements,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [updatedFields, setUpdatedFields] = useState({});

  const [ethnicityEligibility, setEthnicityEligibility] = useState({
    chinese: false,
    malay: false,
    indian: false,
    others: false,
  });
  const [genderEligibility, setGenderEligibility] = useState();
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const [remunerationType, setRemunerationType] = useState();
  const [remunerationAmount, setRemunerationAmount] = useState();
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fetchEthnicityEligibility = async () => {
    const { data, error } = await supabaseClient
      .from("ethnicity_eligibilities")
      .select("ethnicities(name)")
      .eq("survey_id", surveyId);
    console.log(data);
    return data;
  };

  const initEthnicityEligibility = async () => {
    const result = await fetchEthnicityEligibility();
    surveyInfo = { ...surveyInfo, "ethnicityEligibility" : {}}
    if (result.length !== 4) {
      result.map(async (record) => {
        const { data } = await supabaseClient
          .from("ethnicities")
          .select("id")
          .eq("name", record.ethnicities.name);
        console.log(data);
        setEthnicityEligibility({
          ...ethnicityEligibility,
          [record.ethnicities.name]: true,
        });
        surveyInfo = {
          ...surveyInfo,
          "ethnicityEligibility": {
            ...surveyInfo.ethnicityEligibility,
            [record.ethnicities.name]: true,
          },
        };
      });
    }
  };

  const fetchGenderEligibility = async () => {
    const { data } = await supabaseClient
      .from("gender_eligibilities")
      .select("gender_eligibility_id")
      .eq("survey_id", surveyId);
    return data[0];
  };

  const initGenderEligibility = async () => {
    const result = await fetchGenderEligibility();
    setGenderEligibility(result.gender_eligibility_id);
    surveyInfo = {
      ...surveyInfo,
      ["genderEligibility"]: result.gender_eligibility_id,
    };
  };

  const fetchAgeEligibility = async () => {
    const { data } = await supabaseClient
      .from("age_eligibilities")
      .select("min_age, max_age")
      .eq("survey_id", surveyId);
    return data[0];
  };

  const initAgeEligibility = async () => {
    const result = await fetchAgeEligibility();
    surveyInfo = {
      ...surveyInfo,
      ["minAge"]: result.min_age === 0 ? "" : result.min_age,
    };
    surveyInfo = {
      ...surveyInfo,
      ["maxAge"]: result.max_age === 0 ? "" : result.max_age,
    };
    setMinAge(result.min_age === 0 ? "" : result.min_age);
    setMaxAge(result.max_age === 0 ? "" : result.max_age);
  };

  const fetchRemunerationInfo = async () => {
    const { data, error } = await supabaseClient
      .from("remuneration_categories")
      .select("id")
      .eq("cat_name", surveyInfo.remunType.category_id.cat_name);
    return data[0];
  };

  const initRemunerationInfo = async () => {
    const result = await fetchRemunerationInfo();
    setRemunerationType(result.id);
    setRemunerationAmount(surveyInfo.remunAmount.amount);
    surveyInfo = { ...surveyInfo, ["remuneration_id"]: result.id };
  };

  const fetchSurveyType = async () => {
    const { data, error } = await supabaseClient
      .from("surveys")
      .select("category_id")
      .eq("id", surveyId);
    return data[0];
  };

  const initSurveyType = async () => {
    const result = await fetchSurveyType();
    surveyInfo = { ...surveyInfo, ["category_id"]: result.category_id };
  };

  const fetchImageInfo = async () => {
    if (surveyInfo.photo !== "") {
      setPreviewUrl(surveyInfo.photo);
    }
  };

  const updateSurveyListing = async () => {
    //TODO: update survey listing logic
  };

  const onFormSubmit = async (e) => {
    //e.preventDefault();
    await updateSurveyListing();
    navigate("/mysurveys");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
  };

  const handleGenderInputChange = (e) => {
    const { value } = e.target;
    setGenderEligibility(value);
  };

  const handleMinAgeInputChange = (e) => {
    const { value } = e.target;
    setMinAge(value);
  };

  const handleMaxAgeInputChange = (e) => {
    const { value } = e.target;
    setMaxAge(value);
  };

  const handleAmountInputChange = (e) => {
    const { value } = e.target;
    setRemunerationAmount(value);
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEthnicityEligibility({ ...ethnicityEligibility, [name]: checked });
  };

  const handleSideEffects = async () => {
    surveyInfo = await fetchSurveyInfo(surveyId);
    await initEthnicityEligibility();
    await initAgeEligibility();
    await initGenderEligibility();
    await initRemunerationInfo();
    await initSurveyType();
    await fetchImageInfo();
  };

  useEffect(() => {
    handleSideEffects().then(() => {
      console.log(surveyInfo);
      let defaultValues = {
        title: surveyInfo.title,
        description: surveyInfo.description,
        link: surveyInfo.link,
        category_id: surveyInfo.category_id,
        photo: surveyInfo.photo,
        remuneration_id: surveyInfo.remuneration_id,
        remunerationAmount: surveyInfo.remunAmount.amount,
        closing_date: surveyInfo.closing_date,
        other_eligibility_requirements:
          surveyInfo.other_eligibility_requirements,
        minAge: surveyInfo.minAge,
        maxAge: surveyInfo.maxAge,
        genderEligibility: surveyInfo.genderEligibility,
        chinese: "Chinese" in surveyInfo.ethnicityEligibility,
        malay: "Malay" in surveyInfo.ethnicityEligibility,
        indian: "Indian" in surveyInfo.ethnicityEligibility,
        others: "Others" in surveyInfo.ethnicityEligibility
      };
      reset({ ...defaultValues });
      setIsLoading(false);
    });
  }, []);

  return (
    <div id={styles.editSurveyWindow}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1 id={styles.editSurveyHeader}>Edit Survey</h1>
          <CreateSurveyForm
            survey={survey}
            genderEligibility={genderEligibility}
            ethnicityEligibility={ethnicityEligibility}
            minAge={minAge}
            maxAge={maxAge}
            remunerationAmount={remunerationAmount}
            image={image}
            setImage={setImage}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            handleGenderInputChange={handleGenderInputChange}
            handleMinAgeInputChange={handleMinAgeInputChange}
            handleMaxAgeInputChange={handleMaxAgeInputChange}
            handleAmountInputChange={handleAmountInputChange}
            register={register}
            errors={errors}
            watch={watch}
            other_eligibility_requirements={
              surveyInfo.other_eligibility_requirements
            }
          />
          <div class="row" id={styles.btnContainer}>
            <div class="col-lg-1 offset-lg-10 col-md-1 offset-md-9">
              <button
                class="btn"
                id={styles.resetBtn}
                type="reset"
                onClick={() => {
                  navigate("/mysurveys");
                }}
              >
                Cancel
              </button>
            </div>
            <div class="col-lg-1 col-md-2">
              <button
                class="btn"
                id={styles.updateBtn}
                onClick={handleSubmit(onFormSubmit)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBarWrapper(EditSurvey);
