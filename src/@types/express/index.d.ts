import { IUserProps } from "../../models/user.model";

declare global {
  namespace Express {
    interface Request {
      account: IUserProps;
    }
  }
}
