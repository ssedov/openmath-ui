export default class Config {
    public static _API?: string;
    public static API(): string {
        return process.env.REACT_APP_API || Config._API || '/api';
    }
}

