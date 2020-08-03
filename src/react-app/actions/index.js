export const ON_CHANGE_NEW_GAME_BOARD_FIELD = 'ON_CHANGE_NEW_GAME_BOARD_FIELD'
export const onChangeNewGameBoardField = (changedField) => {
  return (
    {
      type: ON_CHANGE_NEW_GAME_BOARD_FIELD,
      changedField
    }
  )
}