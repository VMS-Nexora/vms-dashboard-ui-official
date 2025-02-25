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

export interface VMSConfig {
  software: VMSBaseConfig;
}
