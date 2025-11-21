import React, { useState } from 'react';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonToast, IonCard, IonCardContent, IonBackButton, IonButtons, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { register } from '../services/api';
import { useHistory } from 'react-router-dom';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [toast, setToast] = useState('');
  const history = useHistory();

  const handleRegister = async () => {
    try {
      const res = await register({ email, password, nombre, telefono });
      setToast('Registrado correctamente');
      if (res.token) {
        // Si el registro devuelve token, redirigir al dashboard
        setTimeout(() => {
          history.push('/dashboard');
          window.location.reload();
        }, 500);
      } else {
        // Si no, ir al login
        setTimeout(() => history.push('/login'), 1000);
      }
    } catch (err: any) {
      setToast(err?.response?.data?.error || 'Error en registro');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" />
          </IonButtons>
          <IonTitle>Registrarse</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonCardContent>
            <div className="login-logo">
              <div className="login-logo-icon">P</div>
              <h1 className="login-title">Crear Cuenta</h1>
            </div>

            <IonItem lines="none">
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput 
                value={nombre} 
                placeholder="Tu nombre"
                onIonChange={e => setNombre(String((e.target as any).value))} 
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput 
                type="email"
                value={email} 
                placeholder="tu@email.com"
                onIonChange={e => setEmail(String((e.target as any).value))} 
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel position="stacked">Contraseña</IonLabel>
              <IonInput 
                type="password" 
                value={password} 
                placeholder="••••••••"
                onIonChange={e => setPassword(String((e.target as any).value))} 
              />
            </IonItem>
            <IonItem lines="none">
              <IonLabel position="stacked">Teléfono (opcional)</IonLabel>
              <IonInput 
                value={telefono} 
                placeholder="+57 123 456 7890"
                onIonChange={e => setTelefono(String((e.target as any).value))} 
              />
            </IonItem>
            <IonButton expand="full" className="ion-margin-top" onClick={handleRegister} color="primary">
              Crear cuenta
            </IonButton>
          </IonCardContent>
        </IonCard>
        <IonToast isOpen={!!toast} message={toast} duration={2000} onDidDismiss={() => setToast('')} />
      </IonContent>
    </IonPage>
  );
};

export default Register;
