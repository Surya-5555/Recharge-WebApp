import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Smartphone, Tv, Zap, Search, Filter } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const RechargePage = () => {
  const [searchParams] = useSearchParams();
  const [selectedOperator, setSelectedOperator] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [recharging, setRecharging] = useState(false);
  
  const rechargeType = searchParams.get('type') || 'mobile';
  
  const operators = {
    mobile: ['Jio', 'Airtel', 'Vi', 'BSNL'],
    dth: ['Tata Sky', 'Dish TV', 'Airtel Digital TV', 'Sun Direct'],
    electricity: ['MSEB', 'BESCOM', 'KSEB', 'TNEB']
  };

  const getIcon = () => {
    switch(rechargeType) {
      case 'dth': return Tv;
      case 'electricity': return Zap;
      default: return Smartphone;
    }
  };

  const getTitle = () => {
    switch(rechargeType) {
      case 'dth': return 'DTH Recharge';
      case 'electricity': return 'Electricity Bill Payment';
      default: return 'Mobile Recharge';
    }
  };

  const fetchPlans = async () => {
    if (!selectedOperator) {
      setPlans([]);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Fetching plans for operator:', selectedOperator);
      const response = await axiosInstance.get(`/recharge/plans?operator=${selectedOperator}&planType=Prepaid`);
      console.log('Plans response:', response.data);
      if (response.data.success) {
        setPlans(response.data.plans || []);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      console.error('Error response:', error.response?.data);
      setPlans([]);
      toast.error(error.message || 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [selectedOperator]);

  const handleRecharge = async () => {
    if (!selectedPlan || !phoneNumber) {
      toast.error('Please select a plan and enter phone number');
      return;
    }
    
    setRecharging(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would implement the actual recharge logic
      toast.success(`Recharge initiated for ${phoneNumber} with ${selectedOperator} plan of ₹${selectedPlan.amount}`);
      // Reset form after successful recharge
      setSelectedPlan(null);
      setPhoneNumber('');
    } catch (error) {
      toast.error('Recharge failed. Please try again.');
    } finally {
      setRecharging(false);
    }
  };

  const Icon = getIcon();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content">{getTitle()}</h1>
            <p className="text-base-content/70">Quick and secure recharge services</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-6">
          <img 
            src="/i.png" 
            alt="Recharge Illustration" 
            className="w-24 h-24 opacity-80"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharge Form */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-base-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-base-content mb-4">Recharge Details</h2>
            
            {/* Phone Number Input */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-base-content">
                  {rechargeType === 'mobile' ? 'Mobile Number' : 
                   rechargeType === 'dth' ? 'Customer ID' : 'Consumer Number'}
                </span>
              </label>
              <input
                type="text"
                placeholder={rechargeType === 'mobile' ? '9876543210' : '123456789'}
                className="input input-bordered w-full bg-base-100 text-base-content"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                  if (value.length <= 10) {
                    setPhoneNumber(value);
                  }
                }}
                maxLength={10}
              />
            </div>

            {/* Operator Selection */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-base-content">Select Operator</span>
              </label>
              <select
                className="select select-bordered w-full bg-base-100 text-base-content"
                value={selectedOperator}
                onChange={(e) => setSelectedOperator(e.target.value)}
              >
                <option value="">Choose operator</option>
                {operators[rechargeType]?.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>

            {/* Selected Plan Display */}
            {selectedPlan && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-base-content mb-2">Selected Plan</h3>
                <div className="flex justify-between items-center">
                  <span className="text-base-content">₹{selectedPlan.amount}</span>
                  <span className="text-base-content/70">{selectedPlan.validity}</span>
                </div>
                <p className="text-sm text-base-content/70 mt-1">{selectedPlan.description}</p>
              </div>
            )}

            {/* Recharge Button */}
            <button
              className="btn btn-primary w-full"
              onClick={handleRecharge}
              disabled={!selectedPlan || !phoneNumber || recharging}
            >
              {recharging ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Processing...
                </>
              ) : (
                'Recharge Now'
              )}
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="lg:col-span-2">
          <div className="bg-base-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-base-content">Available Plans</h2>
              {selectedOperator && (
                <div className="badge badge-primary">{selectedOperator}</div>
              )}
            </div>

            {!selectedOperator ? (
              <div className="text-center py-12">
                <Filter className="w-12 h-12 text-base-content/30 mx-auto mb-4" />
                <p className="text-base-content/70">Please select an operator to view plans</p>
              </div>
            ) : loading ? (
              <div className="text-center py-12">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="text-base-content/70 mt-4">Loading plans...</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-base-content/70">No plans available for {selectedOperator}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPlan?._id === plan._id
                        ? 'border-primary bg-primary/5'
                        : 'border-base-300 bg-base-100 hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-2xl font-bold text-base-content">₹{plan.amount}</span>
                      <span className="text-sm text-base-content/70">{plan.validity}</span>
                    </div>
                    <p className="text-base-content mb-3">{plan.description}</p>
                    <div className="space-y-1">
                      {plan.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="text-sm text-base-content/70">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RechargePage;