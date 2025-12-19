const User = require('../models/User');

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, phone, location, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, phone, location, bio },
      { new: true }
    ).select('-password');

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const exportUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    // In a real app, you would generate and email the data export
    res.status(200).json({ 
      success: true, 
      message: 'Data export initiated. You will receive an email shortly.' 
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    // In a real app, you would soft delete or schedule deletion
    res.status(200).json({ 
      success: true, 
      message: 'Account deletion initiated' 
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  updateProfile,
  exportUserData,
  deleteAccount
};