import { DataManager, ODataV4Adaptor, RemoteOptions } from "@syncfusion/ej2-data";

export class CustomSecureODataV4Adaptor extends ODataV4Adaptor {



  private userToken: string | null = null;
  constructor(props?: RemoteOptions) {
  super(props)
  }

  public setUserToken(userToken: string | null): void {
  this.userToken = userToken
  }

  beforeSend(dm: DataManager, request: XMLHttpRequest) {
  // Set token.
  dm.dataSource.headers = [{ 'Authorization': 'Bearer ' + this.userToken }]; // setting header
  }
  }
