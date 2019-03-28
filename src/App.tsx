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
import { INetlifySite, INetlifyUser, Netlify } from "./Netlify";

interface IAppState {
  connectionType: string | null;
  user: INetlifyUser | null;
  sites: INetlifySite[];
}

export default class App extends React.Component<{}, IAppState> {
  private netlify: Netlify = new Netlify();

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
    this.netlify.init().then(() => {
      this.signIn();
    });
  }

  public render() {
    const { connectionType, user, sites } = this.state || {
      connectionType: null,
      sites: [],
      user: null
    };
    return (
      <View style={styles.container}>
        <Text>Hello World!</Text>
        <Text>{`Connection Type: ${connectionType || "loading"}`}</Text>
        {!user && (
          <Button
            onPress={() => {
              this.signIn();
            }}
            title="Sign In"
          />
        )}
        {user && (
          <Button
            onPress={() => {
              this.signOut();
            }}
            title="Switch User"
          />
        )}
        {user && <Text>{user.email}</Text>}
        {sites &&
          sites.map(site => {
            return (
              <Button
                key={site.id}
                onPress={() => {
                  WebBrowser.openBrowserAsync(site.url);
                }}
                title={site.name}
              />
            );
          })}
      </View>
    );
  }

  public async signIn() {
    const authorized = await this.netlify.isAuthorized();
    if (authorized) {
      this.getAndSetData();
    } else {
      const wasSuccessful = await this.netlify.authorizationFlow();
      if (wasSuccessful) {
        this.getAndSetData();
      }
    }
  }

  public signOut() {
    this.netlify.signOut();
    this.setState({
      sites: [],
      user: null
    });
  }

  public getAndSetData() {
    this.netlify.getCurrentUser().then(user => this.setState({ user }));
    this.netlify.getSites().then(sites => this.setState({ sites }));
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
