import React, { useEffect, useState } from 'react';
import api, { fetchStudents, changeUserRole } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../style/StudentList.css';
import RegisterSingleUserModal from './RegistersUsers/RegisterUserModal';
import RegisterMultipleUsersModal from './RegistersUsers/RegisterUsersListModal';
import Swal from 'sweetalert2';
import RegisterUserModal from './RegistersUsers/RegisterUserModal';
import RegisterUsersListModal from './RegistersUsers/RegisterUsersListModal';

const StudentList = () => {

  const [showSingleModal, setShowSingleModal] = useState(false);
  const [showMultipleModal, setShowMultipleModal] = useState(false);

  const [students, setStudents] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);

  const handleRegisterSingleUser = async (usuariosDto) => {
    try {
      setLoading(true);
      const response = await api.post('/admin/register-user', usuariosDto);
  
      Swal.fire(
        "Éxito",
        "El usuario ha sido registrado correctamente.",
        "success"
      ).then(() => {
        window.location.reload(); // Refresca la página para reflejar los cambios
      });
  
      console.log("Usuario registrado con éxito:", response.data);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Ocurrió un error al intentar registrar el usuario.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterMultipleUsers = async (usuariosDto) => {
    try {
      setLoading(true);
      const response = await api.post('/admin/register-users', usuariosDto);
      Swal.fire(
        "Éxito",
        "Los usuarios han sido registrados correctamente.",
        "success"
      ).then(() => {
        window.location.reload(); // Refresca la página para reflejar los cambios
      });
  
      console.log("Usuarios registrados con éxito:", response.data);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Ocurrió un error al intentar registrar los usuarios.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const getStudents = async () => {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    getStudents();
  }, []);

  const handleChangeRole = async (userId) => {
    const newRole = selectedRole[userId];
    if (!newRole) {
      toast.error('Por favor, selecciona un rol primero.');
      return;
    }

    try {
      // Llamada al servicio para cambiar el rol
      await changeUserRole(userId, { nombreRol: newRole });
      toast.success(`Rol cambiado a ${newRole}`);

      // Actualizar el estado local para reflejar el cambio
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === userId ? { ...student, role_nombre: newRole } : student
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
                  <option value="administrador">Administrador</option>
                  <option value="asesor">Asesor</option>
                  <option value="estudiante">Estudiante</option>
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
              <td>{student.role_nombre}</td>
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


      <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        ...
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Understood</button>
      </div>
    </div>
  </div>
</div>

    </div>

    
  );
};

export default StudentList;
