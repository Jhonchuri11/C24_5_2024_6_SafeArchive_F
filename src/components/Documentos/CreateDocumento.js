import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"
import api from "../../services/api";
import Buttons from "../../utils/Buttons";

const CreateDocumento = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState("");

    // Variable que permite crear nuevo documento
    const [formNewDocumento, setformNewDocumento] = useState({
        titulo: "",
        autores: "",
        resumen: "",
        anioPublicacion: "",
        asesor: "",
        categoria: "",
        tema: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformNewDocumento({
            ...formNewDocumento,
            [name]: value,
        });
    }


    // document handler
    const handleSubmit = async (e) => {
        e.preventDefault();

        //const { titulo, autores, resumen, anioPublicacion, asesor, categoria, tema } = formNewDocumento;

        if (!formNewDocumento.titulo || !formNewDocumento.autores || !formNewDocumento.resumen
            || !formNewDocumento.anioPublicacion || !formNewDocumento.asesor || !formNewDocumento.categoria ||
            !formNewDocumento.tema) {
            return toast.error("Todos los campos son obligatorios");
        }

        // para el registro
        try {
            setLoading(true);
            await api.post("/documentos", formNewDocumento);
            toast.success("Documento creado correctamente");
            navigate("/inicio");
        } catch (error) {
            toast.error("Error al crear documento");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
      <h1 className="text-center mb-4">Crear Nueva doc</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label htmlFor="titulo">Título</label>
          <input
            type="text"
            className="form-control"
            id="titulo"
            name="titulo"
            value={formNewDocumento.titulo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="autores">Autores</label>
          <input
            type="text"
            className="form-control"
            id="autores"
            name="autores"
            value={formNewDocumento.autores}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="resumen">Resumen</label>
          <input
            type="text"
            className="form-control"
            id="resumen"
            name="resumen"
            value={formNewDocumento.resumen}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="anioPublicacion">Año P</label>
          <input
            type="number"
            className="form-control"
            id="anioPublicacion"
            name="anioPublicacion"
            value={formNewDocumento.anioPublicacion}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="asesor">Asesor</label>
          <input
            type="text"
            className="form-control"
            id="asesor"
            name="asesor"
            value={formNewDocumento.asesor}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="categoria">Categoria</label>
          <input
            type="text"
            className="form-control"
            id="categoria"
            name="categoria"
            value={formNewDocumento.categoria}
            onChange={handleChange}
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="tema">Tema</label>
          <input
            type="text"
            className="form-control"
            id="tema"
            name="tema"
            value={formNewDocumento.tema}
            onChange={handleChange}
          />
        </div>
        <Buttons
        disabled={loading}
        onclickhandler={handleSubmit}
        className="btn btn-primary">
            { loading ? <span>Loading...</span> : " Create documento"}
        </Buttons>
        </form>
    </div>
    )
}

export default CreateDocumento;