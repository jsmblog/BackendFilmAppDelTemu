import express from 'express';
import { login,updateUsersPassword, updateUsersEmail, getUsers,createUsers,updateUsers,deleteUsers,getOneUser} from '../controller/UserController.js';
import  {verifyToken}  from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

const upPhotoProfile = multer({
    storage:multer.memoryStorage()
});

router.get('/user',verifyToken, getUsers);
router.get('/user/:id',verifyToken, getOneUser);
router.post('/register', upPhotoProfile.array('photo',1), createUsers);
router.put('/user/:id',verifyToken, updateUsers);
router.delete('/user/:id', verifyToken, deleteUsers);
router.post('/login', login);
router.put('/user/email/:id',verifyToken, updateUsersEmail);
router.put('/user/password/:id',verifyToken, updateUsersPassword);
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'Error al subir archivos',
      details: err.message
    });
  }
  next(err);
});
export const RouterUsuer = router;
