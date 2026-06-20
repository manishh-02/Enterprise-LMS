const User = require('../models/User');

// 1. Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

// 2. Fetch only 'Pending' users
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({ status: 'Pending' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: pendingUsers.length, data: pendingUsers });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching pending users' });
  }
};

// 🛠️ SMART ROLE FORMATTER (Database ko jo case pasand hai wahi dega)
const formatRoleForDB = (roleStr) => {
  if (!roleStr) return 'Employee';
  const r = roleStr.toLowerCase();
  if (r === 'hr') return 'HR';
  if (r === 'admin') return 'Admin';
  if (r === 'instructor') return 'Instructor';
  return 'Employee'; // Default
};

// 3. Admin manually creates a verified user
const provisionUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists with this email.' });

    const finalPassword = password && password.trim() !== '' ? password : 'Password@123';
    
    // 🚨 THE FIX: Ab 'hr' aayega toh DB ko 'HR' jaayega!
    const finalRole = formatRoleForDB(role);

    const user = await User.create({ 
      name, 
      email, 
      password: finalPassword, 
      role: finalRole, 
      status: 'Active' 
    });
    
    res.status(201).json({ 
      success: true, 
      data: { _id: user._id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error("🔥 DATABASE ERROR IN PROVISION USER:", error.message);
    res.status(500).json({ message: 'Server error while creating user account. Check backend terminal.' });
  }
};

// 4. Update User
const updateUser = async (req, res) => {
  try {
    let updateData = { ...req.body };
    
    // 🚨 THE FIX: Update karte time bhi same format filter use hoga
    if (updateData.role) {
      updateData.role = formatRoleForDB(updateData.role); 
    }

    const user = await User.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true } 
    ).select('-password');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, data: user, message: 'Identity updated in Database' });
  } catch (error) {
    console.error("🔥 DATABASE ERROR IN UPDATE USER:", error.message);
    res.status(500).json({ message: 'Error updating user data.' });
  }
};

// 5. Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, message: 'User permanently deleted from enterprise database.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
};

module.exports = { getAllUsers, getPendingUsers, provisionUser, updateUser, deleteUser };