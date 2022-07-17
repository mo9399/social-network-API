const router = require('express').Router();

const {
    allUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend
} = require('../../controllers/user-controller');

// Get all Users
router.route('/')
  .get(allUsers)
  .post(createUser);

//Get user by id 
router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

//Add and Delete Friend 
router.route('/:userId/friends/:friendId')
  .post(addFriend)
  .delete(deleteFriend);

module.exports = router;