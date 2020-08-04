import * as ActionTypes from '../actions' 

const initialState = {
  base: {
    newGame: {
      position: "start",
      // custom square styles
      squareStyles: {},
      // square with the currently clicked piec
      // array of past game moves
      history: [],
      game: null,
    }
  }
}

const mainReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ON_CHANGE_NEW_GAME_BOARD_FIELD: {
      const { changedField } = action
      return {
        ...state,
        base: {
          ...state.base,
          newGame: {
            ...state.base.newGame,
            ...changedField
          }
        },
      }
    }

    default: {
      return state
    }
  }
}

export default mainReducer
