import {useCallback, useEffect, useSyncExternalStore} from "react";

// Función para despachar eventos de almacenamiento
function dispatchStorageEvent(key, newValue) {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}

// Función para establecer un valor en localStorage
const setLocalStorageItem = (key, value) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

// Función para eliminar un item de localStorage
const removeLocalStorageItem = (key) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

// Función para obtener un valor de localStorage
const getLocalStorageItem = (key) => {
  return window.localStorage.getItem(key);
};

// Suscriptor de eventos de almacenamiento
const useLocalStorageSubscribe = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

// Esto se lanza si se usa en el servidor
const getLocalStorageServerSnapshot = () => {
  throw Error("useLocalStorage is a client-only hook");
};

// Hook principal
export function useLocalStorage(key, initialValue) {
  const getSnapshot = () => {
    // Solo devolver el valor de localStorage si está disponible
    if (typeof window !== "undefined") {
      return getLocalStorageItem(key);
    }
    return null;
  };

  // useSyncExternalStore para suscripción al almacenamiento
  const store = useSyncExternalStore(
    useLocalStorageSubscribe,
    getSnapshot,
    getLocalStorageServerSnapshot
  );

  const setState = useCallback(
    (v) => {
      try {
        // Convertir el valor recibido en un estado válido
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
        } else {
          setLocalStorageItem(key, nextState);
        }
      } catch (e) {
        console.warn(e); // Manejar posibles errores en JSON
      }
    },
    [key, store]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Si el valor no existe en localStorage, inicialízalo con el valor inicial
      if (getLocalStorageItem(key) === null && typeof initialValue !== "undefined") {
        setLocalStorageItem(key, initialValue);
      }
    }
  }, [key, initialValue]);

  // Devolver el valor procesado o el valor inicial
  return [store ? JSON.parse(store) : initialValue, setState];
}