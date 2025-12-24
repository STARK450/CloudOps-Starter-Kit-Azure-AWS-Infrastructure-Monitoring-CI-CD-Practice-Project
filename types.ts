
export enum ResourceStatus {
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  PENDING = 'Pending',
  FAILED = 'Failed'
}

export enum ResourceType {
  VM = 'Virtual Machine',
  STORAGE = 'S3 Bucket / Blob',
  NETWORK = 'VPC / VNet',
  DATABASE = 'RDS / SQL Instance'
}

export interface CloudResource {
  id: string;
  name: string;
  type: ResourceType;
  provider: 'AWS' | 'Azure';
  status: ResourceStatus;
  usage: number; // Percentage
  location: string;
}

export interface Incident {
  id: string;
  timestamp: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  status: 'Open' | 'Resolved';
  assignedTo?: string;
}

export interface PipelineJob {
  id: string;
  name: string;
  status: 'Success' | 'In Progress' | 'Failed';
  duration: string;
  triggeredBy: string;
}

export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  category: 'Daily' | 'Security' | 'Cleanup';
}
