import type {ApiError} from "@/_services";

// Las peticiones se rechazan con un ApiError (ver src/_services/index.ts), no con un Error
declare module '@pinia/colada' {
  interface TypesConfig {
    defaultError: ApiError;
  }
}
