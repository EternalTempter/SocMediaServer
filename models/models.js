const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const Users = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    name: {type: DataTypes.STRING},
    surname: {type: DataTypes.STRING},
    unique_id: {type: DataTypes.STRING, unique: true},
    role: {type: DataTypes.STRING, defaultValue: 'USER'},
});

const Messages = sequelize.define('messages', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    outgoing_id: {type: DataTypes.STRING},
    incoming_id: {type: DataTypes.STRING},
    message: {type: DataTypes.STRING},
    viewed: {type: DataTypes.BOOLEAN}
});

const Inbox = sequelize.define('inbox', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    last_message: {type: DataTypes.STRING},
    last_message_user_id: {type: DataTypes.STRING},
    inbox_holder_user_id: {type: DataTypes.STRING},
    inbox_sender_user_id: {type: DataTypes.STRING},
    viewed: {type: DataTypes.BOOLEAN}
});

const Post = sequelize.define('post', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    post_handler_type: {type: DataTypes.STRING},
    post_handler_id: {type: DataTypes.STRING},
    image: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    likes_amount: {type: DataTypes.INTEGER},
    comments_amount: {type: DataTypes.INTEGER},
    shares_amount: {type: DataTypes.INTEGER},
    views_amount: {type: DataTypes.INTEGER},
});

const UserData = sequelize.define('userData', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: DataTypes.STRING},
    image: {type: DataTypes.STRING},
    panoramaImage: {type: DataTypes.STRING},
    date_birth: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING}, 
});

const Friendship = sequelize.define('friendship', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    profile_from: {type: DataTypes.STRING},
    profile_to: {type: DataTypes.STRING},
    status: {type: DataTypes.STRING},
})

const Group = sequelize.define('group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    group_name: {type: DataTypes.STRING},
    image: {type: DataTypes.STRING},
    panoramaImage: {type: DataTypes.STRING},
    type: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    owner_id: {type: DataTypes.STRING},
})

const GroupUsers = sequelize.define('groupUsers', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    group_id: {type: DataTypes.STRING},
    user_id: {type: DataTypes.STRING},
})

const Comments = sequelize.define('comments', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    post_id: {type: DataTypes.STRING},
    user_id: {type: DataTypes.STRING},
    comment: {type: DataTypes.STRING},
    likes_amount: {type: DataTypes.INTEGER}
})

const Likes = sequelize.define('likes', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING},
    post_id: {type: DataTypes.STRING},
    user_id: {type: DataTypes.STRING}
})

const News = sequelize.define('news', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    image: {type: DataTypes.STRING},
    label: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
    time_spent: {type: DataTypes.STRING}
})

module.exports = {
    Users, 
    Messages, 
    Inbox,
    Post,
    UserData,
    Friendship,
    Group,
    GroupUsers,
    Comments,
    Likes,
    News
}