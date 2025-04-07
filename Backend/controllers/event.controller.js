import { Event } from "../models/event.model.js";

export const getAllEvent = async (req,res) => {
    try {

        const events = await Event.find({});

    return res.status(200).json({
      success: true,
      message: "All events fetched successfully",
      events,
    });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}