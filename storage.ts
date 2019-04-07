import { AsyncStorage } from "react-native";

async function getItemAsync(key: string) {
  return AsyncStorage.getItem(key);
}

async function setItemAsync(key: string, value: string) {
  return AsyncStorage.setItem(key, value);
}

export { getItemAsync, setItemAsync };
