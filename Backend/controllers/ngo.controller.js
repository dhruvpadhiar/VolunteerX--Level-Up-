import { NGO } from "../models/ngo.model.js";
import { Volunteer } from "../models/volunteer.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js"; // ✅ Add this line

export const registerNGO = async (req, res) => {
    try {
        const { name, email, password, registrationNo } = req.body;

        if (!name || !email || !password || !registrationNo) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const existingNGO = await NGO.findOne({ email });
        if (existingNGO) {
            return res.status(400).json({ success: false, message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const ngo = await NGO.create({
            ...req.body,
            password: hashedPassword
        });

        // Register in User model as well
        await User.create({
            username: name,
            email,
            password: hashedPassword,
            type: "ngo"
        });

        return res.status(201).json({ success: true, message: "NGO registered successfully", ngo });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const loginNGO = async (req, res) => {
    try {
        const { email, password } = req.body;

        const ngo = await NGO.findOne({ email });
        if (!ngo || !(await bcrypt.compare(password, ngo.password))) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: ngo._id, role: "ngo" }, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res
            .cookie('token', token, { httpOnly: true, maxAge: 86400000, sameSite: 'strict' })
            .json({ success: true, message: `Welcome ${ngo.name}`, ngo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const logoutNGO = (_, res) => {
    return res.cookie('token', '', { maxAge: 0 }).json({ success: true, message: 'Logged out' });
};

export const getNGOProfile = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.params.id).populate('posts members events.active events.upcoming events.past');
        if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

        res.status(200).json({ success: true, ngo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const editNGOProfile = async (req, res) => {
    try {
        const ngo = await NGO.findById(req.id); // from middleware
        if (!ngo) return res.status(404).json({ success: false, message: "NGO not found" });

        const profileImage = req.file ? getDataUri(req.file) : null;
        if (profileImage) {
            const upload = await cloudinary.uploader.upload(profileImage);
            ngo.profileImage = upload.secure_url;
        }

        Object.assign(ngo, req.body);
        await ngo.save();

        res.status(200).json({ success: true, message: "NGO profile updated", ngo });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export const addEvent = async (req, res) => {
    try {
      const {
        name,
        type,
        description,
        location,
        startDate,
        endDate,
        skillsRequired,
        volunteerCapacity,
        totalHours,
      } = req.body;

    //   const ngoId = req.id; // Set by auth middleware
    const ngoId = "67f15cd8310d39a2a9962334";
      console.log("NGO ID:", ngoId);

      // Handle photo upload
      let photoUrl = null;
      if (req.file) {
        const fileUri = getDataUri(req.file);
        // console.log("File URI:", fileUri);
        const uploadedPhoto = await cloudinary.uploader.upload(fileUri);
        photoUrl = uploadedPhoto.secure_url;
      }
      

      // Determine event status
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
      let status = "upcoming";
      if (start <= now && end >= now) status = "active";
      else if (end < now) status = "past";

      // Create event
      const newEvent = await Event.create({
        name,
        type,
        photo: photoUrl,
        description,
        location,
        startDate,
        endDate,
        skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : skillsRequired?.split(','),
        volunteerCapacity,
        status,
        hostedBy: ngoId,
        totalHours
      });

      // Link event to NGO
      await NGO.findByIdAndUpdate(
        ngoId,
        { $push: { [`events.${status}`]: newEvent._id } },
        { new: true }
      );

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        event: newEvent
      });

    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  
  export const voluJoin = async (req, res) => {
    try {
    //   const volunteerId = req.id; // from isAuthenticated middleware
    const volunteerId="";
      const { eventId } = req.params;
  
      // Step 1: Find the volunteer
      const volunteer = await Volunteer.findById(volunteerId);
      if (!volunteer) {
        return res.status(404).json({ success: false, message: "Volunteer not found" });
      }
  
      // Step 2: Check if volunteer has already joined the event
      if (!volunteer.eventsOngoing.includes(eventId)) {
        return res.status(400).json({ success: false, message: "Event not found in volunteer's ongoing events" });
      }
  
      // Step 3: Find the event
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ success: false, message: "Event not found" });
      }
  
      // Step 4: Find the NGO hosting this event
      const ngo = await NGO.findOne({ 
        $or: [
          { "events.active": eventId },
          { "events.upcoming": eventId },
          { "events.past": eventId }
        ]
      });
  
      if (!ngo) {
        return res.status(404).json({ success: false, message: "NGO hosting the event not found" });
      }
  
      // Step 5: Add volunteer to NGO members if not already added
      if (!ngo.members.includes(volunteerId)) {
        ngo.members.push(volunteerId);
        await ngo.save();
      }
  
      // Optional: Add NGO to volunteer's memberOf array
      if (!volunteer.memberOf.includes(ngo._id)) {
        volunteer.memberOf.push(ngo._id);
        await volunteer.save();
      }
  
      return res.status(200).json({
        success: true,
        message: "Volunteer successfully linked to NGO as a member",
        ngoId: ngo._id
      });
  
    } catch (err) {
      console.error("Error in voluJoin:", err);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };
  