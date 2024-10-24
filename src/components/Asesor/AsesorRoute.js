import { Route, Routes } from "react-router-dom"
import CreatedDocumento from "../Documentos/CreatedDocumento";

const AsesorRoute = () => {
    return (
        <Routes>
            <Route path="createDocumento" element={<CreatedDocumento/>} />
        </Routes>
    )
}

export default AsesorRoute;