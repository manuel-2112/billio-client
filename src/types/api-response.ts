export interface PublicAccountResponse {
  account: import("./payment").Account;
  restaurant_name: string;
  location_name: string;
  table_number: number;
}
