const Participant = require('../models/Participants');




exports.getAllParticipants = async (req, res) => {
  try {
    const participants = await Participant.find();
    res.status(200).json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addParticipant = async (req, res) => {
  const { userName, userPhoneNo, userEmail, address,aadharNo,panNo, } = req.body;
  const profileImageURL = req.file ? req.file.path : null;

  try {
    const newParticipant = new Participant({ userName, userPhoneNo, userEmail, address,aadharNo,panNo, profileImageURL });
    await newParticipant.save();
    res.status(201).json(newParticipant);
  } catch (error) {
    res.status(500).json({ error: 'Error adding participant' });
  }
};

exports.searchParticipants = async (req, res) => {
  const { search } = req.query;

  try {
    const participants = await Participant.find({
      $or: [
        { userName: { $regex: search, $options: 'i' } },
        { userPhoneNo: { $regex: search, $options: 'i' } },
      ]
    });
    res.json(participants);
  } catch (error) {
    console.error('Error searching participants:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
