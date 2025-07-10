import { UserModel } from "./models/UserModel.js";
import { Comments } from "./models/Comments.js";
import { AllComments } from "./models/AllComments.js";

UserModel.hasMany(AllComments, {
  foreignKey: 'id_user',
  as: 'allComments'
});
AllComments.belongsTo(UserModel, {
  foreignKey: 'id_user',
  as: 'users'
});

Comments.hasMany(AllComments, {
  foreignKey: 'id_comment',
  as: 'allComments'
});
AllComments.belongsTo(Comments, {
  foreignKey: 'id_comment',
  as: 'comments'
});

export { UserModel, Comments, AllComments };
