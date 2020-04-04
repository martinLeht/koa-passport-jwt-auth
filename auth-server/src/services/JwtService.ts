import { Inject, Singleton } from 'typescript-ioc';
import jwt from 'jsonwebtoken';
import { uuid } from 'uuidv4';
import JwtRefreshTokenRepository from '../repositories/JwtRefreshTokenRepository';
import { JWT_SECRET} from '../Config/Config';
import UsersRepository from '../repositories/UsersRepository';
import JwtRefreshToken from '../models/JwtRefreshToken';


@Singleton
export default class JwtService {
    

    constructor(@Inject private jwtRefreshTokenRepository: JwtRefreshTokenRepository,
                @Inject private userRepository: UsersRepository) {}

    /**
     * Generates a refresh token with provided payload. First checks if there are
     * tokens for the user in database, if there are tokens, we delete them.
     * Then we generate new refresh token with 1 day expiration time.
     * 
     * @param payload the payload data for generated refresh token
     * @returns newly generated refresh token
     * 
     */
    public async getRefreshToken(payload: { id: number }) {
        const userRefreshTokens = await this.jwtRefreshTokenRepository.findByUserId(payload.id);

        if (userRefreshTokens) {
            await this.jwtRefreshTokenRepository.delete(payload.id);
            console.log("Deleted tokens of user with id: " + payload.id);
        }
        const generatedRefreshToken = jwt.sign({ user: payload.id }, JWT_SECRET, { expiresIn: '3min' });
        await this.jwtRefreshTokenRepository.insert({
            uuid: uuid(),
            userId: payload.id,
            refreshToken: generatedRefreshToken
        });
        return generatedRefreshToken;
    }
    
    /**
     * Generates new jwt token with 15min expiration time
     * 
     * @param payload pauload data to the jwt token
     */
    public getJwtToken(payload: { id: number }) {
        return jwt.sign({ id: payload.id }, JWT_SECRET, { expiresIn: '1min' });
    }
    
    /**
     * Method to refresh the refresh token. It verifies the most recent refresh token,
     * and extracts user id from the payload and checks if user exists.
     * When verified user existence, we fetch the assigned refresh tokens in db and 
     * compare the provided token from method params with the one from db.
     * When tokens match, we generate new tokens and return them.
     * 
     * @param token the most recent refresh token
     * @returns newly generated access and refresh tokens
     */

    public async refreshToken(token: string) {
        const decodedToken: any = jwt.verify(token, JWT_SECRET);
        const user = await this.userRepository.findById(decodedToken.user);

        if (!user) {
            throw new Error(`Access is forbidden`);
        }

        const allRefreshTokens: JwtRefreshToken[] | undefined = await this.jwtRefreshTokenRepository.findByUserId(user.id);
        if (!allRefreshTokens || !allRefreshTokens.length) {
            throw new Error(`There is no refresh token for the user with`);
        }

        const currentRefreshToken: JwtRefreshToken | undefined = allRefreshTokens.find(refreshToken => refreshToken.refreshToken === token);
        if (!currentRefreshToken) {
            throw new Error(`Refresh token is wrong`);
        }
        
        const payload = {
         id : user.id
        };
        // generate new refresh and access token
        const newRefreshToken = await this.getUpdatedRefreshToken(payload);
        const newAccessToken = this.getJwtToken(payload);

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
        };
    }

    /**
     * Updates the DB with new refresh token and returns the new token as promise
     * 
     * @param payload payload assigned to the newly generated refresh token
     */
    public async getUpdatedRefreshToken(payload: any): Promise<string> {
        return new Promise<string>(async (resolve, reject) => {
            const newRefreshToken: string = jwt.sign({user: payload.id}, JWT_SECRET, { expiresIn: '3min' });
            try {
                await this.jwtRefreshTokenRepository.update(payload.id, { refreshToken: newRefreshToken });
                resolve(newRefreshToken);
            } catch (err) {
                reject(err);
            }
            
        });
    }


}