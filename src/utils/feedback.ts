// Gestion du feedback utilisateur
import { toast } from 'react-toastify';

export const showSuccess = (message: string) => {
  toast.success(message, {
    position: 'bottom-right',
    autoClose: 3000,
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    position: 'bottom-right',
    autoClose: 5000,
  });
};

export const showInfo = (message: string) => {
  toast.info(message, {
    position: 'bottom-right',
    autoClose: 3000,
  });
};