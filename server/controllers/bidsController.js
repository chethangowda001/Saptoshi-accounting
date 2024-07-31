const Bids = require('../models/Bids');
const Participant = require('../models/Participants');

exports.addBid = async (req, res) => {
  const { StartDate, MonthDuration, BidSize, AD } = req.body;
  try {
    const startDate = new Date(StartDate);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + parseInt(MonthDuration));

    const newBid = new Bids({
      StartDate: startDate,
      EndDate: endDate,
      MonthDuration,
      ParticipantsCount: 0,
      BidSize,
      AD,
      users: [],
      Bids: Array.from({ length: MonthDuration }, (_, index) => {
        const bidDate = new Date(startDate);
        bidDate.setMonth(bidDate.getMonth() + index);

        return {
          BidNo: index + 1,
          BidWinner: { userName: '', phoneNumber: '' },
          BidValue: 0,
          BidDate: bidDate,
          BidStake: 0,
          PaymentStatus: [],
        };
      }),
      BidManagementAccount: Array.from({ length: MonthDuration }, (_, index) => ({
        BidNo: index + 1,
        ManagementCredit: 0,
        ManagementDebit: 0,
      }))
    });

    const bid = await newBid.save();
    res.json(bid);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getOngoingBids = async (req, res) => {
  try {
    const currentDate = new Date();
    const ongoingBids = await Bids.find({ EndDate: { $gte: currentDate } });
    res.json(ongoingBids);
  } catch (err) {
    console.error('Error fetching ongoing bids:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getArchivedBids = async (req, res) => {
  try {
    const currentDate = new Date();
    const archivedBids = await Bids.find({ EndDate: { $lt: currentDate } });
    res.json(archivedBids);
  } catch (err) {
    console.error('Error fetching archived bids:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getBidById = async (req, res) => {
  const { id } = req.params;
  try {
    const bid = await Bids.findById(id);
    if (!bid) {
      return res.status(404).json({ msg: 'Bid not found' });
    }
    res.json(bid);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.addUserToBid = async (req, res) => {
  const { id } = req.params;
  const { userName, userPhoneNo } = req.body;

  try {
    const bid = await Bids.findById(id);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    bid.users = bid.users || [];

    const participant = await Participant.findOne({ userName, userPhoneNo });
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    const existingUser = bid.users.find(user => user.participantId.equals(participant._id));
    if (existingUser) {
      return res.status(201).json({ message: 'User already added to this bid.' });
    }

    bid.users.push({
      participantId: participant._id,
      userName: participant.userName,
      userPhoneNo: participant.userPhoneNo,
      StartDate: new Date(),
      BidWinNo: 0,
      BidValue: 0,
      BidPayOut: 0
    });
    bid.ParticipantsCount += 1;

    await bid.save();
    res.json(bid);
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBid = async (req, res) => {
  const { id } = req.params;
  const updatedBid = req.body;

  try {
    const bid = await Bids.findByIdAndUpdate(id, updatedBid, { new: true });
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }
    res.json(bid);
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateBidDetails = async (req, res) => {
  const { bidId, bidNo } = req.params;
  const { BidWinner, BidValue, BidStake, PaymentStatus, BidStart, BidPayOut } = req.body;

  try {
    const bid = await Bids.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    const bidRound = bid.Bids.find(b => b.BidNo === parseInt(bidNo));
    if (!bidRound) {
      return res.status(404).json({ message: 'Bid round not found' });
    }

    bidRound.BidWinner = BidWinner;
    bidRound.BidValue = BidValue;
    bidRound.BidStake = BidStake;
    bidRound.PaymentStatus = PaymentStatus;
    bidRound.BidStart = BidStart;
    bidRound.BidPayOut = BidPayOut;

    await bid.save();
    res.status(200).json({ message: 'Bid updated successfully', bid: bidRound });
  } catch (error) {
    console.error('Error updating bid:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUsersInBid = async (req, res) => {
  const { bidId } = req.params;
  const { users } = req.body;

  try {
    const bid = await Bids.findById(bidId);
    if (!bid) {
      return res.status(404).json({ message: 'Bid not found' });
    }

    bid.users = users;
    await bid.save();
    res.status(200).json({ message: 'Users updated successfully', bid });
  } catch (error) {
    console.error('Error updating users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateUserInBid = async (req, res) => {
  const { bidId, userId } = req.params;
  const updateData = req.body;

  try {
    const bid = await Bids.findOneAndUpdate(
      { _id: bidId, "users._id": userId },
      {
        $set: {
          "users.$.BidWinNo": updateData.BidWinNo,
          "users.$.BidValue": updateData.BidValue,
          "users.$.BidPayOut": updateData.BidPayOut,
        }
      },
      { new: true }
    );

    if (!bid) {
      return res.status(404).send({ message: 'Bid or user not found' });
    }

    res.send(bid);
  } catch (error) {
    console.error('Error updating user in bid:', error);
    res.status(500).send({ message: 'Failed to update user in bid', error });
  }
};

exports.closeBid = async (req, res) => {
  const { bidId, bidNo } = req.params;
  const { totalCredit, totalDebit } = req.body;

  try {
    const updatedBid = await Bids.findOneAndUpdate(
      { _id: bidId, 'BidManagementAccount.BidNo': bidNo },
      {
        $set: {
          'BidManagementAccount.$.ManagementCredit': totalCredit,
          'BidManagementAccount.$.ManagementDebit': totalDebit,
          'Bids.$.BidClose': true
        }
      },
      { new: true }
    );

    if (!updatedBid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    res.status(200).json({ message: 'Bid closed successfully', updatedBid });
  } catch (error) {
    console.error('Error closing bid:', error);
    res.status(500).json({ error: 'Failed to close bid' });
  }
};
