export type FAKE_USER = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  name: string;
  bio: string;
  address?: UserAddress;
};
export type UserAddress = {
  streetAddress1: string;
  streetAddress2: string;
  city: string;
  state: string;
  fullCountry: string;
  postCode: string;
  country: string;
};
export type UserAddressRestResponse = {
  user_id: number;
} & UserAddress;
