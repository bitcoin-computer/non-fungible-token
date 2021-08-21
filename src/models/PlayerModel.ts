export class PlayerModel {
  address: string;

  constructor(init?: Partial<PlayerModel>) {
    Object.assign(this, init);
  }
}
