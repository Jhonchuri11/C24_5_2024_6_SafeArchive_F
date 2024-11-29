import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Inicio from './components/Home/Inicio';
import MainNav from './components/NavBar/MainNav';
import UserInformation from './components/User/UserInformation';
import MainFooter from './components/Footer/MainFooter';
import Detalle from './components/Documentos/Detalle';
import Login_user from './components/Auth/Login_user';
import CreatedDocumento from './components/Documentos/CreatedDocumento';
import OAuth2RedirectHandler from './components/Auth/OAuth2RedirectHandler';
import AccessDenied from './components/Auth/AccessDenied';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './components/AuditLogs/Admin'; 
import StudentDetail from './components/AuditLogs/StudentDetail';
import ContentDocument from './components/Documentos/ContentDocument';
import { Toaster } from 'react-hot-toast';
import NotFound from './components/NotFound';
import DocumentoDetails from './components/Documentos/DocumentoDetails';
import ItemDocumento from './components/Documentos/ItemDocumento';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import ViewDocument from './components/Documentos/Read-pdf/ViewDocument';
import DownloadView from './components/Documentos/Read-pdf/DownloadView';

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
        

          {/* Rutas para documentos */}
          <Route path='/documento-datos/:id' element={
            <ProtectedRoute>
              <MainLayout>
              <ItemDocumento/>
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

          <Route
           path='/view-document/:docId'
           element={
            <ProtectedRoute>
              <MainLayout>
                <ViewDocument/>
              </MainLayout>
            </ProtectedRoute>
           }/>
           
           <Route
           path='/download-view-document/:docId'
           element={
            <ProtectedRoute>
              <MainLayout>
                <DownloadView/>
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
