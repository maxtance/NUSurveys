import { useState, useRef } from "react";
import { supabaseClient } from "../../lib/client";
import styles from "./DragAndDropImage.module.css";

function DragAndDropImage({
  image,
  setImage,
  previewUrl,
  setPreviewUrl,
  updatedFields,
  setUpdatedFields,
}) {
  const [isDragged, setIsDragged] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    const filename = URL.createObjectURL(file);
    setImage(file);
    setPreviewUrl(filename);

    //if (previewUrl != "") {
      setUpdatedFields({ ...updatedFields, photo: file });
    //}
  };

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragged(true);
    } else if (event.type === "dragleave") {
      setIsDragged(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragged(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      //console.log("File drop detected.");
      handleFile(event.dataTransfer.files[0]);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      //console.log("File upload detected.");
      handleFile(event.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const removeImage = () => {
    setPreviewUrl("");
    setImage(null);
    setUpdatedFields({ ...updatedFields, photo: null });
  }

  return (
    <div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        class={styles.dragArea}
      >
        <input
          ref={inputRef}
          type="file"
          id={styles.imgUpload}
          onChange={handleChange}
        />
        <label
          id={styles.labelImgUpload}
          for="img-upload"
          className={isDragged ? styles.isDragged : ""}
        >
          <div onClick={handleClick}>
            <div class={styles.iconParent}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="38"
                height="38"
                fill="currentColor"
                class={`bi bi-file-earmark-arrow-up-fill ${styles.icon}`}
                viewBox="0 0 16 16"
              >
                <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM6.354 9.854a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 8.707V12.5a.5.5 0 0 1-1 0V8.707L6.354 9.854z" />
              </svg>
            </div>
            <p class={styles.dragAreaText}>
              Drag and drop the image here<br></br>or click anywhere to upload.
            </p>
          </div>
        </label>
      </div>
      {previewUrl && (
        <div className={styles.imagePreview}>
          <div className={styles.container} onClick={removeImage}>
            <img src={previewUrl} alt="image" className={styles.img} />
            <div className={styles.hiddenTxt}>Click to remove image</div>
          </div>
          <span className={styles.imgName}> {image.name}</span>
        </div>
      )}
    </div>
  );
}

export default DragAndDropImage;
