import React, { useState } from "react";

export default function ImageUpload({ setFormInput, formInput }) {
  //   const [selectedImage, setSelectedImage] = useState(null);
  const handleFileChange = (event) => {
  console.log("FORMINPUT", formInput);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        //   localStorage.setItem("uploadedFile", base64String); // Save to localStorage
        //   setFileData(base64String); // Update state to use it immediately
        const base64String = reader.result; // This is the Base64 string
        setFormInput((prev) => {
          console.log("SET STRING");
          console.log("base64String", base64String);
          return { ...prev, image: base64String };
        });
      };
      reader.readAsDataURL(file); // Convert to Base64
    } else {
      console.error("Please upload a valid image file.");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: "120px",
        right: "10px",
        justifyContent: "end",
        alignItems: "start",
      }}
    >
      {/* Hide the default file input */}
      <input
        type="file"
        onChange={handleFileChange}
        id="fileInput"
        style={{ display: "none" }}
      />

      {/* Custom button to trigger file input */}
      <label
        htmlFor="fileInput"
        style={{
          cursor: "pointer",
          padding: "5px",
          backgroundColor: "rgb(26, 26, 26)",

          color: "white",
          // height:"20px",
          borderRadius: "5px",
          textWrap: "nowrap",
        }}
      >
        Choose Image
      </label>

      {/* Display selected file name */}
      {formInput?.image && (
        <>
          <div style={{}}>Selected file: </div>
          <div
            style={{
              maxWidth: "220px",
              overflow: "auto",
              textWrap: "nowrap",
            }}
          >
            {formInput.image.name}
          </div>
        </>
      )}
    </div>
  );
}
