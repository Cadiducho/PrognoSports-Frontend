/** Forma del token de sesión tal y como lo devuelve la API */
export interface AuthTokenDto {
    current: boolean;
    ipAddress: string;
    createdAt: string;
    lastActivityAt: string;
    lifetime: number;
    token: string;
}

export interface AuthToken {
    current: boolean;
    ipAddress: string;
    createdAt: Date;
    lastActivityAt: Date;
    lifetime: number;
    token: string;
}

export function mapAuthToken(dto: AuthTokenDto): AuthToken {
    return {
        current: dto.current,
        ipAddress: dto.ipAddress,
        createdAt: new Date(dto.createdAt),
        lastActivityAt: new Date(dto.lastActivityAt),
        lifetime: dto.lifetime,
        token: dto.token,
    };
}
