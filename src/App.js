import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Inicio from './components/Home/Inicio';
import MainNav from './components/NavBar/MainNav';

import UserInformation from './components/User/UserInformation';

import MainFooter from './components/Footer/MainFooter';
import Detalle from './components/Documentos/Detalle';
import Login_user from './components/Auth/Login_user';
import ListDocumentos from './components/Documentos/ListDocumentos';
import CreatedDocumento from './components/Documentos/CreatedDocumento';

import UpdateDocumento from './components/Documentos/UpdateDocumento';
import DeleteDocumento from './components/Documentos/DeleteDocumento';
import OAuth2RedirectHandler from './components/Auth/OAuth2RedirectHandler';
import AccessDenied from './components/Auth/AccessDenied';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './components/AuditLogs/Admin'; 


import StudentList from './components/AuditLogs/StudentList';
import ContentDocument from './components/Documentos/ContentDocument';
import { Toaster } from 'react-hot-toast';
import NotFound from './components/NotFound';

// componenente Layout para paginas con nav, header y footer
function MainLayout( { children }) {
  return (
    <>
    <div className="layout-container">
    <MainNav/>
    <Toaster position="bottom-center" reverseOrder={false} />
    <div className="content-container">
    { children }
    </div>
    <MainFooter/>
    </div>
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

          <Route path='/detalle/:documentoId' element={
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

          {/* Rutas protegidas */}
          <Route path='/documentos'
          element = {
            <ProtectedRoute>
              <MainLayout>
                <ContentDocument/>
              </MainLayout>
              </ProtectedRoute>
          }
          />
          
          <Route path='/access-denied' 
          element={
            <ProtectedRoute>
            <MainLayout>
             <AccessDenied/> 
             </MainLayout>
             </ProtectedRoute>
             } />
          
          {/* Rutas user*/}
          <Route path='/MiPerfil'
          
          element={
            <ProtectedRoute>
              <MainLayout>
                <UserInformation/>
              </MainLayout>
            </ProtectedRoute>
          }></Route>

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

          {/* Rutas no encontradas */}
          <Route path='*' element={
            <MainLayout>
              <NotFound/>
            </MainLayout>
          } />

        </Routes>
      </BrowserRouter>
    </>
  );
}