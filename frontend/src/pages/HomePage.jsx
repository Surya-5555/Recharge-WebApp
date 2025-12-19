import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Smartphone, 
  Tv, 
  Zap, 
  History, 
  User, 
  CreditCard,
  TrendingUp,
  Clock
} from 'lucide-react';
import useAuthUser from '../hooks/useAuthUser';
import { axiosInstance } from '../lib/axios';

const HomePage = () => {
  const { authUser } = useAuthUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get('/transactions/history');
      if (response.data.success) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const quickActions = [
    {
      title: 'Mobile Recharge',
      description: 'Recharge your mobile instantly',
      icon: Smartphone,
      link: '/recharge?type=mobile',
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'DTH Recharge',
      description: 'Recharge DTH & Cable TV',
      icon: Tv,
      link: '/recharge?type=dth',
      color: 'bg-secondary/10 text-secondary'
    },
    {
      title: 'Browse Plans',
      description: 'Compare all available plans',
      icon: CreditCard,
      link: '/plans',
      color: 'bg-accent/10 text-accent'
    },
    {
      title: 'Transaction History',
      description: 'View all transactions',
      icon: History,
      link: '/history',
      color: 'bg-info/10 text-info'
    }
  ];

  // Calculate real statistics from transactions
  const totalRecharges = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const lastRecharge = transactions.length > 0 ? 
    new Date(transactions[0].createdAt).toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    }) : 'No recharges';

  const stats = [
    { label: 'Total Recharges', value: loading ? '...' : totalRecharges.toString(), icon: CreditCard },
    { label: 'Total Amount', value: loading ? '...' : `₹${totalAmount}`, icon: TrendingUp },
    { label: 'Last Recharge', value: loading ? '...' : lastRecharge, icon: Clock }
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="avatar">
            <div className="w-12 sm:w-16 rounded-full">
              <img src={authUser?.profilePic} alt="Profile" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-base-content">
              Welcome back, {authUser?.fullName}!
            </h1>
            <p className="text-sm sm:text-base text-base-content/70">
              Ready to recharge your services?
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-base-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-xs sm:text-sm">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-base-content">{stat.value}</p>
                </div>
                <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-base-content mb-3 sm:mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className="bg-base-200 hover:bg-base-300 rounded-lg p-4 sm:p-6 transition-colors group"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-base-content mb-1 sm:mb-2">{action.title}</h3>
                <p className="text-base-content/70 text-xs sm:text-sm hidden sm:block">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-base-content">Recent Activity</h2>
          <Link to="/history" className="text-primary hover:underline text-sm">
            View All
          </Link>
        </div>
        <div className="bg-base-200 rounded-lg p-3 sm:p-4">
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-4">
                <span className="loading loading-spinner loading-sm text-primary"></span>
                <p className="text-base-content/70 text-sm mt-2">Loading recent activity...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-base-content/70">No recent transactions</p>
                <p className="text-base-content/50 text-sm">Start by making your first recharge!</p>
              </div>
            ) : (
              transactions.slice(0, 2).map((transaction) => {
                const getIcon = (type) => {
                  switch(type) {
                    case 'dth': return Tv;
                    case 'electricity': return Zap;
                    default: return Smartphone;
                  }
                };
                const Icon = getIcon(transaction.type);
                const getColor = (type) => {
                  switch(type) {
                    case 'dth': return 'bg-secondary/10 text-secondary';
                    case 'electricity': return 'bg-accent/10 text-accent';
                    default: return 'bg-primary/10 text-primary';
                  }
                };
                
                return (
                  <div key={transaction._id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${getColor(transaction.type)} rounded-full flex items-center justify-center`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base text-base-content">
                          {transaction.type === 'mobile' ? 'Mobile' : transaction.type === 'dth' ? 'DTH' : 'Electricity'} Recharge
                        </p>
                        <p className="text-base-content/70 text-xs sm:text-sm">
                          {transaction.operator} - {transaction.number}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm sm:text-base text-base-content">₹{transaction.amount}</p>
                      <p className="text-base-content/70 text-xs sm:text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString('en-IN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-warning flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-base-content">Complete Your Profile</h3>
              <p className="text-base-content/70 text-xs sm:text-sm">Add more details</p>
            </div>
          </div>
          <Link to="/profile" className="btn btn-warning btn-xs sm:btn-sm">
            Complete
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;