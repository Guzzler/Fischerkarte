import _ from "lodash"
export const CHESS_BOARD_SQUARES = [
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
]

export const findWeaknessScoringforParticularPosition = (game) => {
  const boardPosition = game.board()
  let whiteScoring = {}
  let blackScoring = {}
  boardPosition.forEach((rank, rankIndex) => {
    rank.forEach((square, squareIndex) => {
      if (square !== null) {
        const squareNotation = CHESS_BOARD_SQUARES[(rankIndex*8) + squareIndex]
        let squareMoves = game.moves({
          square: squareNotation,
          verbose: true
        });

        const isWhitePiece = square.color === 'w'
        switch(square.type) {
          case 'p':
            const adjacentFiles = [squareIndex - 1, squareIndex + 1].filter((ind) => ind >= 0 && ind <= 7)
            if(isWhitePiece) {
              const startingRank = rankIndex - 1
              let breakLoop = false
              let pawnScore = 32
              for (let i= startingRank; i>=0; i--) {
                if (boardPosition[i][squareIndex]) {
                  breakLoop = true
                }
                // eslint-disable-next-line
                adjacentFiles.forEach((j) => {
                  whiteScoring = addScoreToDict(whiteScoring, CHESS_BOARD_SQUARES[(i*8) + j], pawnScore) 
                })
                pawnScore = pawnScore / 2
                if (breakLoop) {
                  break;
                }
              }
            } else {
              const startingRank = rankIndex + 1
              let breakLoop = false
              let pawnScore = 32
              for (let i = startingRank; i < 8; i++) {
                if (boardPosition[i][squareIndex]) {
                  breakLoop = true
                }
                // eslint-disable-next-line
                adjacentFiles.forEach((j) => {
                  blackScoring = addScoreToDict(blackScoring, CHESS_BOARD_SQUARES[(i * 8) + j], pawnScore)
                })
                pawnScore = pawnScore / 2
                if (breakLoop) {
                  break;
                }
              }
            }
            break
          case 'q':
            if (isWhitePiece) {
              squareMoves.forEach((move) => {
                whiteScoring = addScoreToDict(whiteScoring, move.to, 8)
              })
            } else {
              squareMoves.forEach((move) => {
                blackScoring = addScoreToDict(blackScoring, move.to, 8)
              })
            }
            break
          case 'n':
          case 'b':
            if (isWhitePiece) {
              squareMoves.forEach((move) => {
                whiteScoring = addScoreToDict(whiteScoring, move.to, 16)
              })
            } else {
              squareMoves.forEach((move) => {
                blackScoring = addScoreToDict(blackScoring, move.to, 16)
              })
            }
            break
          case 'k':
            if (isWhitePiece) {
              const files = [squareIndex - 1, squareIndex, squareIndex + 1].filter((ind) => ind >= 0 && ind <= 7)
              const ranks = [rankIndex - 1, rankIndex, rankIndex + 1].filter((ind) => ind >= 0 && ind <= 7)
              files.forEach((file) => {
                ranks.forEach((rank) => {
                  whiteScoring = addScoreToDict(whiteScoring, CHESS_BOARD_SQUARES[(rank * 8) + file], 4)
                })
              })
            } else {
              const files = [squareIndex - 1, squareIndex, squareIndex + 1].filter((ind) => ind >= 0 && ind <= 7)
              const ranks = [rankIndex - 1, rankIndex, rankIndex + 1].filter((ind) => ind >= 0 && ind <= 7)
              files.forEach((file) => {
                ranks.forEach((rank) => {
                  blackScoring = addScoreToDict(blackScoring, CHESS_BOARD_SQUARES[(rank * 8) + file], 4)
                })
              })
            }
            break
          case 'r':
            if (isWhitePiece) {
              squareMoves.forEach((move) => {
                whiteScoring = addScoreToDict(whiteScoring, move.to, 4)
              })
            } else {
              squareMoves.forEach((move) => {
                blackScoring = addScoreToDict(blackScoring, move.to, 12)
              })
            }
            break
          default:
            break
        }
      }
    })
  })

  
  return {
    whiteScoring,
    blackScoring
  };
}

const addScoreToDict = (dict, square, scoreToAdd) => {
  const changedDict = _.cloneDeep(dict)
  if (changedDict[square]) {
    changedDict[square] = changedDict[square] += scoreToAdd
  }
  else {
    changedDict[square] = scoreToAdd
  }
  return changedDict
} 

export const calculateHeatmapScoring = (weaknessScoring) => {
  const heatmapScoring = {}
  CHESS_BOARD_SQUARES.forEach((square) => {
    const blackScore = weaknessScoring.blackScoring[square] || 0
    const whiteScore = weaknessScoring.whiteScoring[square] || 0
    heatmapScoring[square] = whiteScore - blackScore
  })
  return heatmapScoring
}