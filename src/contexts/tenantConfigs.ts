export type TenantConfig = {
  name: string;
  auth0_organization_id: string;
  api_base_url?: string;
};

const empresa1: TenantConfig = {
  "name": "Empresa 1",
  "auth0_organization_id": 'org_JgdOwwFHiCCZlmJJ',
}
const empresa2: TenantConfig =  {
  "name": "Empresa 1",
  "auth0_organization_id": 'org_DNuxpZhbFkB8onNI',
}
export const tenantConfigs: {[key: string]:  TenantConfig} = {
  "empresa1.localhost:3000": empresa1,
  "empresa2.localhost:3000": empresa2,
  "empresa1.b2b.abilioazevedo.com.br": empresa1,
  "empresa2.b2b.abilioazevedo.com.br": empresa2
}