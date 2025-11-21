import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonToast, IonBackButton, IonButtons, IonCard, IonCardContent, IonIcon, IonInput, IonCardHeader, IonCardTitle } from '@ionic/react';
import { getMisVehiculos, eliminarVehiculo, crearVehiculo } from '../services/api';
import { carSport, trashOutline, addOutline } from 'ionicons/icons';

const MisVehiculos: React.FC = () => {
  const [vehiculos, setVehiculos] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [color, setColor] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMisVehiculos();
      setVehiculos(res);
    } catch (err) {
      setToast('Error cargando vehículos');
    }
  };

  const handleCreate = async () => {
    if (!placa) {
      setToast('La placa es requerida');
      return;
    }
    try {
      await crearVehiculo({ placa, marca, modelo, color });
      setToast('Vehículo creado exitosamente');
      setPlaca('');
      setMarca('');
      setModelo('');
      setColor('');
      setShowForm(false);
      load();
    } catch (err: any) {
      setToast(err?.response?.data?.error || 'Error creando vehículo');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await eliminarVehiculo(id);
      setToast('Vehículo eliminado');
      load();
    } catch (err) {
      setToast('Error eliminando');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Mis Vehículos</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={() => setShowForm(!showForm)} className="ion-margin-bottom">
          <IonIcon icon={addOutline} slot="start" />
          {showForm ? 'Cancelar' : 'Agregar Vehículo'}
        </IonButton>

        {showForm && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Nuevo Vehículo</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Placa *</IonLabel>
                <IonInput 
                  value={placa} 
                  placeholder="ABC123"
                  onIonChange={e => setPlaca(String((e.target as any).value))} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Marca</IonLabel>
                <IonInput 
                  value={marca} 
                  placeholder="Toyota"
                  onIonChange={e => setMarca(String((e.target as any).value))} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Modelo</IonLabel>
                <IonInput 
                  value={modelo} 
                  placeholder="Corolla"
                  onIonChange={e => setModelo(String((e.target as any).value))} 
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Color</IonLabel>
                <IonInput 
                  value={color} 
                  placeholder="Rojo"
                  onIonChange={e => setColor(String((e.target as any).value))} 
                />
              </IonItem>
              <IonButton expand="full" onClick={handleCreate} className="ion-margin-top" disabled={!placa}>
                Crear Vehículo
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {vehiculos.length === 0 && !showForm ? (
          <IonCard>
            <IonCardContent className="ion-text-center">
              <IonIcon icon={carSport} style={{ fontSize: '64px', color: '#6366f1' }} />
              <p>No tienes vehículos registrados</p>
            </IonCardContent>
          </IonCard>
        ) : (
          <IonList>
            {vehiculos.map(v => (
              <IonItem key={v.id}>
                <IonIcon icon={carSport} slot="start" color="primary" />
                <IonLabel>
                  <h2>{v.placa}</h2>
                  <p>{v.marca} {v.modelo} {v.color && `- ${v.color}`}</p>
                </IonLabel>
                <IonButton color="danger" fill="outline" onClick={() => handleDelete(v.id)}>
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        )}
        <IonToast isOpen={!!toast} message={toast} duration={2000} onDidDismiss={() => setToast('')} />
      </IonContent>
    </IonPage>
  );
};

export default MisVehiculos;
