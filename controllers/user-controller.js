const { User, Thought } = require('../models');

const userController = {
    allUsers(req, res) {
        User.find({})
          .select('-__v')
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(500).json(err));
    },


    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
          .populate({
              path: 'friends',
              select: '-__v'
          })
          .populate({
              path: 'thoughts',
              select: '-__v'
          })
          .select('-__v')
          .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No User Found With This Id!' }); 
                return;
            }
            res.json(dbUserData);
          })
          .catch(err => res.status(500).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
          .then(dbUserData => res.json(dbUserData))
          .catch(err => res.status(400).json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true})
          .then(dbUserData => {
              if(!dbUserData) {
                  res.status(404).json({ message: 'No User Found With This Id!' });
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => res.status(500).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then(dbUserData => {
              if(!dbUserData) {
                  res.status(404).json({ message: 'No User Found With This Id!' });
                  return;
              }
              return Thought.deleteMany({ _id: { $in: dbUserData.thoughts} });
          })
          .then(() => res.json({ message: 'User and Thoughts Deleted!' }))
          .catch(err => res.status(500).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $addToSet: { friends: params.friendId }}, { new: true })
          .then(dbUserData => {
              if(!dbUserData) {
                  res.status(404).json({ message: 'No User Found With This Id!' });
                  return;
              }
              res.json(dbUserData);
          })
          .catch(err => res.status(500).json(err));
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate({ _id: params.userId }, { $pull: { friends: params.friendId }}, { new: true })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No User Found With This Id!'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(500).json(err));
    }
};

module.exports = userController;