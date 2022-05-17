import { useState, useRef } from "react";
import styles from "./DragAndDropImage.module.css";

function DragAndDropImage() {
  const [isDragged, setIsDragged] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (event.type === "dragenter" || event.type === "dragover") {
        setIsDragged(true);
      } else if (event.type === "dragleave") {
        setIsDragged(false);
      }
  }

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragged(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      //TODO: add backend logic 
      console.log("File drop detected.");
    }
  }

  const handleChange = (event) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      //TODO: add backend logic 
      console.log("File upload detected.");
    }
  }

  const handleClick = () => {
    inputRef.current.click();
    console.log("UHHHHH")
  }

  return (
      <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <input ref={inputRef} type="file" id={styles.imgUpload} onChange={handleChange}/>
        <label id={styles.labelImgUpload} for="img-upload" className={isDragged ? styles.isDragged : ""}>
          <div onClick={handleClick}>
            <p>Drag and drop the image here or click anywhere to upload.</p>
          </div> 
        </label>
      </div>
  );
}

export default DragAndDropImage;