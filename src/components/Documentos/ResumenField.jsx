import React, { useState } from "react";
import { ErrorMessage, useFormikContext } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const ResumenField = () => {
  const { values, setFieldValue, errors, touched } = useFormikContext(); // Accede al contexto Formik

  return (
    <div className="col-12">
      <label>Resumen<span className="text-danger">*</span></label>
     
        <ReactQuill
          className="editor"
          value={values.resumen}  // Valor del campo Formik
          onChange={(content) => setFieldValue("resumen", content)}  // Actualiza Formik con el contenido del editor
          modules={{
            toolbar: [
              [
                {
                  header: [1, 2, 3, 4, 5, 6],
                },
              ],
              [{ size: [] }],
              ["bold", "italic", "underline", "strike", "blockquote"],
              [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
              ],
              ["clean"],
            ],
          }}
        />
     
       <ErrorMessage  name="resumen" component="div" className="text-danger" />
    </div>
   
  );
};

export default ResumenField;
