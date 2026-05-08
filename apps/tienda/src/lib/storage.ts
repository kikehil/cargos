const isWeb = typeof window !== 'undefined';

export const getItemAsync = async (key: string) => {
  if (isWeb) {
    return localStorage.getItem(key);
  }
  // En nativo esto fallaría si no está la librería, 
  // pero para el demo web esto es suficiente.
  return null;
};

export const setItemAsync = async (key: string, value: string) => {
  if (isWeb) {
    localStorage.setItem(key, value);
  }
};

export const deleteItemAsync = async (key: string) => {
  if (isWeb) {
    localStorage.removeItem(key);
  }
};
