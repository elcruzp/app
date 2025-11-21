import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonToast, IonBackButton, IonButtons, IonBadge, IonCard, IonCardContent, IonIcon } from '@ionic/react';
import { getMisReservas, terminarReserva } from '../services/api';
import { calendar, checkmarkCircle, timeOutline } from 'ionicons/icons';

const MisReservas: React.FC = () => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMisReservas();
      setReservas(res);
    } catch (err) {
      setToast('Error cargando reservas');
    }
  };

  const handleTerminar = async (id: number) => {
    try {
      await terminarReserva(id);
      setToast('Reserva terminada');
      load();
    } catch (err) {
      setToast('Error');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Mis Reservas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {reservas.length === 0 ? (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <IonIcon icon={calendar} style={{ fontSize: '64px', color: '#6366f1' }} />
              <p>No tienes reservas</p>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonList>
            {reservas.map(r => (
              <IonItem key={r.id}>
                <IonIcon icon={r.terminado ? checkmarkCircle : timeOutline} slot="start" color={r.terminado ? 'success' : 'warning'} />
                <IonLabel>
                  <h2>Vehículo ID: {r.vehiculo_id}</h2>
                  <p>{new Date(r.fecha_entrada).toLocaleString('es-CO')}</p>
                  <IonBadge color={r.terminado ? 'success' : 'warning'}>
                    {r.terminado ? 'Terminado' : 'Activa'}
                  </IonBadge>
                </IonLabel>
                {!r.terminado && (
                  <IonButton color="primary" onClick={() => handleTerminar(r.id)}>
                    Terminar
                  </IonButton>
                )}
              </IonItem>
            ))}
          </IonList>
        )}
        <IonToast isOpen={!!toast} message={toast} duration={2000} onDidDismiss={() => setToast('')} />
      </IonContent>
    </IonPage>
  );
};

export default MisReservas;
