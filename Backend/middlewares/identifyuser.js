// Middleware to attach user details to req.user
import { NGO } from "../models/ngo.model.js";
import { Volunteer } from "../models/volunteer.model.js";

export const identifyUser = async (req, res, next) => {
  const { id, role } = req; // should be set by your isAuthenticated middleware
  if (!id || !role) return res.status(401).json({ message: 'Unauthorized' });

  let user;
  if (role === 'NGO') {
    user = await NGO.findById(id);
  } else if (role === 'Volunteer') {
    user = await Volunteer.findById(id);
  }

  if (!user) return res.status(404).json({ message: 'User not found' });

  req.user = user;
  next();
};
