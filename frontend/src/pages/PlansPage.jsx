import { useState, useEffect } from 'react';
import { Search, Filter, Smartphone, Tv, Zap } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const PlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedType, setSelectedType] = useState('Prepaid');
  const [searchTerm, setSearchTerm] = useState('');
  const [seeding, setSeeding] = useState(false);

  const operators = ['Jio', 'Airtel', 'Vi', 'BSNL'];
  const planTypes = ['Prepaid', 'Postpaid', 'DTH'];

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedOperator) params.append('operator', selectedOperator);
      if (selectedType) params.append('planType', selectedType);

      console.log('Fetching plans with params:', params.toString());
      const response = await axiosInstance.get(`/recharge/plans?${params}`);
      console.log('Plans response:', response.data);
      if (response.data.success) {
        setPlans(response.data.plans || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  const seedPlans = async () => {
    setSeeding(true);
    try {
      const response = await axiosInstance.post('/recharge/seed-plans');
      if (response.data.success) {
        toast.success('Sample plans added successfully');
        fetchPlans();
      }
    } catch (error) {
      console.error('Error seeding plans:', error);
      toast.error('Failed to seed plans');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [selectedOperator, selectedType]);

  const filteredPlans = plans.filter(plan => 
    plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.amount.toString().includes(searchTerm)
  );

  const getIcon = (type) => {
    switch(type) {
      case 'DTH': return Tv;
      case 'Electricity': return Zap;
      default: return Smartphone;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Recharge Plans</h1>
          <p className="text-base-content/70">Browse and compare all available plans</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={seedPlans}
          disabled={seeding}
        >
          {seeding ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Seeding...
            </>
          ) : (
            'Seed Sample Plans'
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-base-200 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search plans..."
                className="input input-bordered w-full pl-10 bg-base-100 text-base-content"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Operator Filter */}
          <select
            className="select select-bordered bg-base-100 text-base-content"
            value={selectedOperator}
            onChange={(e) => setSelectedOperator(e.target.value)}
          >
            <option value="">All Operators</option>
            {operators.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </select>
          
          {/* Plan Type Filter */}
          <select
            className="select select-bordered bg-base-100 text-base-content"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {planTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Plans Grid */}
      <div>
        {loading ? (
          <div className="text-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="text-base-content/70 mt-4">Loading plans...</p>
          </div>
        ) : filteredPlans.length === 0 ? (
          <div className="text-center py-12 bg-base-200 rounded-lg">
            <Filter className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
            <p className="text-base-content/70">No plans found. Click "Seed Sample Plans" to add some plans.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const Icon = getIcon(plan.planType);
              return (
                <div
                  key={plan._id}
                  className="bg-base-200 rounded-lg p-6 hover:shadow-lg transition-shadow border border-base-300 hover:border-primary/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base-content">{plan.operator}</h3>
                        <span className="text-sm text-base-content/70">{plan.planType}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-base-content">₹{plan.amount}</div>
                      <div className="text-sm text-base-content/70">{plan.validity}</div>
                    </div>
                  </div>
                  
                  <p className="text-base-content mb-4">{plan.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {plan.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-sm text-base-content/70">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className="btn btn-primary w-full">
                    Select Plan
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlansPage;