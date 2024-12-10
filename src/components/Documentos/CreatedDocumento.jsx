import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../style/CreatedDocumento.css";
import api from "../../services/api";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Swal from "sweetalert2";
import { FaSave } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import bootstrapBundleMin from "bootstrap/dist/js/bootstrap.bundle.min.js";



export default function CreatedDocumento() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(null);

    const [categoriasList, setCategoriasList] = useState([]);

    const [carrerasList, setCarrerasList] = useState([]);

    const [semestressList, setSemestresList] = useState([]);

    const [newCarrera, setNewCarrera] = useState("");

    const [newSemestre, setNewSemestre] = useState("");


    const handleAddCarrera = async () => {
      try {
        const response = await api.post("/carreras", { nombreCarrera: newCarrera });
        setCarrerasList([...carrerasList, response.data]);
        setNewCarrera("");
      } catch (error) {
        // Manejar errores específicos del backend
        if (error.response && error.response.status === 409) {
            alert("La carrera ya está registrada.");
        } else {
            alert("Error al agregar carrera: " + (error.response?.data || error.message));
        }
      }
    };

    const handleAddSemestre = async () => {
      try {
        const response = await api.post("/semestres", { nombreSemestre: newSemestre });
        setSemestresList([...semestressList, response.data]);
        setNewSemestre("");
      } catch (error) {
        if (error.response && error.response.status === 409) {
            alert("El semestre ya está registrada.");
        } else {
            alert("Error al agregar semestre: " + (error.response?.data || error.message));
        }
      }
    };

    const fetchData = useCallback(async (endpoint, setState) => {

      setLoading(true);
      
      try {
        const response = await api.get(endpoint);

         setState(Array.isArray (response.data) ? response.data : []);
        
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar datos.");
        console.log(`Error fetching ${endpoint}:`, err);
      } finally {
        setLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchData("/categorias", setCategoriasList);
      fetchData("/carreras", setCarrerasList);
      fetchData("/semestres", setSemestresList);
    }, [fetchData])

    const validationSchema = Yup.object({
      titulo: Yup.string().required("El título es obligatorio"),
      autores: Yup.string().required("El autor es obligatorio"),
      resumen: Yup.string().required("El resumen es obligatorio"),
      fechaPublicacion: Yup.date().required("La fecha de publicación es obligatoria"),
      asesor: Yup.string().required("El asesor es obligatorio"),
      categoria: Yup.string().required("La categoría es obligatoria"),
      carrera: Yup.string().required("La carrera es obligatoria"),
      ciclo: Yup.string().required("El ciclo es obligatorio"),
      semestre: Yup.string().required("El semestre es obligatorio"),
      seccion: Yup.string(),
      file: Yup.mixed()
        .required("Debes subir un archivo")
        .test("fileSize", "El archivo es muy grande, debe ser menor de 20MB", (value) =>
          value ? value.size <= 20 * 1024 * 1024 : true
        )
        .test("fileFormat", "Solo se permiten archivos PDF", (value) =>
          value ? value.type === "application/pdf" : true
        ),
    });

    // Manejar el envío del formulario
    const handleSubmit = async (values) => {
      const cleanedValues = {
        ...values,
        titulo: values.titulo.trim(),
        autores: values.autores.trim(),
        resumen: values.resumen.trim(),
        asesor: values.asesor.trim(),
      };

      const formData = new FormData();
      Object.keys(cleanedValues).forEach((key) => {
        formData.append(key, cleanedValues[key]);
      });
      
      try {
        setLoading(true)
        const response = await api.post('/documentos/uploaddrive', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Swal.fire("Éxito","El documento ha sido registrado correctamente.", "success").then(() => {
            navigate("/documentos"); 
        });

        console.log('Documento subido con éxito:', response);

      } catch (err) {
        setError(err.response?.data?.message || "Falló al registrar el documento.");
        Swal.fire("Error","Ocurrió un error al intentar registrar el documento!", "error");
      } finally {
        setLoading(false);
      }

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      
    };

   

    return (
        <section className="container mt-4">
          <div className="row">
                    <div className="col-12 col-md-12 col-sm-12 col-lg-12 col-xl-12">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/inicio" className="breadcrumb_inicio">Inicio</Link></li>
                                <li className="breadcrumb-item" aria-current="page">Documentos</li>
                                <li className="breadcrumb-item active" aria-current="page"> Registro de documento</li>
                            </ol>
                        </nav>
                    </div>
                </div>
  <hr />
  <div className="card card-body bg-light p-4 shadow rounded">
    <Formik
    initialValues={{
      titulo: "",
      autores: "",
      resumen: "",
      fechaPublicacion: "",
      asesor: "",
      categoria: "",
      carrera: "",
      ciclo: "",
      semestre: "",
      seccion: "",
      file: null,
    }}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}>

      {({ setFieldValue, values, handleChange }) => (

    <Form
    encType="multipart/form-data" className="formulario">
      <div className="row g-4">
        <div className="col-6">
          <label>Título<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-chat-right-dots"></i>
            </div>
            <Field
            as="textarea"
             name="titulo"
            className="form-control input_btn border border-grey-1"
            placeholder="Título"
            />
          </div>
          <ErrorMessage name="titulo" component="div" className="text-danger" />
        </div>

        <div className="col-6">
          <label>Autores<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-person-lines-fill"></i>
            </div>
            <Field
            as="textarea" 
              className="form-control input_btn  border border-grey-1"
              placeholder="Nombres y apellidos"
              id="autores"
              name="autores"
            />
          </div>
          <ErrorMessage name="autores" component="div" className="text-danger"/>
        </div>

        <div className="col-12">
          <label>Resumen<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-card-text"></i>
            </div>
            
            <Field
            as="textarea" 
              className="form-control input_btn  border border-grey-1"
              placeholder="Resumen"
              id="resumen"
              name="resumen"
            ></Field>
          </div>
          <ErrorMessage name="resumen" component="div" className="text-danger"/>
        </div>

        <div className="col-6">
          <label>Fecha de publicación<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-calendar2-day"></i>
            </div>
            <Field
              type="date"
              className="form-control input_btn  border border-grey-1"
              id="fechaPublicacion"
              name="fechaPublicacion"
            />
          </div>
          <ErrorMessage name="fechaPublicacion" component="div" className="text-danger" />
        </div>

        <div className="col-6">
          <label>Asesor<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-person-fill"></i>
            </div>
            <Field
              type="text"
              className="form-control input_btn  border border-grey-1"
              placeholder="Nombres y apellidos"
              id="asesor"
              name="asesor"
            />
          </div>
          <ErrorMessage name="asesor" component="div" className="text-danger"/>
        </div>

        <div className="col-6">
          <label>Categoria<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-bookmark-star"></i>
            </div>
            <Field
            as="select"
              className="form-select input_btn  border border-grey-1 border border-grey-1" aria-label="Default select example"
              id="categoria"
              name="categoria"
            >
              <option value="">Seleccionar categoria</option>
              {categoriasList.map((cate) => (
                <option key={cate.id} value={cate.id}>
                  {cate.nombreCategoria}
                </option>
              ))}
            </Field>
            
          </div>
          <ErrorMessage name="categoria" component="div" className="text-danger" />
        </div>

        <div className="col-6">
          <label>Carrera<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-chat-square-text-fill"></i>
            </div>
            <Field
            as="select"
              className="form-select input_btn  border border-grey-1"
              id="carrera"
              name="carrera"
              onChange={(e) => {
                if (e.target.value === "new") {
                  const modal = new bootstrapBundleMin.Modal(document.getElementById("carreraModal"));
                  modal.show();
                } else {
                  handleChange(e);
                }
              }}
            >
              <option value="">Seleccionar carrera</option>
              {carrerasList.map((carre) => (
                <option key={carre.id} value={carre.id}>
                  {carre.nombreCarrera}
                </option>
              ))}

              <option value="new">Agregar nueva carrera</option>
            </Field>
          </div>
          <ErrorMessage name="carrera" component="div" className="text-danger" />
        </div>
        <div className="col-6">
          <label>Ciclo<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-chat-square-text-fill"></i>
            </div>
            <Field
            as="select"
              className="form-select  input_btn border border-grey-1"
              id="ciclo"
              name="ciclo"
            >
              <option value="">Seleccionar ciclo</option>
              <option value="I">1</option>
              <option value="II">2</option>
              <option value="III">3</option>
              <option value="IV">4</option>
              <option value="V">5</option>
              <option value="VI">6</option>
            </Field>
          </div>
          <ErrorMessage name="ciclo" component="div" className="text-danger" />
        </div>
        <div className="col-6">
          <label>Sección<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-chat-square-text-fill"></i>
            </div>
            <Field
            as="select"
              className="form-select input_btn  border border-grey-1"
              id="seccion"
              name="seccion"
            >
              <option value="">Seleccionar sección</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
              <option value="F">F</option>
              <option value="G">G</option>
            </Field>
          </div>
          <ErrorMessage name="seccion" component="div" className="text-danger" />
        </div>
        <div className="col-6">
          <label>Semestre<span className="text-danger">*</span></label>
          <div className="input-group">
            <div className="input-group-text">
              <i className="bi bi-chat-square-text-fill"></i>
            </div>
            <Field
            as="select"
              className="form-select input_btn  border border-grey-1"
              id="semestre"
              name="semestre"
              onChange={(e) => {
                if (e.target.value === "new") {
                  const modal = new bootstrapBundleMin.Modal(document.getElementById("semestreModal"));
                  modal.show();
                } else {
                  handleChange(e);
                }
              }}
            >
              <option value="">Seleccionar semestre</option>
              {semestressList.map((seme) => (
                <option key={seme.seme} value={seme.id}>
                  {seme.nombreSemestre}
                </option>
              ))}
               <option value="new">Agregar nuevo semestre</option>
            </Field>
          </div>
          <ErrorMessage name="semestre" component="div" className="text-danger" />
        </div>
        <div className="col-sm-6 mb-3">
          <label htmlFor="formFile" className="form-label">Archivo<span className="text-danger">*</span> </label>
          <input
           className="form-control input_btn border border-grey-1" 
           type="file" 
           id="file" 
           accept="application/pdf"
           onChange={(e) => {
            setFieldValue("file", e.currentTarget.files[0]);
          }} />
           <ErrorMessage name="file" component="div" className="text-danger" />
        </div>

        <div className="col-12">
          <button
          
          disabled={loading} type="submit" className="btn btn-info button_page_filter_register px-4 float-end mt-4 me-2">
            <FaSave/>
            { loading ? <span>Registrando...</span> : " Registrar" }
          </button>
      
          <Link to={'/documentos'} className="btn btn-success button_page_filter_register px-4 float-end mt-4 me-2">Cancelar</Link>
          

        </div>
      </div>
    </Form>
    )}
    </Formik>

    {loading && (
      <div className="loading-overlay">
         <div className="spinner"></div>
      </div>
    )}
  </div>

  {/* Modal para agregar carrera */}
  <div
  className="modal fade"
  id="carreraModal"
  tabIndex="-1"
  aria-labelledby="carreraModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="carreraModalLabel">Agregar Nueva Carrera</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre de la nueva carrera"
          value={newCarrera}
          onChange={(e) => setNewCarrera(e.target.value)}
        />
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Cerrar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddCarrera}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</div>

{/* Modal para agregar semestre */}
<div
  className="modal fade"
  id="semestreModal"
  tabIndex="-1"
  aria-labelledby="semestreModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="semestreModalLabel">Agregar Nuevo semestre</h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre del nuevo semestre"
          value={newSemestre}
          onChange={(e) => setNewSemestre(e.target.value)}
        />
      </div>
      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
        >
          Cerrar
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddSemestre}
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</div>

  <div className="mt-3"/>
</section>

    )
}