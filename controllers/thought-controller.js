const { User, Thought } = require("../models");

const thoughtController = {
  allThoughts(req, res) {
    Thought.find({})
      .select("-__v")
      .sort({ createdAt: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => res.status(500).json(err));
  },
  
  getThoughtById({ params }, res) {
    Thought.findOne({ _id: params.thoughtId })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No Thought Found With This Id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  },
  
  createThought(req, res) {
    Thought.create(req.body)
      .then(dbThoughtData => {
          return User.findOneAndUpdate(
              { _id: req.body.userId },
              { $push: { thoughts: dbThoughtData._id }},
              { new: true }
          );
      })
      .then(dbUserData => {
          if(!dbUserData) {
              res.status(404).json({ message: 'No User Found With This Id!' });
              return;
          }
          res.json({ message: 'Thought Created!' });
      })
      .catch(err => res.status(500).json(err));
},
  
  updateThought({ params, body }, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {new: true,runValidators: true,})
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No Thought Found With This Id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  },
  
  deleteThought({ params }, res) {
    Thought.findOneAndRemove({ _id: params.thoughtId })
      .then(dbThoughtData => {
          if(!dbThoughtData) {
              res.status(404).json({ message: 'No thought found with this ID.' });
              return;
          }
        return User.findOneAndUpdate({ thoughts: params.thoughtId }, { $pull: { thoughts: params.thoughtId }}, { new: true });
      })
      .then(dbUserData => {
          if(!dbUserData) {
              res.status(404).json({ message: 'No User Found With This Id!'});
              return;
          }
          res.json({ message: 'Thought deleted.' });
      })
      .catch(err => res.status(500).json(err));
},

addReaction({ params, body}, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, { $addToSet: { reactions: body }}, { new: true, runValidators: true })
    .then(dbThoughtData => {
        if(!dbThoughtData) {
            res.status(404).json({ message: 'No Thought Found With This Id!' });
            return;
        }
        res.json(dbThoughtData);
    })
    .catch(err => res.status(500).json(err));
},
  
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true, runValidators: true }
    )
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({ message: "No Thought Found With This Id!" });
          return;
        }
        res.json(dbThoughtData);
      })
      .catch(err => res.status(500).json(err));
  },
};

module.exports = thoughtController;