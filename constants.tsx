
import React from 'react';
import { CloudResource, ResourceStatus, ResourceType, Incident, PipelineJob, ChecklistItem } from './types';

export const MOCK_RESOURCES: CloudResource[] = [
  { id: '1', name: 'prod-web-server-01', type: ResourceType.VM, provider: 'Azure', status: ResourceStatus.RUNNING, usage: 42, location: 'East US' },
  { id: '2', name: 'app-data-storage', type: ResourceType.STORAGE, provider: 'Azure', status: ResourceStatus.RUNNING, usage: 15, location: 'West Europe' },
  { id: '3', name: 'dev-db-instance', type: ResourceType.DATABASE, provider: 'AWS', status: ResourceStatus.STOPPED, usage: 0, location: 'us-east-1' },
  { id: '4', name: 'staging-vpc-01', type: ResourceType.NETWORK, provider: 'AWS', status: ResourceStatus.RUNNING, usage: 8, location: 'us-west-2' },
  { id: '5', name: 'billing-reports-s3', type: ResourceType.STORAGE, provider: 'AWS', status: ResourceStatus.FAILED, usage: 0, location: 'us-east-1' },
];

export const MOCK_INCIDENTS: Incident[] = [
  { id: 'inc-101', timestamp: '2023-10-24 09:15', severity: 'Critical', message: 'VM "prod-web-server-01" exceeded 95% CPU threshold.', status: 'Open' },
  { id: 'inc-102', timestamp: '2023-10-24 08:30', severity: 'Warning', message: 'S3 Bucket "billing-reports-s3" access denied (IAM mismatch).', status: 'Open' },
  { id: 'inc-103', timestamp: '2023-10-23 16:45', severity: 'Info', message: 'Security patch applied to VPC network interfaces.', status: 'Resolved' },
];

export const MOCK_PIPELINES: PipelineJob[] = [
  { id: 'run-882', name: 'Frontend-CI', status: 'Success', duration: '2m 14s', triggeredBy: 'git-push' },
  { id: 'run-881', name: 'Backend-CD', status: 'Failed', duration: '4m 02s', triggeredBy: 'manual' },
  { id: 'run-880', name: 'Infrastructure-TF', status: 'Success', duration: '12m 55s', triggeredBy: 'schedule' },
];

export const MOCK_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', task: 'Review CloudWatch/Azure Monitor critical alerts', completed: true, category: 'Daily' },
  { id: 'c2', task: 'Check storage quota usage across all dev buckets', completed: false, category: 'Daily' },
  { id: 'c3', task: 'Validate IAM roles for new team members', completed: false, category: 'Security' },
  { id: 'c4', task: 'Terminate unassigned elastic IPs/idle resources', completed: true, category: 'Cleanup' },
];

export const ICONS = {
  Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  Resources: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>,
  Monitoring: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>,
  Security: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  Pipeline: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>,
  Docs: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>,
  AI: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
};
