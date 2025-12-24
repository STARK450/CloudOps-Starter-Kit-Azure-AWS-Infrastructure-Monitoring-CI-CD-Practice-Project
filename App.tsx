
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';
import { 
  MOCK_RESOURCES, MOCK_INCIDENTS, MOCK_PIPELINES, MOCK_CHECKLIST, ICONS 
} from './constants';
import { 
  CloudResource, Incident, PipelineJob, ChecklistItem, ResourceStatus 
} from './types';
import { getTroubleshootingAdvice } from './services/geminiService';

// --- Sub-components (outside for clarity) ---

const Sidebar = ({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) => {
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: ICONS.Dashboard },
    { id: 'resources', name: 'Resources', icon: ICONS.Resources },
    { id: 'monitoring', name: 'Monitoring', icon: ICONS.Monitoring },
    { id: 'security', name: 'IAM & Security', icon: ICONS.Security },
    { id: 'pipelines', name: 'CI/CD Pipelines', icon: ICONS.Pipeline },
    { id: 'docs', name: 'Documentation', icon: ICONS.Docs },
    { id: 'ai', name: 'Mentor AI', icon: ICONS.AI },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col z-20 transition-all">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-tight text-blue-400">CloudOps Kit</h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-semibold">Enterprise Operations</p>
      </div>
      <nav className="flex-1 mt-6 px-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
              activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon />
            <span className="font-medium text-sm">{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 bg-slate-800/50 m-4 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">JD</div>
          <div>
            <p className="text-xs font-bold text-white">Junior Dev</p>
            <p className="text-[10px] text-slate-400 italic">DevOps Analyst</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title }: { title: string }) => (
  <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-8 py-5 flex justify-between items-center">
    <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
    <div className="flex items-center space-x-4">
      <div className="relative">
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
      </div>
      <div className="h-8 w-[1px] bg-slate-200"></div>
      <div className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</div>
    </div>
  </header>
);

const StatCard = ({ title, value, change, color }: { title: string, value: string | number, change?: string, color: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
    <div className="flex items-baseline space-x-2">
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {change && <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{change}</span>}
    </div>
    <div className={`mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden`}>
      <div className={`h-full ${color}`} style={{ width: '65%' }}></div>
    </div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [resources, setResources] = useState<CloudResource[]>(MOCK_RESOURCES);
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(MOCK_CHECKLIST);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock monitoring data
  const cpuData = [
    { time: '08:00', cpu: 30, mem: 45 },
    { time: '09:00', cpu: 45, mem: 48 },
    { time: '10:00', cpu: 95, mem: 55 },
    { time: '11:00', cpu: 40, mem: 50 },
    { time: '12:00', cpu: 35, mem: 48 },
    { time: '13:00', cpu: 55, mem: 52 },
    { time: '14:00', cpu: 48, mem: 49 },
  ];

  const handleAskMentor = async (issue: string) => {
    setIsAnalyzing(true);
    setAiAnalysis('');
    const advice = await getTroubleshootingAdvice(issue);
    setAiAnalysis(advice);
    setIsAnalyzing(false);
    setActiveTab('ai');
  };

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Active Resources" value={resources.filter(r => r.status === ResourceStatus.RUNNING).length} change="+2" color="bg-blue-500" />
              <StatCard title="System Health" value="98.2%" change="+0.4%" color="bg-green-500" />
              <StatCard title="Open Incidents" value={incidents.filter(i => i.status === 'Open').length} change="-1" color="bg-orange-500" />
              <StatCard title="Cloud Spend" value="$1,240" change="+12%" color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">CPU & Memory Utilization (24h)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cpuData}>
                      <defs>
                        <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                      />
                      <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCpu)" />
                      <Area type="monotone" dataKey="mem" stroke="#10b981" fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-800">Critical Alerts</h3>
                  <button className="text-sm text-blue-600 font-semibold">View All</button>
                </div>
                <div className="space-y-4">
                  {incidents.slice(0, 3).map(incident => (
                    <div key={incident.id} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-blue-200 transition-colors">
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${incident.severity === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-orange-400'}`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-bold text-slate-800">{incident.message}</p>
                          <span className="text-[10px] text-slate-400 font-medium">{incident.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Status: <span className="font-medium text-slate-700">{incident.status}</span></p>
                        {incident.status === 'Open' && (
                          <button 
                            onClick={() => handleAskMentor(incident.message)}
                            className="mt-3 text-[10px] px-3 py-1 bg-white border border-slate-200 rounded-lg text-blue-600 font-bold hover:bg-blue-50 transition-colors flex items-center space-x-1"
                          >
                            <ICONS.AI />
                            <span>Troubleshoot with AI</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Operations Checklist</h3>
                <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                  {checklist.filter(c => c.completed).length} / {checklist.length} Completed
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {checklist.map(item => (
                  <div key={item.id} className="p-4 flex items-center space-x-4 hover:bg-slate-50 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={item.completed} 
                      onChange={() => toggleChecklist(item.id)}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <p className={`text-sm ${item.completed ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{item.task}</p>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'resources':
        return (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Resource Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Usage</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Provider</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map(res => (
                  <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{res.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{res.type}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        res.status === ResourceStatus.RUNNING ? 'bg-green-100 text-green-700' : 
                        res.status === ResourceStatus.FAILED ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${res.usage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${res.usage}%` }}></div>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{res.usage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{res.provider}</td>
                    <td className="px-6 py-4">
                      <button className="p-1 hover:bg-slate-200 rounded transition-colors">
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'pipelines':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_PIPELINES.map(pipeline => (
              <div key={pipeline.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${
                  pipeline.status === 'Success' ? 'bg-green-500' : pipeline.status === 'Failed' ? 'bg-red-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-slate-800">{pipeline.name}</h4>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    pipeline.status === 'Success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>{pipeline.status}</span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Duration</span>
                    <span className="font-medium text-slate-700">{pipeline.duration}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Run ID</span>
                    <span className="font-mono text-slate-500">#{pipeline.id}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Trigger</span>
                    <span className="font-medium text-slate-700 uppercase tracking-tighter">{pipeline.triggeredBy}</span>
                  </div>
                </div>
                <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors group-hover:border-blue-300">
                  View Full Logs
                </button>
              </div>
            ))}
          </div>
        );

      case 'ai':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900 rounded-2xl p-8 shadow-xl text-white border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-12 bg-blue-500/10 blur-[100px] rounded-full"></div>
               <div className="flex items-center space-x-4 mb-8 relative z-10">
                 <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <ICONS.AI />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">DevOps Mentor AI</h3>
                    <p className="text-blue-400 text-sm font-medium">Powered by Gemini 3 Flash</p>
                 </div>
               </div>

               <div className="bg-slate-800/50 rounded-xl p-6 mb-6 min-h-[300px] relative z-10 border border-slate-700/50 prose prose-invert max-w-none">
                 {isAnalyzing ? (
                   <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
                      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-slate-400 animate-pulse">Analyzing logs and infrastructure state...</p>
                   </div>
                 ) : aiAnalysis ? (
                   <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">
                     {aiAnalysis}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-[200px] text-center">
                     <svg className="w-12 h-12 text-slate-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                     <p className="text-slate-500">Select an incident from the dashboard or ask a question below.</p>
                   </div>
                 )}
               </div>

               <form className="relative z-10 flex space-x-2" onSubmit={(e) => {
                 e.preventDefault();
                 const q = (e.target as any).query.value;
                 if (q) handleAskMentor(q);
               }}>
                 <input 
                   name="query"
                   placeholder="Ask for help: e.g. 'How do I resolve a 403 Forbidden on S3?'" 
                   className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder:text-slate-500"
                 />
                 <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20">
                   Analyze
                 </button>
               </form>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200">
               <h4 className="text-slate-800 font-bold mb-4">Common Incident Guides</h4>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {["VM Connection Timeout", "Insufficient Storage Quota", "IAM Access Denied", "CI/CD Build Failure"].map(guide => (
                   <button 
                    key={guide}
                    onClick={() => handleAskMentor(`I am seeing a ${guide} error.`)}
                    className="p-4 border border-slate-100 rounded-xl text-left hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                   >
                     <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">{guide}</p>
                     <p className="text-xs text-slate-400 mt-1">Request mentor explanation →</p>
                   </button>
                 ))}
               </div>
            </div>
          </div>
        );

      default:
        return <div className="p-8 text-center text-slate-400">Component coming soon...</div>;
    }
  };

  return (
    <div className="min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="ml-64 transition-all">
        <Header title={activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
        
        <div className="p-8 max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {/* Persistent Mobile Warning / Overlay if screen too small */}
      <div className="lg:hidden fixed inset-0 bg-slate-900 z-[100] flex flex-col items-center justify-center p-8 text-center text-white">
        <ICONS.Resources />
        <h2 className="text-2xl font-bold mt-4">Desktop View Required</h2>
        <p className="mt-2 text-slate-400">The CloudOps Management Console is optimized for professional monitor setups.</p>
      </div>
    </div>
  );
}
