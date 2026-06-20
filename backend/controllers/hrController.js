const User = require('../models/User');

const getWorkforceData = async (req, res) => {
  try {
    // Database se saare employees nikalo (Admin ko chhod kar)
    const employees = await User.find({ role: { $ne: 'admin' } }).select('-password');

    let totalCompliance = 0;
    
    const enrichedEmployees = employees.map((emp, index) => {
      // Logic: Har user ka ek dynamic compliance score banega (for now)
      // Baad mein ise 'Result' model se link karenge
      const complianceScore = 40 + ((index + 1) * 23) % 61; // Generates score between 40-100
      totalCompliance += complianceScore;
      
      let risk = 'Low';
      if (complianceScore <= 50) risk = 'Critical';
      else if (complianceScore <= 75) risk = 'Medium';

      return {
        id: emp._id,
        name: emp.name,
        role: emp.role || 'Employee',
        dept: 'Operations', // Default department
        compliance: complianceScore,
        lastActive: 'Recently',
        risk: risk
      };
    });

    const avgCompliance = employees.length > 0 ? Math.round(totalCompliance / employees.length) : 0;
    const criticalCount = enrichedEmployees.filter(e => e.risk === 'Critical').length;

    res.status(200).json({
      success: true,
      totalEmployees: enrichedEmployees.length,
      orgCompliance: avgCompliance,
      criticalRisks: criticalCount,
      data: enrichedEmployees
    });

  } catch (error) {
    console.error("HR Analytics Error:", error);
    res.status(500).json({ message: 'Failed to retrieve workforce data.' });
  }
};

module.exports = { getWorkforceData };