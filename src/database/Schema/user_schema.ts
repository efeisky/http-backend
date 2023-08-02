import mongoose, { Schema} from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    unique_id: { type: String, required: true, unique: true },
    verify_status: { type: Boolean, required: true },
    account_status: { type: Boolean, required: true },
    login_status: { type: Boolean, required: true},
    create_date: { type: Date, required: true }
}, { collection : 'table_user'});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
