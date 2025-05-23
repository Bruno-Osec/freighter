import browser from "webextension-polyfill";

export interface SetItemParams {
  [key: string]: any;
}

const storage = browser.storage;

// browser storage uses local storage which stores values on disk and persists data across sessions
// session storage uses session storage which stores data in memory and clears data after every "session"
// only use session storage for secrets or sensitive values
export const browserLocalStorage = storage?.local;
export const browserSessionStorage = storage?.session;

export type StorageOption =
  | typeof browserLocalStorage
  | typeof browserSessionStorage;

export const dataStorage = (
  storageApi: StorageOption = browserLocalStorage,
) => ({
  getItem: async (key: string) => {
    // TODO: re-enable defaults by passing an object. The value of the key-value pair will be the default

    const storageResult: Record<string, any> = await storageApi.get(key);

    return storageResult[key];
  },
  setItem: async (setItemParams: SetItemParams) => {
    await storageApi.set(setItemParams);
  },

  clear: async () => {
    await storageApi.clear();
  },
  remove: async (keys: string | string[]) => {
    await storageApi.remove(keys);
  },
});

export interface DataStorageAccess {
  getItem: (key: string) => Promise<any>;
  setItem: (key: string, value: any) => Promise<void>;
  clear: () => Promise<void>;
  remove: (keys: string | string[]) => Promise<void>;
}

export const dataStorageAccess = (
  storageApi: StorageOption = browserLocalStorage,
) => {
  const store = dataStorage(storageApi);
  return {
    getItem: store.getItem,
    setItem: async (keyId: string, value: any) => {
      await store.setItem({ [keyId]: value });
    },
    clear: () => store.clear(),
    remove: store.remove,
  };
};
