import styles from './sideBar.module.scss'
import {HiClipboardList, HiCog, HiCollection, HiHome, HiInformationCircle} from "react-icons/hi";
import {HiUserCircle} from "react-icons/hi2";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {clearUser} from "../../redux/userSlice";
import {FaFileAlt} from "react-icons/fa";

export default function SideBar() {
    const userData = useSelector((state) => state.userData)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const handleLogOut = () => {
        dispatch(clearUser())
        navigate('/')
    }
    const userRole = useSelector((state) => state.userData.role)
    return (
        <div className={styles.sideBarContainer}>
            <div>
                <div className={styles.userContainer}>
                    <HiUserCircle style={{fontSize: '50px'}}/>
                    <div className={styles.userInfo}>
                        <h3>{userData.name}</h3>
                        <p>Rol: {userData.role}</p>
                    </div>
                </div>

                <ul className={styles.navBar}>
                    <li><Link to={'/dashboard'}>
                        <HiHome className={styles.navBarIcon}/> Dashboard</Link>
                    </li>

                    <li><Link to={'/requestList'}>
                        <HiClipboardList className={styles.navBarIcon}/> Lista de Solicitudes</Link>
                    </li>

                    {userRole === 'Advisor' && (
                        <li><Link to={'/repairRequest'}>
                            <HiInformationCircle className={styles.navBarIcon}/> Solucitud por Plataforma</Link>
                        </li>
                    )}

                    {userRole === 'Technician' && (
                        <>
                            <li><Link to={'/repairOrder'}>
                                <HiCog className={styles.navBarIcon}/> Diagnóstico</Link>
                            </li>

                            <li><Link to={'/repairOrderList'}>
                                <HiCollection className={styles.navBarIcon}/> Lista de Diagnósticos</Link>
                            </li>
                        </>
                    )}

                    <li><Link to={'/report'}>
                        <FaFileAlt className={styles.navBarIcon}/> Reporte</Link>
                    </li>
                    <li><Link to={'/modulorqs/'}>
                        <HiInformationCircle className={styles.navBarIcon}/> Reclamos y Solicitudes</Link>
                    </li>
                </ul>
            </div>

            <button type={"button"} onClick={handleLogOut} className={styles.logOut}>Cerrar Sesión</button>
        </div>
    )
}