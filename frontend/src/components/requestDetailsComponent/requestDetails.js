import styles from "../repairRequestPlatform/repairRequestPlatform.module.scss";
import SideBar from "../sideBarComponent/sideBar";
import TextInput from "../../ui/TextInput";
import React, {useEffect, useState} from "react";
import axios from "axios";
import axiosJWT from "../../axios/axiosInstance"
import {useNavigate, useParams} from "react-router-dom";

export default function RequestDetails() {
    const {guid} = useParams()
    const [clientData, setClientData] = useState({})
    const [orderData, setOrderData] = useState({})
    const [requestData, setRequestData] = useState({})

    const navigate = useNavigate()

    useEffect(() => {
        const getRequestData = async () => {
            try {
                const url = `/api/RepairRequest/${guid}`
                const response = await axiosJWT.get(url)
                setRequestData(response.data)
            } catch (error) {
                console.log(error)
            }
        }

        getRequestData().then(() => {
        })
    }, [guid])

    useEffect(() => {
        const getClientData = async () => {
            const url = `https://clientemodulocrm.onrender.com/clientes/buscarPorDNI/${requestData.clientId}`
            const clientResponse = await axios.get(url)
            setClientData(clientResponse.data)
        }

        const getOrderData = async () => {
            try {
                const url = `https://modulo-ventas.onrender.com/getselldetails/${requestData.purchaseOrderId}`;
                const detailsResponse = await axios.get(url);
                setOrderData(detailsResponse.data[0])
            } catch (error) {
                console.log(error);
            }
        }

        getClientData().then(() => {
        })

        getOrderData().then(() => {
        })
    }, [requestData])

    return (
        <div className={styles.mainContainer}>
            <SideBar/>
            <div className={styles.repairRequestContainer}>
                <form>
                    <h1>Detalles de Solicitud</h1>
                    <div className={styles.mainDataContainer}>
                        <div>
                            <h2>Datos del Cliente</h2>
                            <div className={styles.searchClientContainer}>
                                <label className={'form-label'}>DNI Cliente:</label>
                                <input name={'clientId'} className={'form-control'}
                                       value={clientData.dni ? clientData.dni : ''}
                                       readOnly/>
                            </div>
                            <div className={styles.userDataInput}>
                                <TextInput name={'nombres'} label={'Nombres:'}
                                           value={clientData.nombre ? clientData.nombre : ''}/>
                                <TextInput name={'apellidos'} label={'Apellidos:'}
                                           value={clientData.apellido ? clientData.apellido : ''}/>
                                <TextInput name={'fechanac'} label={'Fecha de Nacimiento:'}
                                           value={clientData.fechanac ? clientData.fechanac : ''}/>
                                <TextInput name={'correo'} label={'Correo de Contacto:'}
                                           value={clientData.correo ? clientData.correo : ''}/>
                            </div>
                        </div>
                        <div>
                            <h2>Datos de Venta</h2>
                            <div>
                                <label className={'form-label'}>Venta Asociada:</label>
                                <input name={'orderId'} className={'form-control'}
                                       value={requestData.purchaseOrderId ? requestData.purchaseOrderId : ''}
                                       readOnly/>
                            </div>
                            <div className={styles.userDataInput}>
                                <TextInput name={'producto'} label={'Producto:'}
                                           value={orderData.id_producto ? orderData.id_producto : ''}/>
                                <TextInput name={'precio'} label={'Precio de Equipo:'}
                                           value={orderData.coste_total ? orderData.coste_total : ''}/>
                                <TextInput name={'garantia'} label={'Garantía:'}
                                           value={orderData.id_garantia ? orderData.id_garantia : ''}/>
                                <TextInput name={'fecha'} label={'Tiempo de Garantía:'}
                                           value={orderData.tipo ? orderData.tipo : ''}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2>Información de Solicitud</h2>
                        <div className={styles.userDataInput}>
                            <TextInput name={'estado'} label={'Estado del Dispositivo:'}
                                       value={requestData.deviceStatus ? requestData.deviceStatus : ''}/>
                            <TextInput name={'email'} label={'Correo alternativo:'}
                                       value={requestData.contactEmailInfo ? requestData.contactEmailInfo : ''}/>
                            <TextInput name={'descripción'} label={'Descripción del problema:'}
                                       value={requestData.description ? requestData.description : ''}/>
                            <TextInput name={'motivo'} label={'Motivo:'}
                                       value={requestData.motive ? requestData.motive : ''}/>
                        </div>
                    </div>
                    <button type={'button'} className={styles.cancelButton} onClick={() => {
                        navigate(-1)
                    }}>Volver
                    </button>
                </form>
            </div>
        </div>
    )
}