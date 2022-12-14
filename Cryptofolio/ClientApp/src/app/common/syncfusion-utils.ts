import { Injectable } from "@angular/core";
import { AuthorizeService } from "src/api-authorization/authorize.service";
import { CustomSecureODataV4Adaptor } from "./custom-secure-odatav4-adaptor";

@Injectable({
  providedIn: 'root'
  })
  export class SyncfusionUtilsService {

  private customSecureODataV4Adaptor: CustomSecureODataV4Adaptor = new CustomSecureODataV4Adaptor();

  private userToken: string | null = null;

  constructor(authorizeService: AuthorizeService) {
  authorizeService.getAccessToken().subscribe(token => this.onAccessTokenChanged(token));
  }

  private onAccessTokenChanged(token: string | null) {
  console.log("onAccessTokenChanged:");
  console.log(token);
  this.userToken = token;
  this.customSecureODataV4Adaptor.setUserToken(token);
  }


  public getUserToken(): string | null {


  return this.userToken;
  }

  public getCustomSecureODataV4Adaptor(): CustomSecureODataV4Adaptor {
  return this.customSecureODataV4Adaptor;
  }

  }
