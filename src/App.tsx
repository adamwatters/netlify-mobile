import { WebBrowser } from "expo";
import * as React from "react";
import {
  Button,
  ConnectionInfo,
  // Linking,
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
  result: string | null;
  netlify: {} | null;
}

export default class App extends React.Component<{}, IAppState> {
  private ticketID: string | null = null;

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
    const { connectionType, result } = this.state || {
      connectionType: null,
      result: null
    };
    return (
      <View style={styles.container}>
        <Text>Hello World!</Text>
        <Text>{`Connection Type: ${connectionType || "loading"}`}</Text>
        <Text>{JSON.stringify(result)}</Text>
        <Button
          onPress={() => {
            this.stepOne();
          }}
          title="Step One"
        />
        <Button
          onPress={() => {
            this.stepTwo();
          }}
          title="Step Two"
        />
        <Button
          onPress={() => {
            this.stepThree();
          }}
          title="Step Three"
        />
      </View>
    );
  }

  private async stepOne() {
    const response = await fetch(
      `${API_URL}/oauth/tickets?client_id=${CLIENT_ID}`,
      {
        method: "POST"
      }
    );
    const json = await response.json();
    WebBrowser.openBrowserAsync(
      `${UI_URL}/authorize?response_type=ticket&ticket=${json.id}`
    );
    // next step should be chained to this action
    // say either: authorization unsuccessful, or automatically continue to step 2
    this.ticketID = json.id;
  }

  private async stepTwo() {
    try {
      const response = await fetch(`${API_URL}/oauth/tickets/${this.ticketID}`);
      const json = await response.json();
      console.log("step two");
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  }

  private async stepThree() {
    try {
      const response = await fetch(
        `${API_URL}/oauth/tickets/${this.ticketID}/exchange`,
        {
          method: "POST"
        }
      );
      const json = await response.json();
      console.log("step three");
      console.log(json);
    } catch (error) {
      console.log(error);
    }
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
