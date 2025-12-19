import { useState } from 'react';
import { 
  Smartphone, 
  Tv, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Download
} from 'lucide-react';

const HistoryPage = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock transaction data - replace with actual API call
  const transactions = [
    {
      id: 'TXN001',
      type: 'mobile',
      operator: 'Jio',
      number: '9876543210',
      amount: 299,
      status: 'success',
      date: '2024-01-15T10:30:00Z',
      plan: 'Unlimited calls + 2GB/day'
    },
    {
      id: 'TXN002',
      type: 'dth',
      operator: 'Tata Sky',
      number: '123456789',
      amount: 449,
      status: 'success',
      date: '2024-01-12T14:20:00Z',
      plan: 'HD Sports Pack'
    },
    {
      id: 'TXN003',
      type: 'mobile',
      operator: 'Airtel',
      number: '9876543211',
      amount: 179,
      status: 'failed',
      date: '2024-01-10T09:15:00Z',
      plan: 'Unlimited calls + 1.5GB/day'
    },
    {
      id: 'TXN004',
      type: 'electricity',
      operator: 'MSEB',
      number: 'CON123456',
      amount: 1250,
      status: 'pending',
      date: '2024-01-08T16:45:00Z',
      plan: 'Electricity Bill Payment'
    }
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'dth': return Tv;
      case 'electricity': return Zap;
      default: return Smartphone;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return CheckCircle;
      case 'failed': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'text-success';
      case 'failed': return 'text-error';
      default: return 'text-warning';
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesFilter = filter === 'all' || txn.type === filter;
    const matchesSearch = txn.number.includes(searchTerm) || 
                         txn.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Transaction History</h1>
          <p className="text-base-content/70">View and manage your recharge transactions</p>
        </div>
        <button className="btn btn-outline btn-sm gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search by number, operator, or transaction ID"
                className="input input-bordered w-full pl-10 bg-base-100 text-base-content"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Filter */}
          <div className="flex gap-2">
            <select
              className="select select-bordered bg-base-100 text-base-content"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="mobile">Mobile</option>
              <option value="dth">DTH</option>
              <option value="electricity">Electricity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-base-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-base-content">{transactions.length}</p>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm">Successful</p>
              <p className="text-2xl font-bold text-success">
                {transactions.filter(t => t.status === 'success').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm">Failed</p>
              <p className="text-2xl font-bold text-error">
                {transactions.filter(t => t.status === 'failed').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
              <XCircle className="w-5 h-5 text-error" />
            </div>
          </div>
        </div>
        
        <div className="bg-base-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm">Total Amount</p>
              <p className="text-2xl font-bold text-base-content">
                ₹{transactions.reduce((sum, t) => sum + t.amount, 0)}
              </p>
            </div>
            <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-base-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-base-300">
          <h2 className="text-lg font-semibold text-base-content">Recent Transactions</h2>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/70">No transactions found</p>
          </div>
        ) : (
          <div className="divide-y divide-base-300">
            {filteredTransactions.map((transaction) => {
              const TypeIcon = getIcon(transaction.type);
              const StatusIcon = getStatusIcon(transaction.status);
              
              return (
                <div key={transaction.id} className="p-4 hover:bg-base-300/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <TypeIcon className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-base-content">{transaction.operator}</h3>
                          <span className="text-sm text-base-content/70">#{transaction.id}</span>
                        </div>
                        <p className="text-base-content/70 text-sm">{transaction.number}</p>
                        <p className="text-base-content/60 text-xs">{transaction.plan}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(transaction.status)}`} />
                        <span className={`text-sm font-medium capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-base-content">₹{transaction.amount}</p>
                      <p className="text-base-content/70 text-xs">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;