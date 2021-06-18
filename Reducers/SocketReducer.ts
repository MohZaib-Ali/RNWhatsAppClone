import { Socket } from "socket.io-client"

const initialSocketState = {
    Socket: (null as unknown as Socket)
}

export const socketReducer = (state = initialSocketState, action: any) => {
    switch (action.type) {
        case "SET_SOCKET":
            return {
                ...state,
                Socket: action.Socket
            }
        default:
            return {
                ...state
            }
    }

}