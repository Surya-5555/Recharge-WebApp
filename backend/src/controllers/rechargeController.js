const RechargePlan = require('../models/RechargePlan');

const getPlans = async (req, res) => {
  try {
    console.log('getPlans called with query:', req.query);
    
    // Check if RechargePlan model exists
    if (!RechargePlan) {
      console.log('RechargePlan model not found');
      return res.status(200).json({ success: true, plans: [] });
    }

    const { operator, planType } = req.query;
    
    const filter = { isActive: true };
    if (operator) filter.operator = operator;
    if (planType) filter.planType = planType;

    console.log('Filter:', filter);
    const plans = await RechargePlan.find(filter).sort({ amount: 1 });
    console.log('Found plans:', plans.length);
    
    res.status(200).json({ success: true, plans: plans || [] });
  } catch (error) {
    console.error("Error in getPlans controller:", error);
    res.status(200).json({ success: true, plans: [] });
  }
};

const seedPlans = async (req, res) => {
  try {
    console.log('seedPlans called');
    
    const samplePlans = [
      {
        operator: 'Jio',
        planType: 'Prepaid',
        amount: 149,
        validity: '24 days',
        description: 'Unlimited calls + 1GB/day',
        benefits: ['Unlimited Voice', '1GB/day Data', 'SMS 100/day', 'JioApps']
      },
      {
        operator: 'Jio',
        planType: 'Prepaid',
        amount: 299,
        validity: '28 days',
        description: 'Unlimited calls + 2GB/day',
        benefits: ['Unlimited Voice', '2GB/day Data', 'SMS 100/day', 'JioApps']
      },
      {
        operator: 'Airtel',
        planType: 'Prepaid',
        amount: 179,
        validity: '28 days',
        description: 'Unlimited calls + 1.5GB/day',
        benefits: ['Unlimited Voice', '1.5GB/day Data', 'SMS 100/day', 'Airtel Thanks']
      },
      {
        operator: 'Vi',
        planType: 'Prepaid',
        amount: 199,
        validity: '28 days',
        description: 'Unlimited calls + 1.5GB/day',
        benefits: ['Unlimited Voice', '1.5GB/day Data', 'SMS 100/day', 'Vi Movies & TV']
      }
    ];

    console.log('Deleting existing plans...');
    await RechargePlan.deleteMany({});
    
    console.log('Inserting new plans...');
    await RechargePlan.insertMany(samplePlans);
    
    console.log('Plans seeded successfully');
    res.status(200).json({ success: true, message: 'Sample plans seeded successfully' });
  } catch (error) {
    console.error("Error in seedPlans controller:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

module.exports = {
  getPlans,
  seedPlans
};