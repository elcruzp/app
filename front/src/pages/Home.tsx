import React, { useEffect, useState } from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonPage,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonToast,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonButtons,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getEspaciosDisponibles, crearReserva, getUsuarioActual, logout } from '../services/api';
import { carSport, calendar, logOutOutline, personCircle, locationOutline } from 'ionicons/icons';

const Home: React.FC = () => {
  const [espacios, setEspacios] = useState<any[]>([]);
  const [vehiculoId, setVehiculoId] = useState('');
  const [selectedEspacio, setSelectedEspacio] = useState<number | null>(null);
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const [usuario, setUsuario] = useState<any>(null);
  const history = useHistory();

  useEffect(() => {
    loadEspacios();
    loadUsuario();
    // Set default fecha_entrada to current datetime
    const now = new Date().toISOString();
    setFechaEntrada(now);
  }, []);

  const loadUsuario = async () => {
    try {
      const usr = await getUsuarioActual();
      setUsuario(usr);
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const loadEspacios = async () => {
    try {
      const res = await getEspaciosDisponibles();
      setEspacios(res);
    } catch (err: any) {
      setToastMsg('Error cargando espacios');
    }
  };

  const handleReserva = async () => {
    if (!vehiculoId || !selectedEspacio || !fechaEntrada) {
      setToastMsg('Completa todos los campos');
      return;
    }
    try {
      await crearReserva({ vehiculo_id: Number(vehiculoId), espacio_id: selectedEspacio, fecha_entrada: fechaEntrada });
      setToastMsg('Reserva creada exitosamente');
      setVehiculoId('');
      setFechaEntrada(new Date().toISOString());
      setSelectedEspacio(null);
      loadEspacios();
    } catch (err: any) {
      setToastMsg(err?.response?.data?.error || 'Error creando reserva');
    }
  };

  const handleLogout = async () => {
    await logout();
    history.push('/login');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>
            <IonIcon icon={carSport} /> Parqueadero
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="icon-only" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {usuario && (
          <IonCard color="light">
            <IonCardContent>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IonIcon icon={personCircle} style={{ fontSize: '48px', color: '#6366f1' }} />
                <div>
                  <h2 style={{ margin: 0, fontSize: '20px' }}>¡Hola, {usuario.nombre}!</h2>
                  <p style={{ margin: 0, color: '#6b7280' }}>{usuario.email}</p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
          <IonButton expand="block" fill="outline" color="primary" onClick={() => history.push('/mis-vehiculos')}>
            <IonIcon icon={carSport} slot="start" />
            Mis Vehículos
          </IonButton>
          <IonButton expand="block" fill="outline" color="primary" onClick={() => history.push('/mis-reservas')}>
            <IonIcon icon={calendar} slot="start" />
            Mis Reservas
          </IonButton>
        </div>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={locationOutline} /> Nueva Reserva
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Espacios Disponibles</IonLabel>
            </IonItem>
            {espacios.length === 0 ? (
              <p className="ion-padding ion-text-center" style={{ color: '#6b7280' }}>
                No hay espacios disponibles
              </p>
            ) : (
              <IonList>
                {espacios.map((e: any) => (
                  <IonItem 
                    key={e.id} 
                    button 
                    onClick={() => setSelectedEspacio(e.id)} 
                    color={selectedEspacio === e.id ? 'primary' : undefined}
                  >
                    <IonIcon icon={locationOutline} slot="start" />
                    <IonLabel>
                      <h2>Espacio {e.numero_espacio}</h2>
                      <p>Piso {e.piso} — {e.tipo}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}

            <IonItem>
              <IonLabel position="stacked">ID del Vehículo</IonLabel>
              <IonInput 
                type="number"
                value={vehiculoId} 
                placeholder="Ingresa el ID de tu vehículo"
                onIonChange={(e: any) => setVehiculoId(String(e.target.value))} 
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Fecha de entrada</IonLabel>
              <IonInput 
                type="datetime-local"
                value={fechaEntrada.slice(0, 16)} 
                onIonChange={(e: any) => {
                  const val = String(e.target.value);
                  if (val) {
                    setFechaEntrada(new Date(val).toISOString());
                  }
                }}
              />
            </IonItem>

            <IonButton 
              expand="full" 
              onClick={handleReserva} 
              className="ion-margin-top"
              disabled={!vehiculoId || !selectedEspacio}
            >
              Crear Reserva
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonToast isOpen={!!toastMsg} message={toastMsg} duration={2000} onDidDismiss={() => setToastMsg('')} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
