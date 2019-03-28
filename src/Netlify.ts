import { WebBrowser } from "expo";
import { CLIENT_ID } from "../dotenv";
import { getItemAsync, setItemAsync } from "./storage";

const API_URL = "https://api.netlify.com/api/v1";
const UI_URL = "https://app.netlify.com";

export interface INetlifyUser {
  email: string;
}

export interface INetlifySite {
  id: string;
  name: string;
  url: string;
  admin_url: string;
}

export class Netlify {
  private accessToken: string | null = null;

  public async init() {
    // tslint:disable-next-line
    console.log("init netlify");
    getItemAsync("accessToken").then((token: string | null) => {
      this.accessToken = token;
    });
  }

  public async isAuthorized(): Promise<boolean> {
    if (this.accessToken) {
      try {
        await this.getCurrentUser();
        return true;
      } catch (e) {
        // fetching the current user failed
        // meaning that the access token is not valid
        // -> clear access token and issue a new one
        this.accessToken = null;
      }
    }
    return false;
  }

  public async authorizationFlow(): Promise<boolean> {
    const waitFor = (delay: number): Promise<void> =>
      new Promise(resolve => setTimeout(resolve, delay));
    const ticketResponse = await fetch(
      `${API_URL}/oauth/tickets?client_id=${CLIENT_ID}`,
      {
        method: "POST"
      }
    );
    const { id } = await ticketResponse.json();
    await WebBrowser.openBrowserAsync(
      `${UI_URL}/authorize?response_type=ticket&ticket=${id}`
    );

    // poll netlify for authorized ticket
    let count = 0;
    while (!this.checkTicket(id)) {
      if (count > 10) {
        return false;
      }
      count++;
      await waitFor(1000);
    }

    const accessToken = await this.getAccessToken(id);
    if (accessToken) {
      this.accessToken = accessToken;
      await setItemAsync("accessToken", accessToken);
      return true;
    } else {
      return false;
    }
  }

  public getCurrentUser(): Promise<INetlifyUser> {
    return this.fetch<INetlifyUser>("/user");
  }

  public getSites(): Promise<INetlifySite[]> {
    return this.fetch<INetlifySite[]>("/sites");
  }

  public signOut(): void {
    this.accessToken = null;
  }

  private async fetch<T>(path: string, method: string = "GET"): Promise<T> {
    // tslint:disable-next-line
    console.log("NETLIFY CALL:", path, method);
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        authorization: `Bearer ${this.accessToken}`
      },
      method
    });

    if (response.status === 401) {
      throw new Error("NOT_AUTHORIZED");
    }

    // tslint:disable-next-line
    console.log("NETLIFY CALL DONE:", path, method);
    return response.json();
  }

  private async getAccessToken(id: string) {
    const response = await fetch(`${API_URL}/oauth/tickets/${id}/exchange`, {
      method: "POST"
    });
    const { access_token } = await response.json();
    return access_token;
  }

  private async checkTicket(id: string) {
    try {
      const response = await fetch(`${API_URL}/oauth/tickets/${id}`);
      const json = await response.json();
      if (json.authorized === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
