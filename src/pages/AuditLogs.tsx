
import React, { useState, useEffect } from 'react';
import { 
  History, 
  FileText, 
  User, 
  CheckCircle, 
  XCircle, 
  Search,
  Download,
  Calendar,
  Filter,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { motion } from "framer-motion";
import { Separator } from '@/components/ui/separator';
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { addDays, startOfMonth, endOfMonth, format } from "date-fns";
import type { DateRange } from "react-day-picker";

interface AuditRecord {
  id: string;
  timestamp: string;
  documentId: string;
  documentName: string;
  documentSize: string;
  documentHash: string;
  action: 'signed' | 'failed' | 'viewed';
  user: string;
  certificateId: string;
  certificateName: string;
  details?: string;
}

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<AuditRecord['action'] | 'all'>('all');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  // No dummy data initially - will be populated as documents are signed
  
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.documentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    
    const logDate = new Date(log.timestamp);
    const matchesDate = 
      (!dateRange.from || logDate >= dateRange.from) && 
      (!dateRange.to || logDate <= dateRange.to);
    
    return matchesSearch && matchesAction && matchesDate;
  });
  
  const getActionBadge = (action: AuditRecord['action']) => {
    switch (action) {
      case 'signed':
        return <Badge className="bg-green-500">Signed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'viewed':
        return <Badge variant="outline">Viewed</Badge>;
      default:
        return null;
    }
  };
  
  const getActionIcon = (action: AuditRecord['action']) => {
    switch (action) {
      case 'signed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'viewed':
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const handleExportExcel = () => {
    // In a real app, this would generate and download an Excel file
    // For this demo, we'll simulate success
    setTimeout(() => {
      const fileName = `audit_logs_${format(dateRange.from || new Date(), 'yyyy-MM-dd')}_to_${format(dateRange.to || new Date(), 'yyyy-MM-dd')}.xlsx`;
      alert(`Exporting ${filteredLogs.length} logs to ${fileName}`);
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center mb-6">
          <div className="p-2 bg-primary/10 rounded-full mr-3">
            <History className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Audit Logs</h1>
        </div>

        <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-sm mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Document Signing Audit Logs</CardTitle>
            <CardDescription>
              Complete record of all document signing activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  className="pl-10" 
                  placeholder="Search by document name, ID or user..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter size={16} />
                      <span>Action: {actionFilter === 'all' ? 'All' : actionFilter}</span>
                      <ChevronDown size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Filter by Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActionFilter('all')}>
                      All Actions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActionFilter('signed')}>
                      Signed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActionFilter('failed')}>
                      Failed
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActionFilter('viewed')}>
                      Viewed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DateRangePicker
                  value={dateRange}
                  onChange={(range: DateRange) => setDateRange(range)}
                />
                
                <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
                  <Download size={16} />
                  <span>Export Excel</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              {filteredLogs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <History className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium mb-1">No Audit Logs Found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    No logs match your current search and filter criteria
                  </p>
                </div>
              ) : (
                filteredLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-primary/10 rounded-full">
                          {getActionIcon(log.action)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{log.documentName}</h4>
                            {getActionBadge(log.action)}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Document ID: </span>
                              <span className="font-mono">{log.documentId}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">User: </span>
                              <span>{log.user}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Size: </span>
                              <span>{log.documentSize}</span>
                            </div>
                            <div>
                              <span className="text-gray-500 dark:text-gray-400">Hash: </span>
                              <span className="font-mono text-xs">{log.documentHash.substring(0, 12)}...</span>
                            </div>
                            {log.action === 'signed' && (
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Certificate: </span>
                                <span>{log.certificateName}</span>
                              </div>
                            )}
                            {log.details && (
                              <div>
                                <span className="text-gray-500 dark:text-gray-400">Details: </span>
                                <span>{log.details}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex md:flex-col items-center md:items-end justify-between md:justify-start md:text-right">
                        <div>
                          {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                        <div>
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuditLogs;
