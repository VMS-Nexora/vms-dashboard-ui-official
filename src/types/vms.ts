export interface Contact {
  email: string;
  phone: string;
}

export interface VMSBaseConfig {
  id: string;
  name: string;
  prefix: string;
  version: string;
  description: string;
  releaseDate: string;
  contact: Contact;
}
export interface SQLiteDatabase {
  type: string;
  name: string;
  url: string;
}

export interface VMSConfig {
  software: VMSBaseConfig;
  database: SQLiteDatabase;
}
