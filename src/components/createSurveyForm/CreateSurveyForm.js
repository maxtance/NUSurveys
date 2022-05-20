import DragAndDropImage from "../imageuploader/DragAndDropImage";
import styles from "./CreateSurveyForm.module.css";

function CreateSurveyForm({ survey, ethnicityEligibility, handleInputChange, handleCheckboxChange, handleSubmit }) {
  return (
      <form onSubmit = {handleSubmit}
            class="form-horizontal" id={styles.surveyForm}>
        <section>
          <h2 class={styles.sectionHeader}>Basic Information</h2>
          <div class="row">
            <div class="col-md-6">
              <div class={`form-group ${styles.formGroup}`}>
                <label for="title" class={styles.requiredField}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={survey.title}
                  onChange={handleInputChange}
                  class="form-control"
                  id={styles.title}
                  maxlength="250"
                  placeholder="No longer than 250 characters."
                />
              </div>

              <div class={`form-group ${styles.formGroup}`}>
                <label for="description">Short Description</label>
                <textarea
                  type="text"
                  name="description"
                  value={survey.description}
                  onChange={handleInputChange}
                  class="form-control"
                  id={styles.description}
                  placeholder="Enter a short description to let people know what your survey is about."
                />
              </div>

              <div class={`form-group ${styles.formGroup}`}>
                <label for="link" class={styles.requiredField}>
                  Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={survey.link}
                  onChange={handleInputChange}
                  class="form-control"
                  id={styles.link}
                  placeholder="Paste your URL here!"
                />
              </div>
            </div>

            <div class="col-md-5 offset-md-1">
              <label for="photo">Photo</label>
              <br />
              <small class="form-text text-muted">
                You may choose to upload a picture to go with your listing. This
                is not compulsory.
              </small>
              <DragAndDropImage />
            </div>
          </div>

          <div class="row">
            <div class="col-md-5">
              <div class={`form-group ${styles.formGroup}`}>
                <label for="survey-type" class={styles.requiredField}>
                  Type of Survey
                </label>
                <select required 
                  class="form-select" 
                  name="surveyType"
                  value={survey.surveyType}
                  onChange={handleInputChange}
                  id={styles.surveyType}>
                  <option disabled selected hidden>
                    Select the option that best fits your survey
                  </option>
                  <option value="1">Online survey</option>
                  <option value="2">Research study (remote)</option>
                  <option value="3">Research study (on-site)</option>
                </select>
              </div>

              <div class={`form-group ${styles.formGroup}`}>
                <label for="remuneration" class={styles.requiredField}>
                  Remuneration
                </label>
                <select required 
                  class="form-select" 
                  name="remuneration"
                  value={survey.remuneration}
                  onChange={handleInputChange}
                  id={styles.remuneration}>
                  <option disabled selected hidden>
                    How are you compensating your surveyees?
                  </option>
                  <option value="1">Cash</option>
                  <option value="2">Voucher</option>
                  <option value="null">No remuneration given</option>
                </select>
              </div>
            </div>
          </div>

          <div class={`form-group ${styles.formGroup}`}>
            <label for="closing-date" class={styles.requiredField}>
              Closing Date
            </label>
            <br></br>
            <input 
              type="date" 
              name="closingDate"
              value={survey.closingDate}
              onChange={handleInputChange}
              id={styles.closingDate}>
            </input>
          </div>
        </section>

        <section id={styles.section2}>
          <h2 class={styles.sectionHeader}>Survey Requirements</h2>
          <div class="row">
            <div class="col-md-4">
              <div class={`form-group ${styles.formGroup}`}>
                <label for="gender">Gender</label>
                <select 
                  class="form-select" 
                  name="genderEligibility"
                  value={survey.genderEligibility}
                  onChange={handleInputChange}
                  id={styles.gender}>
                  <option disabled selected hidden>
                    Seeking responses from...
                  </option>
                  <option value="1">Males only</option>
                  <option value="2">Females only</option>
                  <option value="3">No gender eligibility requirements</option>
                </select>
              </div>

              <div class={`form-group ${styles.formGroup}`}>
                <label for="min-age">Minimum Age</label>
                <br></br>
                <small class="form-text text-muted">
                  Leave blank if there is no min. age requirement
                </small>
                <br></br>
                <input
                  type="number"
                  name="minAge"
                  value={survey.minAge}
                  onChange={handleInputChange}
                  class="form-control"
                  id={styles.minAge}
                ></input>
              </div>

              <div class={`form-group ${styles.formGroup}`}>
                <label for="max-age">Maximum Age</label>
                <br></br>
                <small class="form-text text-muted">
                  Leave blank if there is no max. age requirement
                </small>
                <br></br>
                <input 
                  type="number" 
                  name="maxAge"
                  value={survey.maxAge}
                  onChange={handleInputChange}
                  class="form-control" 
                  id="max-age"></input>
              </div>
            </div>
          </div>

          <div class={`form-group ${styles.formGroup}`}>
            <label for="ethnicity">Ethnicity</label>         
            <br />
            <small class="form-text text-muted">Leave all boxes unchecked if there are no ethnicity requirements for your survey.</small>
            <div class="row">
            <div class="col-md-4">
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  name="chinese"
                  value={ethnicityEligibility.chinese}
                  onChange={handleCheckboxChange}
                  id="flexCheckDefault">
                </input>
                  <label class={`form-check-label ${styles.race}`} for="flexCheckDefault">
                    Chinese
                  </label>
              </div>
              
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  name="malay"
                  value={ethnicityEligibility.malay}
                  onChange={handleCheckboxChange} 
                  id="flexCheckDefault">
                </input>
                  <label class={`form-check-label ${styles.race}`} for="flexCheckDefault">
                    Malay
                  </label>
              </div>
            
              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  name="indian"
                  value={ethnicityEligibility.indian}
                  onChange={handleCheckboxChange}
                  id="flexCheckDefault">
                </input>
                  <label class={`form-check-label ${styles.race}`} for="flexCheckDefault">
                    Indian
                  </label>
              </div>

              <div class="form-check">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  name="others"
                  value={ethnicityEligibility.others}
                  onChange={handleCheckboxChange} 
                  id="flexCheckDefault">
                </input>
                  <label class={`form-check-label ${styles.race}`} for="flexCheckDefault">
                    Others
                  </label>
              </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class={`form-group ${styles.formGroup}`}>
                <label for="other-requirements">
                  Other Requirements Not Stated Above
                </label>
                <br></br>
                <textarea
                  type="text"
                  name="otherRequirements"
                  onChange={handleInputChange}
                  class="form-control"
                  id={styles.otherRequirements}
                  placeholder="Have other eligibility requirements for your survey? List them here!"
                ></textarea>
              </div>
            </div>
          </div>
        </section>
      </form>
  );
}

export default CreateSurveyForm;
