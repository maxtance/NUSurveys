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
  const [isUpdating, setIsUpdating] = useState(true);
  const [oldFields, setOldFields] = useState({});
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
    return data;
  };

  const initEthnicityEligibility = async () => {
    const result = await fetchEthnicityEligibility();
    surveyInfo = { ...surveyInfo, ethnicityEligibility: {} };
    if (result.length !== 4) {
      result.map(async (record) => {
        const { data } = await supabaseClient
          .from("ethnicities")
          .select("id")
          .eq("name", record.ethnicities.name);
        setEthnicityEligibility({
          ...ethnicityEligibility,
          [record.ethnicities.name]: true,
        });
        surveyInfo = {
          ...surveyInfo,
          ethnicityEligibility: {
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

  const cleanUpdatedFields = async () => {
    //TODO: update survey listing logic
    let tempState = { ...updatedFields };
    Object.keys(updatedFields).forEach((key) => {
      if (key in oldFields && updatedFields[key] == oldFields[key]) {
        delete tempState[key];
      } else if (!(key in oldFields)) {
        //checkbox for ethnicity was originally checked
        let capitalisedKey = key.charAt(0).toUpperCase() + key.slice(1);
        if (capitalisedKey in oldFields.ethnicityEligibility) {
          if (
            updatedFields[key] == oldFields.ethnicityEligibility[capitalisedKey]
          ) {
            delete tempState[key];
          }
        } else {
          //checkbox was not originally checked
          if (!updatedFields[key]) {
            delete tempState[key];
          }
        }
      }
      setUpdatedFields(tempState);
      setIsUpdating(false);
    });
  };

  const onFormSubmit = async (e) => {
    //e.preventDefault();
    await cleanUpdatedFields();
    //navigate("/mysurveys");
  };

  const updateDatabaseRecords = async () => {
    console.log(updatedFields);
    console.log(oldFields);
    //update title, desc, link, cat_id in surveys first
    Object.keys(updatedFields).forEach(async (key) => {
      if (
        key === "title" ||
        key === "description" ||
        key === "link" ||
        key === "category_id" ||
        key === "closing_date" ||
        key === "other_eligibility_requirements"
      ) {
        const { data, error } = await supabaseClient
          .from("surveys")
          .update({ [key]: updatedFields[key] })
          .match({ id: surveyId });
        if (error) {
          console.log(error);
        } else {
          console.log(`Updated ${key} successfully`);
        }
      }
      //update remuneration info
      if (key === "remuneration_id") {
        if (updatedFields[key] === "3") {
          const { data, error } = await supabaseClient
            .from("surveys")
            .update({
              remuneration_id: 1,
            })
            .match({ id: surveyId });
        } else {
          if ("remunerationAmount" in updatedFields) {
            const { count } = await supabaseClient
              .from("remunerations")
              .select("id", { count: "exact", head: true });

            const { data: remunerationRecord, error } = await supabaseClient
              .from("remunerations")
              .select()
              .eq("category_id", updatedFields[key])
              .eq("amount", updatedFields["remunerationAmount"]);

            //no existing remuneration record found. add to remunerations table
            if (remunerationRecord.length === 0) {
              const { error } = await supabaseClient
                .from("remunerations")
                .insert({
                  id: count + 1,
                  category_id: updatedFields[key],
                  amount: updatedFields["remunerationAmount"],
                });

              const { data } = await supabaseClient
                .from("surveys")
                .update({
                  remuneration_id: count + 1,
                })
                .match({ id: surveyId });
            } else {
              const { data } = await supabaseClient
                .from("surveys")
                .update({
                  remuneration_id: remunerationRecord[0].id,
                })
                .match({ id: surveyId });
            }
          } else {
            const { count } = await supabaseClient
              .from("remunerations")
              .select("id", { count: "exact", head: true });

            const { data: remunerationRecord, error } = await supabaseClient
              .from("remunerations")
              .select()
              .eq("category_id", updatedFields[key])
              .eq("amount", oldFields["remunAmount"].amount);

            //no existing remuneration record found. add to remunerations table
            if (remunerationRecord.length === 0) {
              const { error } = await supabaseClient
                .from("remunerations")
                .insert({
                  id: count + 1,
                  category_id: updatedFields[key],
                  amount: oldFields["remunAmount"].amount,
                });

              const { data } = await supabaseClient
                .from("surveys")
                .update({
                  remuneration_id: count + 1,
                })
                .match({ id: surveyId });
            } else {
              const { data } = await supabaseClient
                .from("surveys")
                .update({
                  remuneration_id: remunerationRecord[0].id,
                })
                .match({ id: surveyId });
            }
          }
        }
        console.log("Updated remuneration information successfully");
      }

      if (key === "remunerationAmount") {
        //console.log(oldFields["remunType"].category_id);
        const { count } = await supabaseClient
          .from("remunerations")
          .select("id", { count: "exact", head: true });

        const { data: remunerationRecord, error } = await supabaseClient
          .from("remunerations")
          .select()
          .eq("category_id", oldFields["remuneration_id"])
          .eq("amount", updatedFields["remunerationAmount"]);

        console.log(remunerationRecord);

        //no existing remuneration record found. add to remunerations table
        if (remunerationRecord.length === 0) {
          const { error } = await supabaseClient.from("remunerations").insert({
            id: count + 1,
            category_id: oldFields["remuneration_id"],
            amount: updatedFields["remunerationAmount"],
          });

          const { data } = await supabaseClient
            .from("surveys")
            .update({
              remuneration_id: count + 1,
            })
            .match({ id: surveyId });
        } else {
          const { data } = await supabaseClient
            .from("surveys")
            .update({
              remuneration_id: remunerationRecord[0].id,
            })
            .match({ id: surveyId });
        }
        console.log("Updated remuneration amount successfully");
      }

      //update gender eligibility
      if (key === "genderEligibility") {
        const { data, error } = await supabaseClient
          .from("gender_eligibilities")
          .update({
            gender_eligibility_id: updatedFields[key],
          })
          .match({ survey_id: surveyId });

        if (!error) {
          console.log("Updated gender eligibility successfully");
        }
      }

      //update age eligibility
      if (key === "minAge" || key === "maxAge") {
        const { data, error } = await supabaseClient
          .from("age_eligibilities")
          .update({
            [key === "minAge" ? "min_age" : "max_age"]: updatedFields[key],
          })
          .match({ survey_id: surveyId });

        if (!error) {
          console.log("Updated age eligibility successfully");
        }
      }

      //update ethnicity eligibility
      if (
        key == "chinese" ||
        key === "malay" ||
        key === "indian" ||
        key === "others"
      ) {
        const { data: ethnicity } = await supabaseClient
          .from("ethnicities")
          .select()
          .ilike("name", key);
        if (updatedFields[key]) {
          const { data, error } = await supabaseClient
            .from("ethnicity_eligibilities")
            .insert([
              {
                survey_id: surveyId,
                ethnicity_id: ethnicity[0].id,
              },
            ]);
        } else {
          const { data, error } = await supabaseClient
            .from("ethnicity_eligibilities")
            .delete()
            .match({ survey_id: surveyId, ethnicity_id: ethnicity[0].id });
        }
        console.log("Updated ethnicity eligibility requirements");
      }
    });

    setUpdatedFields({});
    //update last_updated field
    //console.log(updatedFields);
  };

  useEffect(() => {
    if (!isUpdating) {
      updateDatabaseRecords();
      navigate("/mysurveys");
    }
  }, [isUpdating]);

  const handleInputChange = (e, edit) => {
    const { name, value } = e.target;
    setSurvey({ ...survey, [name]: value });
    if (edit) {
      setUpdatedFields({ ...updatedFields, [name]: value });
    }
  };

  const handleGenderInputChange = (e, edit) => {
    const { value } = e.target;
    setGenderEligibility(value);
    if (edit) {
      setUpdatedFields({ ...updatedFields, ["genderEligibility"]: value });
    }
  };

  const handleMinAgeInputChange = (e, edit) => {
    const { value } = e.target;
    setMinAge(value);
    if (edit) {
      setUpdatedFields({ ...updatedFields, ["minAge"]: value });
    }
  };

  const handleMaxAgeInputChange = (e, edit) => {
    const { value } = e.target;
    setMaxAge(value);
    if (edit) {
      setUpdatedFields({ ...updatedFields, ["maxAge"]: value });
    }
  };

  const handleAmountInputChange = (e, edit) => {
    const { value } = e.target;
    setRemunerationAmount(value);
    if (edit) {
      setUpdatedFields({ ...updatedFields, ["remunerationAmount"]: value });
    }
  };

  const handleCheckboxChange = (e, edit) => {
    const { name, checked } = e.target;
    setEthnicityEligibility({ ...ethnicityEligibility, [name]: checked });
    if (edit) {
      setUpdatedFields({ ...updatedFields, [name]: checked });
    }
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
        others: "Others" in surveyInfo.ethnicityEligibility,
      };
      reset({ ...defaultValues });
      setOldFields(surveyInfo);
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
            edit={true}
            source={updatedFields}
            setUpdatedFields={setUpdatedFields}
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
