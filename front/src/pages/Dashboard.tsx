import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonInput,
  IonToast,
  IonBadge,
  IonSelect,
  IonSelectOption,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import {
  getUsuarioActual,
  logout,
  getMisReservas,
  getMisVehiculos,
  getEspaciosDisponibles,
  getTodosLosEspacios,
  crearVehiculo,
  eliminarVehiculo,
  crearReserva,
  terminarReserva,
} from '../services/api';
import {
  documentTextOutline,
  carSportOutline,
  gridOutline,
  closeOutline,
  addOutline,
  trashOutline,
} from 'ionicons/icons';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'reservas' | 'vehiculos' | 'espacios'>('reservas');
  const [reservas, setReservas] = useState<any[]>([]);
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [espacios, setEspacios] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const history = useHistory();

  // Modal states
  const [showVehiculoModal, setShowVehiculoModal] = useState(false);
  const [showReservaModal, setShowReservaModal] = useState(false);

  // Form states - Vehículo
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');

  // Form states - Reserva
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState('');
  const [espacioSeleccionado, setEspacioSeleccionado] = useState('');
  const [fechaEntrada, setFechaEntrada] = useState('');

  useEffect(() => {
    loadData();
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setFechaEntrada(localDate);
  }, []);

  useEffect(() => {
    if (activeTab === 'reservas') loadReservas();
    else if (activeTab === 'vehiculos') {
      loadVehiculos();
      loadReservas(); // Cargar reservas para validar eliminación
    }
    else if (activeTab === 'espacios') loadEspacios();
  }, [activeTab]);

  const loadData = async () => {
    try {
      const usr = await getUsuarioActual();
      setUsuario(usr);
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const loadReservas = async () => {
    try {
      const res = await getMisReservas();
      setReservas(res);
    } catch (err) {
      setToast('Error cargando reservas');
    }
  };

  const loadVehiculos = async () => {
    try {
      const res = await getMisVehiculos();
      setVehiculos(res);
    } catch (err) {
      setToast('Error cargando vehículos');
    }
  };

  const loadEspacios = async () => {
    try {
      const res = await getTodosLosEspacios();
      setEspacios(res);
    } catch (err) {
      setToast('Error cargando espacios');
    }
  };

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  const handleCrearVehiculo = async () => {
    if (!placa) {
      setToast('La placa es requerida');
      return;
    }
    try {
      await crearVehiculo({ placa, marca, modelo, color });
      setToast('Vehículo agregado exitosamente');
      setPlaca('');
      setMarca('');
      setModelo('');
      setColor('');
      setShowVehiculoModal(false);
      loadVehiculos();
    } catch (err: any) {
      setToast(err?.response?.data?.error || 'Error creando vehículo');
    }
  };

  const handleEliminarVehiculo = async (id: number) => {
    // Verificar si el vehículo tiene reservas activas
    const tieneReservaActiva = reservas.some(
      (r) => r.vehiculo_id === id && r.estado === 'activa'
    );
    
    if (tieneReservaActiva) {
      setToast('No puedes eliminar un vehículo con reservas activas');
      return;
    }
    
    try {
      await eliminarVehiculo(id);
      setToast('Vehículo eliminado');
      loadVehiculos();
    } catch (err: any) {
      setToast(err?.response?.data?.error || 'Error eliminando vehículo');
    }
  };

  const handleCrearReserva = async () => {
    if (!vehiculoSeleccionado || !espacioSeleccionado || !fechaEntrada) {
      setToast('Completa todos los campos');
      return;
    }
    
    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(fechaEntrada);
    const ahora = new Date();
    
    if (fechaSeleccionada < ahora) {
      setToast('La fecha de entrada no puede ser anterior a la fecha actual');
      return;
    }
    
    try {
      const isoDate = new Date(fechaEntrada).toISOString();
      await crearReserva({
        vehiculo_id: Number(vehiculoSeleccionado),
        espacio_id: Number(espacioSeleccionado),
        fecha_entrada: isoDate,
      });
      setToast('Reserva creada exitosamente');
      setVehiculoSeleccionado('');
      setEspacioSeleccionado('');
      setShowReservaModal(false);
      loadReservas();
      if (activeTab === 'espacios') loadEspacios();
    } catch (err: any) {
      setToast(err?.response?.data?.error || 'Error creando reserva');
    }
  };

  const handleTerminarReserva = async (id: number) => {
    try {
      await terminarReserva(id);
      setToast('Reserva terminada');
      loadReservas();
      if (activeTab === 'espacios') loadEspacios();
    } catch (err) {
      setToast('Error terminando reserva');
    }
  };

  const handleOpenReservaModal = async () => {
    await loadVehiculos();
    // Para el modal de reserva, obtener solo espacios disponibles
    try {
      const espaciosDisp = await getEspaciosDisponibles();
      setEspacios(espaciosDisp);
    } catch (err) {
      setToast('Error cargando espacios disponibles');
    }
    setShowReservaModal(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  background: 'white',
                  color: '#5b50e0',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '20px',
                }}
              >
                P
              </div>
              <IonTitle style={{ padding: 0, fontSize: '20px' }}>Parqueadero</IonTitle>
            </div>
            <IonButton fill="solid" color="light" onClick={handleLogout}>
              Cerrar sesión
            </IonButton>
          </div>
        </IonToolbar>
        {usuario && (
          <div style={{ background: '#5b50e0', color: 'white', padding: '12px 16px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}>Bienvenido, {usuario.nombre}</p>
          </div>
        )}
      </IonHeader>

      <IonContent>
        {/* Tabs Navigation */}
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === 'reservas' ? 'active' : ''}`}
            onClick={() => setActiveTab('reservas')}
          >
            <IonIcon icon={documentTextOutline} />
            Mis Reservas
          </button>
          <button
            className={`tab-button ${activeTab === 'vehiculos' ? 'active' : ''}`}
            onClick={() => setActiveTab('vehiculos')}
          >
            <IonIcon icon={carSportOutline} />
            Mis Vehiculos
          </button>
          <button
            className={`tab-button ${activeTab === 'espacios' ? 'active' : ''}`}
            onClick={() => setActiveTab('espacios')}
          >
            <IonIcon icon={gridOutline} />
            Espacios
          </button>
        </div>

        {/* Mis Reservas Tab */}
        {activeTab === 'reservas' && (
          <div className="ion-padding">
            <h2 style={{ marginTop: 0 }}>Mis Reservas Activas</h2>
            <IonButton expand="block" color="primary" onClick={handleOpenReservaModal}>
              <IonIcon icon={addOutline} slot="start" />
              Nueva Reserva
            </IonButton>

            {reservas.filter((r) => r.estado === 'activa').length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
                No tienes reservas activas
              </p>
            ) : (
              <IonList style={{ marginTop: '1rem' }}>
                {reservas
                  .filter((r) => r.estado === 'activa')
                  .map((r) => (
                    <IonCard key={r.id} style={{ margin: '12px 0' }}>
                      <IonCardContent>
                        <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                          {r.vehiculo?.placa || `Vehículo ID: ${r.vehiculo_id}`}
                        </h3>
                        <p style={{ margin: '4px 0', fontSize: '14px' }}>
                          <strong>Espacio:</strong> {r.espacio?.numero_espacio || r.espacio_id} (
                          {r.espacio?.piso ? `Piso ${r.espacio.piso}` : ''})
                        </p>
                        <p style={{ margin: '4px 0', fontSize: '14px' }}>
                          <strong>Entrada:</strong>{' '}
                          {new Date(r.fecha_entrada).toLocaleString('es-CO')}
                        </p>
                        <p style={{ margin: '4px 0 12px 0', fontSize: '14px' }}>
                          <strong>Estado:</strong>{' '}
                          <IonBadge color="primary">{r.estado}</IonBadge>
                        </p>
                        <IonButton
                          expand="block"
                          color="danger"
                          onClick={() => handleTerminarReserva(r.id)}
                        >
                          Terminar
                        </IonButton>
                      </IonCardContent>
                    </IonCard>
                  ))}
              </IonList>
            )}
          </div>
        )}

        {/* Mis Vehículos Tab */}
        {activeTab === 'vehiculos' && (
          <div className="ion-padding">
            <h2 style={{ marginTop: 0 }}>Mis Vehiculos</h2>
            <IonButton expand="block" color="primary" onClick={() => setShowVehiculoModal(true)}>
              <IonIcon icon={addOutline} slot="start" />
              Agregar Vehiculo
            </IonButton>

            {vehiculos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
                No tienes vehiculos registrados
              </p>
            ) : (
              <IonList style={{ marginTop: '1rem' }}>
                {vehiculos.map((v) => (
                  <IonCard key={v.id} style={{ margin: '12px 0' }}>
                    <IonCardContent>
                      <h3 style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>{v.placa}</h3>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Marca:</strong> {v.marca || 'N/A'}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '14px' }}>
                        <strong>Modelo:</strong> {v.modelo || 'N/A'}
                      </p>
                      <p style={{ margin: '4px 0 12px 0', fontSize: '14px' }}>
                        <strong>Color:</strong> {v.color || 'N/A'}
                      </p>
                      <IonButton
                        expand="block"
                        color="danger"
                        onClick={() => handleEliminarVehiculo(v.id)}
                      >
                        Eliminar
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonList>
            )}
          </div>
        )}

        {/* Espacios Tab */}
        {activeTab === 'espacios' && (
          <div className="ion-padding">
            <h2 style={{ marginTop: 0 }}>Espacios del Parqueadero</h2>
            {espacios.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
                No hay espacios registrados
              </p>
            ) : (
              <div className="espacios-grid">
                {espacios.map((e) => (
                  <div
                    key={e.id}
                    className={`espacio-card ${e.disponible ? 'disponible' : 'ocupado'}`}
                  >
                    <h3>{e.numero_espacio}</h3>
                    <p>Piso {e.piso}</p>
                    <p className="estado">
                      {e.disponible ? '✓ Disponible' : '✗ Ocupado'}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Agregar Vehículo */}
        <IonModal isOpen={showVehiculoModal} onDidDismiss={() => setShowVehiculoModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Agregar Vehiculo</IonTitle>
              <IonButton slot="end" fill="clear" onClick={() => setShowVehiculoModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Placa</IonLabel>
              <IonInput
                value={placa}
                placeholder="VPT95F"
                onIonChange={(e) => setPlaca(String((e.target as any).value))}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Marca</IonLabel>
              <IonInput
                value={marca}
                placeholder="Yamaha"
                onIonChange={(e) => setMarca(String((e.target as any).value))}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Modelo</IonLabel>
              <IonInput
                value={modelo}
                placeholder="XTZ125"
                onIonChange={(e) => setModelo(String((e.target as any).value))}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Color</IonLabel>
              <IonInput
                value={color}
                placeholder="Blanco"
                onIonChange={(e) => setColor(String((e.target as any).value))}
              />
            </IonItem>
            <IonButton
              expand="block"
              onClick={handleCrearVehiculo}
              disabled={!placa}
              style={{ marginTop: '1rem' }}
            >
              Agregar
            </IonButton>
          </IonContent>
        </IonModal>

        {/* Modal Nueva Reserva */}
        <IonModal isOpen={showReservaModal} onDidDismiss={() => setShowReservaModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nueva Reserva</IonTitle>
              <IonButton slot="end" fill="clear" onClick={() => setShowReservaModal(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Vehiculo</IonLabel>
              <IonSelect
                value={vehiculoSeleccionado}
                placeholder="Selecciona un vehículo"
                onIonChange={(e) => setVehiculoSeleccionado(e.detail.value)}
              >
                {vehiculos.map((v) => (
                  <IonSelectOption key={v.id} value={v.id}>
                    {v.placa} - {v.marca} {v.modelo}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Espacio</IonLabel>
              <IonSelect
                value={espacioSeleccionado}
                placeholder="Selecciona un espacio"
                onIonChange={(e) => setEspacioSeleccionado(e.detail.value)}
              >
                {espacios
                  .filter((e) => e.disponible)
                  .map((e) => (
                    <IonSelectOption key={e.id} value={e.id}>
                      {e.numero_espacio} - Piso {e.piso}
                    </IonSelectOption>
                  ))}
              </IonSelect>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Fecha/Hora de Entrada</IonLabel>
              <IonInput
                type="datetime-local"
                value={fechaEntrada}
                onIonChange={(e) => setFechaEntrada(String((e.target as any).value))}
              />
            </IonItem>
            <IonButton
              expand="block"
              onClick={handleCrearReserva}
              disabled={!vehiculoSeleccionado || !espacioSeleccionado}
              style={{ marginTop: '1rem' }}
            >
              Reservar
            </IonButton>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={2000}
          onDidDismiss={() => setToast('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
