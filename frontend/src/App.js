import {BrowserRouter, Route, Routes} from "react-router-dom";
import LoginPage from "./components/loginPage/loginPage";
import DashboardPage from "./components/dashboardPage/dashboardPage";
import RepairRequestPlatform from "./components/repairRequestPlatform/repairRequestPlatform";
import RequestList from "./components/requestList/requestList";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={'/'} element={<LoginPage/>}/>
                <Route path={'/dashboard'} element={<DashboardPage/>}/>
                <Route path={'/requestList'} element={<RequestList/>}/>
                <Route path={'/repairRequest'} element={<RepairRequestPlatform/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
