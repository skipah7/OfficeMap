export interface Workplace {
  id: number,
  employee?: string,
  employeeRole?: 'backend' | 'frontend',
  birthDate?: Date,
  equipment?: string,
  workStatus?: 'remote' | 'office',
  regime?: number[]
}
