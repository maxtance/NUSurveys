import DragAndDropImage from "../imageuploader/DragAndDropImage";
import styles from "./CreateSurveyForm.module.css";

function CreateSurveyForm() {
  return (
    <form class="form-horizontal" id={styles.surveyForm}>
      <section>
        <h2 class={styles.sectionHeader}>Basic Information</h2>
        <div class="row">
          <div class="col-md-6">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="title">Title*</label>
              <input type="text" class="form-control" id="title" maxlength="250" 
                placeholder="No longer than 250 characters." />
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="description">Short Description</label>
              <textarea type="text" class="form-control" id="description" 
              placeholder="Enter a short description to let people know what your survey is about." />
            </div>
          </div>

          <div class="col-md-5 offset-md-1">
            <label for="photo">Photo*</label><br />
            <small class="form-text text-muted">You may choose to upload a picture to go with your listing. This is not compulsory.</small>
            <DragAndDropImage />
          </div>
        </div>
       
        <div class="row">
          <div class="col-md-6">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="link">Link*</label>
              <input type="url" class="form-control" id="link" placeholder="Paste your URL here!" />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-5">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="survey-type">Type of Survey*</label>
              <select required class="form-select" id="survey-type">
                <option disabled selected hidden>Select the option that best fits your survey</option>
                <option>Online survey</option>
                <option>Research study (online)</option>
                <option>Research study (on-site)</option>
              </select>
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="remuneration">Remuneration*</label>
              <select required class="form-select" id="remuneration">
                <option disabled selected hidden>How are you compensating your surveyees?</option>
                <option>Cash</option>
                <option>Voucher</option>
                <option>No remuneration given</option>
              </select>
            </div>
          </div>
        </div>
      
  
        <div class={`form-group ${styles.formGroup}`}>
          <label for="closing-date">Closing Date*</label><br></br>
          <input type="date"></input>
        </div>
      </section>

      <section id={styles.section2}>
        <h2 class={styles.sectionHeader}>Survey Requirements</h2>
        <div class="row">
          <div class="col-md-4">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="gender">Gender</label>
              <select class="form-select" id="gender">
                <option disabled selected hidden>Seeking responses from...</option>
                <option>Males only</option>
                <option>Females only</option>
              </select>
            </div>

            <div class={`form-group ${styles.formGroup}`}>
              <label for="min-age">Minimum Age</label><br></br>
              <small class="form-text text-muted">Leave blank if there is no min. age requirement</small><br></br>
              <input type="number" class="form-control" id={styles.minAge}></input>
            </div>

          <div class={`form-group ${styles.formGroup}`}>
            <label for="max-age">Maximum Age</label><br></br>
            <small class="form-text text-muted">Leave blank if there is no max. age requirement</small><br></br>
            <input type="number" class="form-control" id="max-age"></input>
          </div>
        </div>
        </div>

        <div class={`form-group ${styles.formGroup}`}>
          <label for="ethnicity">Ethnicity</label>
          <div class="row">
            <div class="col-md-1">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault">
                Chinese
              </label>
            </div>
            </div>
            <div class="col-md-1">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault">
                Malay
              </label>
            </div>
            </div>
            <div class="col-md-1">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault">
                Indian
              </label>
            </div>
            </div>
            <div class="col-md-1">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label class="form-check-label" for="flexCheckDefault">
                Others
              </label>
            </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class={`form-group ${styles.formGroup}`}>
              <label for="other-requirements">Other Requirements Not Stated Above</label><br></br>
              <textarea type="text" class="form-control" id="other-requirements" 
                placeholder="Have other eligibility requirements? List them here!"></textarea>
            </div>
          </div>
        </div>
      </section>
    </form>
   )
}

export default CreateSurveyForm;