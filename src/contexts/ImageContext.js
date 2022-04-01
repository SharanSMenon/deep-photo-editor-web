import React from "react"
import { reducer, initialState } from "./reducer"

export const ImageContext = React.createContext(initialState)

export const ImageProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState)

    return (
        <ImageContext.Provider value={[state, dispatch]}>
            {children}
        </ImageContext.Provider>
    )
}