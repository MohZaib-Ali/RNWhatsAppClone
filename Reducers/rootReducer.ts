import { combineReducers } from "redux";
import { userReducer } from "./UserReducer";
import { socketReducer } from "./SocketReducer"
const rootReducer = combineReducers({
    userState: userReducer,
    socketState: socketReducer,
})
export default rootReducer;