import { SecureStore } from "expo";

async function getItemAsync(key: string) {
  return SecureStore.getItemAsync(key);
}

async function setItemAsync(key: string, value: string) {
  return SecureStore.setItemAsync(key, value);
}

export { getItemAsync, setItemAsync };
