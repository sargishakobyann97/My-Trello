import {
    SET_CARD_LIST,
    SET_EMAIL,
    SET_EMAIL_ERROR,
    SET_HAS_ACCOUNT,
    SET_PASSWORD,
    SET_PASSWORD_ERROR,
    SET_SONG,
    SET_USER
} from "../actions/actionTypes"

const initilalState = {
    user: "",
    email: "",
    password: "",
    emailError: "",
    passwordError: "",
    hasAccount: false,
    cardList: [],
    song: true,
    initialItemsValue: [
        {
            type: 'paragraph',
            children: [
                { text: '' }
            ],
        }
    ]
}

export default function rootReducer(state = initilalState, action) {

    switch (action.type) {
        case SET_EMAIL:
            return {
                ...state,
                email: action.email
            }
        case SET_HAS_ACCOUNT:
            return {
                ...state,
                hasAccount: !state.hasAccount
            }
        case SET_PASSWORD:
            return {
                ...state,
                password: action.password
            }
        case SET_USER:
            return {
                ...state,
                user: action.isUser
            }
        case SET_CARD_LIST:
            return {
                ...state,
                cardList: action.newCardList
            }
        case SET_PASSWORD_ERROR:
            return {
                ...state,
                passwordError: action.message
            }
        case SET_EMAIL_ERROR:
            return {
                ...state,
                emailError: action.message
            }
        case SET_SONG:
            return {
                ...state,
                song: !state.song
            }
        default:
            return state
    }
}