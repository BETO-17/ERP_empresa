import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AuthProvider } from './app/providers/AuthContext';
import { ToastProvider } from './app/providers/ToastContext';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
