export class AccountModel {
  username: string;
  seed: string;
  chain: string;
  role: string;

  constructor(init?: Partial<AccountModel>) {
    Object.assign(this, init);
  }
}
