import { Volunteer } from "../models/volunteer.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js"; // ✅ Add this line


export const registerVolunteer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const existingUser = await Volunteer.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const volunteer = await Volunteer.create({
            ...req.body,
            password: hashedPassword
        });

        // Register in User model as well
        await User.create({
            username: name,
            email,
            password: hashedPassword,
            type: "volunteer"
        });

        return res.status(201).json({ success: true, message: "Volunteer registered successfully", volunteer });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const loginVolunteer = async (req, res) => {
    try {
        const { email, password } = req.body;

        const volunteer = await Volunteer.findOne({ email });
        if (!volunteer || !(await bcrypt.compare(password, volunteer.password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: volunteer._id, role: "volunteer" }, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res
            .cookie('token', token, { httpOnly: true, maxAge: 86400000, sameSite: 'strict' })
            .json({ success: true, message: `Welcome ${volunteer.name}`, volunteer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const logoutVolunteer = (_, res) => {
    return res.cookie('token', '', { maxAge: 0 }).json({ success: true, message: 'Logged out' });
};

export const getVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id).populate('posts eventsOngoing eventsCompleted memberOf');
        if (!volunteer) return res.status(404).json({ success: false, message: "Volunteer not found" });

        res.status(200).json({ success: true, volunteer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const editVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.id);
        if (!volunteer) return res.status(404).json({ success: false, message: "Volunteer not found" });

        const profileImage = req.file ? getDataUri(req.file) : null;
        if (profileImage) {
            const upload = await cloudinary.uploader.upload(profileImage);
            volunteer.profileImage = upload.secure_url;
        }

        Object.assign(volunteer, req.body);
        await volunteer.save();

        res.status(200).json({ success: true, message: "Profile updated", volunteer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}


export const updateJoinEvent = async (req, res) => {
    try {
    //   const volunteerId = req.id; // set by auth middleware
    const volunteerId = "67f15d2b310d39a2a9962339";
      console.log(volunteerId);
      const { eventId } = req.params;
  
      // Check if the event exists
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
  
      // Update volunteer's eventsOngoing if not already added
      const volunteer = await Volunteer.findById(volunteerId);
      if (!volunteer) {
        return res.status(404).json({ success: false, message: "Volunteer not found" });
      }
  
      const alreadyJoined = volunteer.eventsOngoing.includes(eventId);
      if (alreadyJoined) {
        return res.status(400).json({ success: false, message: "Already joined this event" });
      }
  
      volunteer.eventsOngoing.push(eventId);
      await volunteer.save();
  
      return res.status(200).json({
        success: true,
        message: "Successfully joined the event",
        updatedVolunteer: volunteer,
      });
  
    } catch (err) {
      console.error("Error joining event:", err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

export const joinEvent = async (req, res) => {
  const { eventId } = req.params;
  const volunteerId = req.user._id; // assuming JWT auth stores user in req.user

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check if already requested
    if (event.volunteerRequests.includes(volunteerId)) {
      return res.status(400).json({ message: "Already requested to join" });
    }

    event.volunteerRequests.push(volunteerId);
    await event.save();

    // Optionally update Volunteer model too
    await Volunteer.findByIdAndUpdate(volunteerId, {
      $addToSet: { requestedEvents: eventId },
    });

    res.status(200).json({ message: "Request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


