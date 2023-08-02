export enum RouterPaths {
  default = '/',
  login = '/login',
  notFound = '*',
}

type ParamsDictionaryWithRoutes = {
  [K in keyof typeof RouterPaths]: string;
};

declare module 'express-serve-static-core' {
  interface ParamsDictionary extends ParamsDictionaryWithRoutes {}
}
