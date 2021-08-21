export class ProductModel {
  _owners: string[] | undefined;
  type: number;

  name: string;
  imgUrl: string;

  constructor(name: string, imgUrl: string, publicKey: string) {
    this.type = 2; // Product
    this.name = name;
    this.imgUrl = imgUrl;
    this._owners = [publicKey];
  }

  setOwner(owner: string) {
    this._owners = [owner];
  }
}
