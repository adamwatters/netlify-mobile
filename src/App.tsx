import * as React from "react";
import { ConnectionInfo, NetInfo, StyleSheet, Text, View } from "react-native";

interface IAppState {
  connectionType: string;
  effectiveType: string;
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
    const { connectionType } = this.state || { connectionType: null };
    return (
      <View style={styles.container}>
        <Text>Hello World!</Text>
        <Text>{`Connection Type: ${connectionType || "loading"}`}</Text>
      </View>
    );
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
