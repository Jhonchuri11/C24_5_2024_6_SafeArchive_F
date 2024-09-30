import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Inicio from './components/Home/Inicio';
import MainNav from './components/NavBar/MainNav';
import MainHeader from './components/Header/MainHeader';
import MainFooter from './components/Footer/MainFooter';
import Detalle from './components/Documentos/Detalle';
import Login_user from './components/Auth/Login_user';
import ListDocumentos from './components/Documentos/ListDocumentos';
import CreatedDocumento from './components/Documentos/CreatedDocumento';
import CreateDocumento from './components/Documentos/CreateDocumento';

import UpdateDocumento from './components/Documentos/UpdateDocumento';
import DeleteDocumento from './components/Documentos/DeleteDocumento';
import OAuth2RedirectHandler from './components/Auth/OAuth2RedirectHandler';
import AccessDenied from './components/Auth/AccessDenied';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './components/AuditLogs/Admin'; 
import StudentList from './components/AuditLogs/StudentList';

// componenente Layout para paginas con nav, header y footer
function MainLayout( { children }) {
  return (
    <>
    <MainNav/>
    <MainHeader/>
    { children }
    <MainFooter/>
    </>
  )
}

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
            {/* Rutas públicas */}

          <Route path='/' element={<Login_user/>}/>
          <Route path='/oauth2/redirect' element={ <OAuth2RedirectHandler/> } />

          {/* Rutas protegidas */}
          <Route path='/inicio' element={
            <ProtectedRoute> 
            <MainLayout>
            <Inicio/>
            </MainLayout>
          </ProtectedRoute>
          }
          />
        <Route path="/listadodocumento" 
        element={<ProtectedRoute>
          <MainLayout>
            <ListDocumentos/>
            </MainLayout>
          </ProtectedRoute>} />
          <Route path='/detalle' element={
            <ProtectedRoute>
              <MainLayout>
              <Detalle/>
              </MainLayout>
            </ProtectedRoute>
          }
          />

          <Route path='/createDocumento' 
          element={
            <ProtectedRoute>
              <MainLayout>
              <CreatedDocumento/>
              </MainLayout>
            </ProtectedRoute>
          }
          />

          <Route path='/createdoc' 
          element={
            <ProtectedRoute>
              <MainLayout>
              <CreateDocumento/>
              </MainLayout>
            </ProtectedRoute>
          }
          />

          <Route
          path='/editarDocumento/:id' element={
            <ProtectedRoute>
              <MainLayout>
              <UpdateDocumento/>
              </MainLayout>
            </ProtectedRoute>
          }/>
          <Route
          path='/deleteDocumento/:id' 
          element={
            <ProtectedRoute>
              <MainLayout>
              <DeleteDocumento/>
              </MainLayout>
            </ProtectedRoute>
          }/>
          
          <Route path='/access-denied' 
          element={
            <ProtectedRoute>
            <MainLayout>
             <AccessDenied/> 
             </MainLayout>
             </ProtectedRoute>
             } />
          

          <Route path='/admin/*'
           element=
           {
            <ProtectedRoute adminPage={true}>
              <MainLayout>
               <Admin/>
               </MainLayout>
            </ProtectedRoute>
           }/>

        <Route
          path='/dashboard/' 
          element={
            <ProtectedRoute>
              <MainLayout>
              <StudentList/>
              </MainLayout>
            </ProtectedRoute>
          }/>  
        </Routes>
      </BrowserRouter>
    </>
  );
}