import { Routes, Route } from 'react-router-dom';
import RqsModulo from "./RqsModulo"
import ReclamoEdit from './editar/ReclamoEdit';
import SolicitudEdit from './editar/SolicitudEdit';
import Reclamo from './detalles/Reclamo';
import Solicitud from './detalles/Solicitud';

function AppRqs() {
    return (
        <Routes>
            <Route path={"/"} element={<RqsModulo />} />
            <Route path={`/reclamoEdit/:id`} element={<ReclamoEdit />} />
            <Route path={`/solicitudEdit/:id`} element={<SolicitudEdit />} />
            <Route path={`/reclamo/:id`} element={<Reclamo />} />
            <Route path={`/solicitud/:id`} element={<Solicitud />} />
        </Routes>
    );
}

export default AppRqs