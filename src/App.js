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
import StudentDetail from './components/AuditLogs/StudentDetail';
import ContentDocument from './components/Documentos/ContentDocument';
import { Toaster } from 'react-hot-toast';
import NotFound from './components/NotFound';

import FormularioReporte from './components/Reportes/FormularioReporte';
import ListaReportes from './components/Reportes/ListaReportes';
import DocumentoDetails from './components/Documentos/DocumentoDetails';
import ItemDocumento from './components/Documentos/ItemDocumento';
import ListDisableDocument from './components/Documentos/ListDisableDocument';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

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
    <SkeletonTheme baseColor="#eaeaea" highlightColor="#ccc">
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
            <ProtectedRoute asesorPage={true}>
              <MainLayout>
              <CreatedDocumento/>
              </MainLayout>
            </ProtectedRoute>
          }
          />

          <Route path='/editarDocumento/:id' element={
            <ProtectedRoute>
              <MainLayout>
              <UpdateDocumento/>
              </MainLayout>
            </ProtectedRoute>
          }/>
          
          <Route path='/deleteDocumento/:id' element={
            <ProtectedRoute>
              <MainLayout>
              <DeleteDocumento/>
              </MainLayout>
            </ProtectedRoute>
          }/>

          {/* Rutas para documentos */}
          <Route path='/documento-datos/:id' element={
            <ProtectedRoute>
              <MainLayout>
              <ItemDocumento/>
              </MainLayout>
            </ProtectedRoute>
          }/>

          <Route path='/documentos-deshabilitados' element={
            <ProtectedRoute>
              <MainLayout>
              <ListDisableDocument/>
              </MainLayout>
            </ProtectedRoute>
          }/>

          <Route path='/documentos/editar-documento/:id' 
             element={
            <ProtectedRoute>
              <MainLayout>
              <DocumentoDetails/>
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

          <Route path='/documentos'
               element = {
              <ProtectedRoute asesorPage={true}>
              <MainLayout>
                <ContentDocument/>
              </MainLayout>
              </ProtectedRoute>
          }
          />

          <Route path='/admin/*'
           element={
            <ProtectedRoute adminPage={true}>
              <MainLayout>
               <Admin/>
               </MainLayout>
            </ProtectedRoute>
           }/>

         

          <Route path='/students/:userId' element={
            <ProtectedRoute>
              <MainLayout>
                <StudentDetail/>
              </MainLayout>
            </ProtectedRoute>
          }/>

          {/* Rutas para reportes */}
          <Route path='/crear-reporte' 
          element={
            <ProtectedRoute>
              <MainLayout>
                <FormularioReporte />
              </MainLayout>
            </ProtectedRoute>
          }/>

          <Route path='/mis-reportes' 
          element={
            <ProtectedRoute>
              <MainLayout>
                <ListaReportes userId={1} /> 
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
      </SkeletonTheme>
    </>
  );
}
