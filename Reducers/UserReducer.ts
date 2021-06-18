const initialUserState = {
    signedInUser: {
        ID: "",
        Name: "",
        Email: "",
        ImageURI: "",
        Status: "Hey there, I am using WhatsApp.",
        Contacts: [],
        Chats: [],
    }
}

export const userReducer = (state = initialUserState, action: any) => {
    switch (action.type) {
        case "GET_IN":
            return {
                ...state,
                signedInUser: action.signedInUser
            }
        case "PROFILE_UPDATE":
            return {
                ...state,
                signedInUser: {
                    ...state.signedInUser,
                    Name: action.signedInUser.Name,
                    ImageURI: action.signedInUser.ImageURI,
                    Status: action.signedInUser.Status
                }
            }
        case "UPDATE_CHAT":
            return {
                ...state,
                signedInUser: {
                    ...state.signedInUser,
                    Chats: action.Chats
                }
            }


        default:
            return {
                ...state
            }
    }

}