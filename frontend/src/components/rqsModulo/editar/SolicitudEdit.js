import React from 'react'
import SideBar from '../../sideBarComponent/sideBar'
import '../estilosModulo.css';
import Modal from '../componentes/Modal';
import { useNavigate } from 'react-router-dom'

import { useParams} from 'react-router-dom';
import { useState, useEffect } from 'react';

import apiClientes from "../api/clientes"
import api from "../api/api"

const SolicitudEdit = () => {

  const navigate   = useNavigate();

  const [modalVisible, setModalVisible] = useState(false)
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!modalVisible) {
      // Limpiar el estado de procesamiento y mensajes de error al cerrar el modal
      setProcessing(false);
      setErrorMessage('');
    }
  }, [modalVisible]);

  const openModal = () => {
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
    //history.push('/')
  };

  const tiposDeSolicitud = [
    'Cero',
    'Cambio de Plan',  
    'Cancelacion de Servicio',  
    'Nuestro Servicio',  
    'Soporte Tecnico',  
    'Cambio de informacion personal',  
    'Descuentos y promociones',  
    'Informacion o consulta',  
    'Cambio de metodo de pago',
    'Otros']

  const obtenerTipoSolicitud = (id) => {
    switch (id) {
      case 1:
        return tiposDeSolicitud[1]
      case 2:
        return tiposDeSolicitud[2]
      case 3:
        return tiposDeSolicitud[3]
      case 4:
        return tiposDeSolicitud[4]
      case 5:
        return tiposDeSolicitud[5]
      case 6:
        return tiposDeSolicitud[6]
      case 7:
        return tiposDeSolicitud[7]
      case 8:
        return tiposDeSolicitud[8]
      case 9:
        return tiposDeSolicitud[9]
      default:
        return ""
    }
  }

  const { id } = useParams();
  //Variable
  //Raclamos
  const [editAccionesTomadas, setEditAccionesTomadas] = useState()
  const [fechaResolucion, setFechaResolucion] = useState()

  const [users, setUsers] = useState([])
  const [datosRQS, setDatosRQS] = useState(null)
  const [rqsDetalle, setRqsDetalle] = useState(null)
  const [usuarioDetalle, setUsuarioDetalle] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null)


    //Funciones GET para iniciallizar los arreglos
  // Funciones GET Reclamos
  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const response = await api.get('/solicitudes');// Llamar API
        setDatosRQS(response.data);
      } catch (err) {
        if (err.response) {
          // Not in the 200 response range 
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          setError('Error not found');
        } else {
          console.log(`Error API: ${err.message}`);
          setError('Error desconocido');
        }
      }
    }
    fetchSolicitudes();//LLAMAR A LA FUNCION
    let today = new Date();

    // Obtén año, mes y día
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    let day = String(today.getDate()).padStart(2, '0');

    // Formatea la fecha
    let fechaResolucion = `${year}-${month}-${day}`;
    setFechaResolucion(fechaResolucion)
  }, [])

  useEffect(()=>{
    if(datosRQS && datosRQS.length > 0){
        setRqsDetalle(datosRQS.find(dato => (dato.id_solicitud).toString() === id))
    }
  }, [datosRQS])



  useEffect(()=>{
    console.log("Datos cargados:" ,datosRQS)
    if(datosRQS && datosRQS.length > 0 && id > 0){
      console.log("Condicoin", datosRQS[datosRQS.length-1].id_solicitud)
    }
  }, [datosRQS])

  useEffect(()=>{
    console.log("DEtalle recalmo cargado:" ,rqsDetalle)
  }, [rqsDetalle])

  useEffect(() => {
    if(rqsDetalle){
      //console.log("Reclamo no nulo") No nulo es {} "Objeto vacio "y Nulo es null
      
      const fetchCliente = async () => {
        try {
          //await new Promise(resolve => setTimeout(resolve, 2000));
          const response = await apiClientes.get(`/clientes/buscarPorDNI/${rqsDetalle.id_cliente}`);// Llamar API
          setUsuarioDetalle(response.data);
        } catch (err) {
          if (err.response) {
            // Not in the 200 response range 
            setError('Error not found');
            console.log("Error no en 200 ")
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.headers);
          } else {
            setError('Error desconocido');
            console.log(`Error: ${err.message}`);
          }
        }
      }
      fetchCliente()
    }
    

  }, [rqsDetalle]);

  useEffect(() => {
    if (rqsDetalle) {
        setEditAccionesTomadas(rqsDetalle.acciones_tomadas)
        if(editAccionesTomadas !== null){
            console.log("HOla")
        }
    }
  }, [rqsDetalle, setEditAccionesTomadas])

  const handleEdit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const updateData = {
        acciones_tomadas: editAccionesTomadas,
        fecha_respuesta: fechaResolucion
    };
    try {
      openModal();
      const response = await api.patch(`/solicitudes/actions/${rqsDetalle.id_solicitud}`, updateData);
    } catch (err) {
      if (err.response) {
        console.log("Error de respuesta:", err.response.data);
        console.log("Código de estado HTTP:", err.response.status);
        console.log("Encabezados de respuesta:", err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);
      }
      openModal();
      setErrorMessage('Error de procesamiento');
    } finally {
      setProcessing(false);
    }
  }
  
   const fetchClientes = async () => {
     try {
        setLoading(true)
       const response = await apiClientes.get('/clientes');// Llamar API
       setUsers(response.data);
     } catch (err) {
       if (err.response) {
         // Not in the 200 response range 
         console.log(err.response.data);
         console.log(err.response.status);
         console.log(err.response.headers);
       } else {
         console.log(`Error: ${err.message}`);
       }
     }
   }


  return (
        <div className='moduloModuloRQS'>
            <SideBar/>
            <div className='principalModuloRQS'>
              <div className='contenidoCentral'>
                
                <h1>Actualizar Solicitud</h1>
                <div className='Form'>
                  {datosRQS?
                    <>
                      { (rqsDetalle !== undefined && rqsDetalle !== null)?
                          <>
                            <form className="" onSubmit={(e) => handleEdit(e)}>
                              <div>
                                <h2>Informacion del Solicitud</h2>

                                  <div >
                                    <p>ID del Solicitud: {rqsDetalle ? rqsDetalle.id_solicitud : ""}</p>
                                  </div>
                                  <div>
                                    <p>Id del cliente: {rqsDetalle ? rqsDetalle.id_cliente : ""}</p>
                                  </div>
                                  <div >
                                    <p>Tipo de Solicitud: {rqsDetalle ? obtenerTipoSolicitud(rqsDetalle.id_tipo_solicitud) : ""}</p>
                                  </div>
                                  <div >
                                    <p>Fecha de registro: {rqsDetalle ? rqsDetalle.fecha_solicitud : ""}</p>
                                  </div>
                                  <div >
                                    <p>Estado Solicitud: {rqsDetalle ? rqsDetalle.estado : ""}</p>
                                  </div>
                                  <div >
                                    <p>Detalle solicitud: {rqsDetalle ? rqsDetalle.detalle_solicitud : ""}</p>
                                  </div>
                                  <div >
                                    <p>Peticion del cliente: {rqsDetalle ? rqsDetalle.peticion_cliente : ""}</p>
                                  </div>
                              </div>
                              <div >
                                <h2>Informacion del Producto</h2>
                                  <div>
                                    <p>Tipo de bien contratado: {rqsDetalle ? rqsDetalle.tipo_bien_contratado : ""}</p>
                                  </div>
                                  <div>
                                    <p>Orden de compra: {rqsDetalle ? rqsDetalle.orden_compra : ""}</p>
                                  </div>
                                  <div>
                                    <p>Codigo de producto: {rqsDetalle ? rqsDetalle.codigo_producto : ""}</p>
                                  </div>
                              </div>
                              <div >
                                <h2>Datos del cliente</h2>
                                  <div>
                                    <p>DNI: {usuarioDetalle? usuarioDetalle.dni : ""}</p>
                                  </div>
                                  <div>
                                    <p>Nombre: {usuarioDetalle? usuarioDetalle.nombre : ""}</p>
                                  </div>
                                  <div>
                                    <p>Apellido: {usuarioDetalle? usuarioDetalle.apellido : ""}</p>
                                  </div>
                                  <div>
                                    <p>Departamento: {usuarioDetalle? usuarioDetalle.departamento : ""}</p>
                                  </div>
                                  <div>
                                    <p>Distrito: {usuarioDetalle? usuarioDetalle.distrito : ""}</p>
                                  </div>
                                  <div>
                                    <p>Correo: {usuarioDetalle? usuarioDetalle.correo : ""}</p>
                                  </div>
                                  <div>
                                    <p>Sexo: {usuarioDetalle? usuarioDetalle.sexo : ""}</p>
                                  </div>
                              </div>            
                              <div>
                                <h2>Resolución del Reclamo</h2>
                                  <div>
                                    <p>Forma de respuesta: {rqsDetalle? rqsDetalle.forma_respuesta : ""}</p>
                                  </div>
                                  <div>
                                    <p>Fecha de respuesta: {rqsDetalle? rqsDetalle.fecha_respuesta : ""}</p>
                                  </div>
                                  <div>
                                    <p>Fecha limite: {rqsDetalle? rqsDetalle.fecha_limite : ""}</p>
                                  </div>
                                  <div>
                                      <label htmlFor=''>Acciones Tomadas:</label>
                                      <textarea
                                      style={{
                                          border: editAccionesTomadas ? '1px solid #ccc' : '2px solid #ff0000',
                                          borderRadius: '5px',
                                          padding: '8px',
                                        }}
                                      id='accionedTomadas'
                                      type="text"
                                      value={editAccionesTomadas?editAccionesTomadas: ""}
                                      onChange={(e) => setEditAccionesTomadas(e.target.value)}
                                      required
                                      />
                                  </div>
                              </div>            
                              <div className='FormBotones'>
                                  <button className='buttonSolicitud' type='submit'>
                                      Editar
                                  </button>
                                  <button
                                      className='buttonCancelar'
                                      type="button"
                                      onClick={() => {navigate('/modulorqs')}}
                                  >Cancelar</button>
                              </div>
                            </form>
                            <Modal
                            showModal={modalVisible} 
                            closeModal={closeModal}
                            processing={processing}
                            errorMessage={errorMessage}
                            redireccion={"modulorqs"}
                            />                            
                          </>
                        :
                        <>
                          {rqsDetalle === undefined && <p>No encontrado</p>}
                          {rqsDetalle === null && <p>Cargando Informacion</p>}
                        </>
                      }
                    </>:
                    <>
                      {error === null?<p>Cargando Informacion</p>:<p>{error}</p> }
                    </>
                  }
                </div>
            </div> 
            </div> 
        </div>
  )
}

export default SolicitudEdit