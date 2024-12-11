import React, { useEffect, useState } from 'react';
import api, { fetchStudents, changeUserRole } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../style/StudentList.css';
import Swal from 'sweetalert2';

const StudentList = () => {

  const [students, setStudents] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [roles, setRoles] = useState([]);

  const [correo, setCorreo] = useState('');
  const [roleId, setRoleId] = useState('');

  const handleSubmit = async () => {
    if (!correo || !roleId) {
      toast.error("Por favor, completa todos los campos.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/admin/register", { correoCorporativo: correo, roleId: roleId });

      Swal.fire(
        "Éxito",
        "El usuario ha sido registrado correctamente.",
        "success"
      )

    } catch (error) {
      toast.error("Hubo un error al registrar el usuario.");
    } finally {
      setLoading(false);
    }
  }
  

  useEffect(() => {
    const getStudents = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
        console.log(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/admin/roles")
        setRoles(response.data);
      } catch (error) {
        console.error("Error al obtener los roles:", error);
      }
    };

    fetchRoles();
  }, []);


  const handleChangeRole = async (userId) => {
    const selectedRoleId = selectedRole[userId];
    if (!selectedRoleId) {
      toast.error('Por favor, selecciona un rol primero.');
      return;
    }

    try {
      // Llamada al servicio para cambiar el rol
      const response = await api.put("/admin/update-role", { 
        userId: userId,
        roleId: selectedRoleId
      });

      console.log(response.data);

      const updatedUser = response.data;

      toast.success("Rol actualizado exitosamente");

      // Actualizar el estado local para reflejar el cambio
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === userId 
            ? { ...student, 
              roleId: selectedRoleId, 
              role_nombre: updatedUser.role_nombre }
            : student
        )
      );

      // Limpiar la selección temporal
      setSelectedRole((prev) => ({ ...prev, [userId]: '' }));
    } catch (error) {
      toast.error(`Error al cambiar el rol: ${error.message}`);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStudents = students.filter((student) =>
    student.correo_corporativo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="student-list-container">
      <h1 className="student-list-title">Lista de Usuarios</h1>
    
       {/* Modal para registrar un solo usuario */}
            
       {/* Modal para registrar una lista de usuarios */}

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="student-search-bar">
        <input
          type="text"
          placeholder="Buscar por correo..."
          value={searchTerm}
          onChange={handleSearch}
          className="student-search-input"
        />
      </div>

      <div className="students-per-page">
        <label htmlFor="students-per-page">Estudiantes por página:</label>
        <select
          id="students-per-page"
          value={studentsPerPage}
          onChange={(e) => setStudentsPerPage(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      <table className="student-table">
        <thead>
          <tr>
            <th className="text-center">Usuarios</th>
            <th className="text-center">Selección</th>
            <th className="text-center">Acción</th>
            <th className="text-center">Rol</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.correo_corporativo}</td>
              <td>
                <select
                  className="select-role"
                  value={selectedRole[student.id] || ''}
                  onChange={(e) =>
                    setSelectedRole({ ...selectedRole, [student.id]: e.target.value })
                  }
                >
                  <option value="">Seleccionar rol</option>
                  {roles.map((role) => (
                    <option key={role.roleId} value={role.roleId}>
                      {role.nombreRol}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="role-button"
                  onClick={() => handleChangeRole(student.id)}
                >
                  Cambiar rol
                </button>
              </td>
              <td>
              {
                 student.role_nombre
              }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredStudents.length / studentsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`student-page-button ${
                currentPage === index + 1 ? 'student-active' : ''
              }`}
              disabled={currentPage === index + 1}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      {/* Modal para agregar carrera */}
  <div
  className="modal fade"
  id="usuarioModal"
  tabIndex="-1"
  aria-labelledby="usuarioModalLabel"
  aria-hidden="true"
>
  <div className="modal-dialog shadow rounded">
    <div className="modal-content shadow rounded">
      <div className="modal-header shadow rounded">
        <h5 className="modal-title" id="usuarioModalLabel">Agregar nuevo usuario</h5>
        <button
          type="button"
          className="btn-close shadow rounded"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div className="modal-body">
        <input
          type="email"
          className="form-control input_btn  border border-grey-1"
          placeholder="Correo electrónico."
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <select
        className="form-control mt-2"
        value={roleId}
        onChange={(e) => setRoleId(e.target.value)}
        >
          <option value="">Seleccionar rol</option>
          {roles.map((role) => (
            <option key={role.roleId}  value={role.roleId}>
              {role.nombreRol}
            </option>
          ))}
        </select>

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
          className="btn btn-info"
          onClick={handleSubmit}
        >
          { loading? "Registrando..." : "Guardar"}
        </button>
      </div>
    </div>
  </div>
</div>

    </div>

    
  );
};

export default StudentList;
