export class AuctionRoomModel {
  type: number;

  _id: string;
  _owners: any;

  // Auction info
  duration: number;
  startAt: string;
  isFinished: boolean;

  // ProductInfo
  productName: string;
  productImgUrl: string;

  // Leading info
  currentPrice: number;
  currentPlayerName: string;
  currentPlayerPublicKey: string;
  auctionHistories: string[];

  hostAddress: string;

  constructor(
    startAt: string,
    duration: number,
    isFinished: boolean,
    hostAddress: string,
    hostPublicKey: string,
    productName: string,
    productImgUrl: string
  ) {
    this.type = 1; // AuctionRoom
    this.startAt = startAt;
    this.duration = duration;
    this.isFinished = isFinished;
    this.hostAddress = hostAddress;
    this.productName = productName;
    this.productImgUrl = productImgUrl;
    this.auctionHistories = [];
    this.currentPrice = 0;
    this._owners = [hostPublicKey];
  }

  addPlayer(owner: string) {
    this._owners.push(owner);
  }

  placeNewPrice(amount: number, name: string, publicKey: string) {
    this.currentPrice = amount;
    this.currentPlayerName = name;
    this.currentPlayerPublicKey = publicKey;
    this.auctionHistories.unshift(`User ${name} placed ${amount}`);
  }

  finish() {
    this.isFinished = true;
  }
}
