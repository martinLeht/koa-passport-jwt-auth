import {Singleton} from "typescript-ioc";
import bcryptjs from "bcryptjs";

@Singleton
export default class HelperService {
    public async hashPassword(password: string) {
        return new Promise<any>((resolve, reject) => {
            bcryptjs.genSalt(10)
                .then(salt => {
                    bcryptjs.hash(password, salt)
                        .then(hash => resolve(hash))
                        .catch(err => reject(err))
                })
                .catch(err => reject(err))
        });
    }

}
