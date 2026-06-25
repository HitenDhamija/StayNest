const User = require('../models/User');

exports.toggleWishlist = async (req, res) => {
  try {
    const { placeId } = req.body;
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    const index = user.wishlist.indexOf(placeId);
    if (index > -1) {
      user.wishlist.splice(index, 1);
    } else {
      user.wishlist.push(placeId);
    }
    await user.save();
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
