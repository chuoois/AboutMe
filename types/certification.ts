export type Cert = {
  id: number;
  coursera_name: string;
  specialization?: string | null;
  icon: string | null;
  color: string | null;
  issuer: string;
  issue_date: string;
  credential_url: string | null;
  description: string;
};
