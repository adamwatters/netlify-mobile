import * as React from "react";
import {
  Button,
  ConnectionInfo,
  Linking,
  NetInfo,
  StyleSheet,
  Text,
  View
} from "react-native";
import { CLIENT_ID } from "../dotenv";

export const API_URL = "https://api.netlify.com/api/v1";
export const UI_URL = "https://app.netlify.com";

interface IAppState {
  connectionType: string;
  effectiveType: string;
  authorized: string | null;
}

export default class App extends React.Component<{}, IAppState> {
  public componentDidMount() {
    NetInfo.getConnectionInfo().then(connectionInfo => {
      this.setState({
        connectionType: connectionInfo.type
      });
    });
    NetInfo.addEventListener("connectionChange", connectionInfo => {
      const ci = connectionInfo as ConnectionInfo;
      this.setState({
        connectionType: ci.type
      });
    });
  }

  public render() {
    const { connectionType, authorized } = this.state || {
      connectionType: null,
      authorized: null
    };
    return (
      <View style={styles.container}>
        <Text>Hello World!</Text>
        <Text>{`Connection Type: ${connectionType || "loading"}`}</Text>
        <Text>{`Authorized: ${authorized || "no"}`}</Text>
        <Button
          onPress={() => {
            this.connect();
          }}
          title="Connect"
        />
      </View>
    );
  }

  private async connect() {
    const response = await fetch(
      `${API_URL}/oauth/tickets?client_id=${CLIENT_ID}`,
      {
        method: "POST"
      }
    );
    const json = await response.json();
    Linking.openURL(
      `${UI_URL}/authorize?response_type=ticket&ticket=${json.id}`
    );

    // TODO: maybe diagram the auth process before trying to implement 🤔
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "lightblue",
    flex: 1,
    justifyContent: "center"
  }
});
