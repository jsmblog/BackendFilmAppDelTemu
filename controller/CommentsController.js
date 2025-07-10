import { UserModel } from "../models/UserModel.js";
import { Comments } from "../models/Comments.js";
import { AllComments } from "../models/AllComments.js";
import { sequelize } from "../db/conexion.js";

export const createComment = async (req, res) => {
  try {
    const { comment, id_user, id_movie } = req.body;

    if (!comment?.trim() || !id_user || !id_movie) {
      return res.status(400).json({ msg: "Please fill in all fields." });
    }

    const existing = await AllComments.findOne({
      where: { id_user, id_movie }
    });
    if (existing) {
      return res
        .status(400)
        .json({ msg: "You already have a comment on this movie." });
    }

    const newComment = await Comments.create({
      comment: comment.trim(),
      id_user
    });

    await AllComments.create({
      id_comment: newComment.id,
      id_user,
      id_movie
    });

    return res
      .status(201)
      .json({ msg: "Comment created successfully." });

  } catch (error) {
    console.error("Error in createComment:", error);
    return res
      .status(500)
      .json({ msg: "Server error, please try again later." });
  }
};

export const getCommentsByIdMovie = async (req, res) => {
    try {
        const {id_movie} = req.params;
        const comments = await AllComments.findAll(
            {where: {id_movie},
            include: [
                {model: Comments,
                as: 'comments',
                attributes:['id','comment','state','createdAt','updatedAt','likes']
                },
                {
                model: UserModel,
                as: 'users',
                attributes: ['id', 'user','photoProfile']
                }
        ]
            }   
        );
        res.status(200).json(comments);
        } catch (error) {
            console.log(error);
        }
}

export const deleteComment = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const existing = await Comments.findByPk(id, { transaction: t });
    if (!existing) {
      await t.rollback();
      return res.status(404).json({ msg: 'Comment not found.' });
    }

    await AllComments.destroy({
      where: { id_comment: id },
      transaction: t
    });

    await Comments.destroy({
      where: { id },
      transaction: t
    });

    await t.commit();
    return res.status(200).json({ msg: 'Comment and related links deleted successfully.' });
  } catch (error) {
    await t.rollback();
    console.error('Error deleting comment:', error);
    return res.status(500).json({ msg: 'Server error, please try again later.' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    if (!comment?.trim()) {
      return res.status(400).json({ msg: 'Please provide a non-empty comment.' });
    }

    const existing = await Comments.findByPk(id);
    if (!existing) {
      return res.status(404).json({ msg: 'Comment not found.' });
    }

    existing.comment = comment.trim();
    existing.state = true;
    await existing.save();

    return res.status(200).json({ msg: 'Comment updated successfully.', comment: existing });
  } catch (err) {
    console.error('Error updating comment:', err);
    return res.status(500).json({ msg: 'Server error, please try again later.' });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { idComment,type } = req.body;
    const { id } = req.params;

    if (!id) return res.status(401).json({ message: 'No autorizado' });
    if (!['like', 'dislike'].includes(type)) return res.status(400).json({ message: 'Tipo inválido' });

    const comment = await Comments.findByPk(idComment);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    const currentLikes = JSON.parse(comment.likes) || [];
    const existingVote = currentLikes.find(like => like.id === id);

    let updatedLikes;

    if (existingVote) {
      if (existingVote.type === type) {
        updatedLikes = currentLikes.filter(like => like.id !== id);
      } else {
        updatedLikes = currentLikes.map(like =>
          like.id === id ? { ...like, type } : like
        );
      }
    } else {
      updatedLikes = [...currentLikes, { id: id, type }];
    }

    comment.likes = updatedLikes;
    await comment.save();

    return res.status(200).json({ message: 'Voto actualizado correctamente', likes: updatedLikes });
  } catch (error) {
    console.error('Error en updateCommentLike:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};