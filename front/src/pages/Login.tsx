import React, { useState } from 'react';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonToast, IonCard, IonCardContent } from '@ionic/react';
import { login } from '../services/api';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      console.log('Intentando login con:', { email, password: '***' });
      const res = await login({ email, password });
      console.log('Respuesta del servidor:', res);
      if (res.token) {
        console.log('Token guardado, redirigiendo...');
        setToast('Login exitoso');
        setTimeout(() => {
          history.push('/dashboard');
          window.location.reload(); // Forzar recarga para actualizar el estado
        }, 500);
      }
    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Error response:', err?.response);
      const errorMsg = err?.response?.data?.error || err?.message || 'Error en login';
      setToast(errorMsg);
    }
  };

  return (
    <IonPage>
      <IonContent className="login-background">
        <div className="ion-padding">
          <IonCard className="login-card">
            <IonCardContent>
              <div className="login-logo">
                <div className="login-logo-icon">P</div>
                <h1 className="login-title">Parqueadero</h1>
              </div>

              <h2 className="login-subtitle">Iniciar Sesión</h2>

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

              <IonButton 
                expand="full" 
                className="ion-margin-top" 
                onClick={handleLogin}
                color="primary"
              >
                Entrar
              </IonButton>

              <div className="register-link">
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>
                  ¿No tienes cuenta?{' '}
                  <span 
                    onClick={() => history.push('/register')}
                    style={{ color: '#6366f1', cursor: 'pointer', fontWeight: '600' }}
                  >
                    Registrarse
                  </span>
                </p>
              </div>
            </IonCardContent>
          </IonCard>
        </div>
        <IonToast isOpen={!!toast} message={toast} duration={2000} onDidDismiss={() => setToast('')} />
      </IonContent>
    </IonPage>
  );
};

export default Login;
