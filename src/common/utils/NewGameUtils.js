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

export const heatmapRGBMapping = {
  '0.05': 'rgb(165,0,38)',
  '0.15': 'rgb(215,48,39)',
  '0.25': 'rgb(244,109,67)',
  '0.35': 'rgb(253,174,97)',
  '0.45': 'rgb(254,224,144)',
  '0.55': 'rgb(224,243,248)',
  '0.65': 'rgb(171,217,233)',
  '0.75': 'rgb(116,173,209)',
  '0.85': 'rgb(69,117,180)',
  '0.95': 'rgb(49,54,149)',
}

export const heatmapBins = [
  0.05,0.15,0.25,0.35,0.45,0.55,0.65,0.75,0.85,0.95
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
            const diagonalMoves = calculateBishopMoves(rankIndex, squareIndex, squareMoves)
            const straightMoves = calculateRookMoves(rankIndex, squareIndex, squareMoves)
            if (isWhitePiece) {
              diagonalMoves.forEach((move) => {
                whiteScoring = addScoreToDict(whiteScoring, move, 8)
              })
              straightMoves.forEach((move) => {
                whiteScoring = addScoreToDict(whiteScoring, move, 8)
              })
            } else {
              diagonalMoves.forEach((move) => {
                blackScoring = addScoreToDict(blackScoring, move, 8)
              })
              straightMoves.forEach((move) => {
                blackScoring = addScoreToDict(blackScoring, move, 8)
              })
            }
            break
          case 'n':
            const knightMoves = calculateKnightMoves(rankIndex, squareIndex)
            if (isWhitePiece) {
              knightMoves.forEach((move) => {
                whiteScoring = addScoreToDict(whiteScoring, move, 16)
              })
            } else {
              knightMoves.forEach((move) => {
                blackScoring = addScoreToDict(blackScoring, move, 16)
              })
            }
            break
          case 'b':
            const bishopMoves = calculateBishopMoves(rankIndex, squareIndex, squareMoves)
            if (isWhitePiece) {
              bishopMoves.forEach((move) => {
                whiteScoring = addScoreToDict(whiteScoring, move, 16)
              })
            } else {
              bishopMoves.forEach((move) => {
                blackScoring = addScoreToDict(blackScoring, move, 16)
              })
            }
            break
          case 'k':
            const files = [squareIndex - 1, squareIndex, squareIndex + 1].filter((ind) => ind >= 0 && ind <= 7)
            const ranks = [rankIndex - 1, rankIndex, rankIndex + 1].filter((ind) => ind >= 0 && ind <= 7)
            if (isWhitePiece) {
              files.forEach((file) => {
                ranks.forEach((rank) => {
                  whiteScoring = addScoreToDict(whiteScoring, CHESS_BOARD_SQUARES[(rank * 8) + file], 4)
                })
              })
            } else {
              files.forEach((file) => {
                ranks.forEach((rank) => {
                  blackScoring = addScoreToDict(blackScoring, CHESS_BOARD_SQUARES[(rank * 8) + file], 4)
                })
              })
            }
            break
          case 'r':
            const rookMoves = calculateRookMoves(rankIndex, squareIndex, squareMoves)
            if (isWhitePiece) {
              rookMoves.forEach((move) => {
                whiteScoring = addScoreToDict(whiteScoring, move, 12)
              })
            } else {
              rookMoves.forEach((move) => {
                blackScoring = addScoreToDict(blackScoring, move, 12)
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

const calculateKnightMoves = (rankIndex, squareIndex) => {
  const knightPlacesToMove = []
  const rankMinus1True = rankIndex - 1 >= 0
  const rankMinus2True = rankIndex - 2 >= 0
  const squareMinus1True = squareIndex - 1 >= 0
  const squareMinus2True = squareIndex - 2 >= 0
  const rankPlus1True = rankIndex + 1 <= 7
  const rankPlus2True = rankIndex + 2 <= 7
  const squarePlus1True = squareIndex + 1 <= 7
  const squarePlus2True = squareIndex + 2 <= 7

  if (rankMinus1True) {
    if (squarePlus2True) {
      knightPlacesToMove.push(CHESS_BOARD_SQUARES[((rankIndex - 1) * 8) + squareIndex + 2])
    }
    if (squareMinus2True) {
      knightPlacesToMove.push(CHESS_BOARD_SQUARES[((rankIndex - 1) * 8) + squareIndex - 2])
    }
  }

  if (rankMinus2True) {
    if (squarePlus1True) {
      knightPlacesToMove.push(CHESS_BOARD_SQUARES[((rankIndex - 2) * 8) + squareIndex + 1])
    }
    if (squareMinus1True) {
      knightPlacesToMove.push(CHESS_BOARD_SQUARES[((rankIndex - 2) * 8) + squareIndex - 1])
    }
  }

  if (rankPlus2True) {
    if (squarePlus1True) {
      knightPlacesToMove.push(CHESS_BOARD_SQUARES[((rankIndex + 2) * 8) + squareIndex + 1])
    }
    if (squareMinus1True) {
      knightPlacesToMove.push(CHESS_BOARD_SQUARES[((rankIndex + 2) * 8) + squareIndex - 1])
    }
  }

  if (rankPlus1True) {
    if (squarePlus2True) {
      knightPlacesToMove.push(CHESS_BOARD_SQUARES[((rankIndex + 1) * 8) + squareIndex + 2])
    }
    if (squareMinus2True) {
      knightPlacesToMove.push(CHESS_BOARD_SQUARES[((rankIndex + 1) * 8) + squareIndex - 2])
    }
  }
  return knightPlacesToMove
}

const calculateBishopMoves = (rankIndex, squareIndex, squareMoves) => {
  const bishopPlacestoMove = []
  const allBishopToMoveSquares = squareMoves.map((move) => move.to)
  let goNorthWest = true
  let goNorthEast = true
  let goSouthEast = true
  let goSouthWest = true
  for (let increment = 1; increment <= 7; increment++) {
    const rankMinus = ((rankIndex - increment) >= 0)
    const rankPlus = ((rankIndex + increment) <= 7)
    const squareMinus = ((squareIndex - increment) >= 0)
    const squarePlus = ((squareIndex + increment) <= 7)
    if (!goNorthWest && !goNorthEast && !goSouthWest && !goSouthEast) {
      break;
    }
    if (goNorthWest && rankMinus && squareMinus) {
      if (allBishopToMoveSquares.indexOf(CHESS_BOARD_SQUARES[((rankIndex - increment) * 8) + squareIndex - increment]) === -1) {
        goNorthWest = false
      }
      bishopPlacestoMove.push(CHESS_BOARD_SQUARES[((rankIndex - increment) * 8) + squareIndex - increment])
    }
    if (goNorthEast && rankMinus && squarePlus) {
      if (allBishopToMoveSquares.indexOf(CHESS_BOARD_SQUARES[((rankIndex - increment) * 8) + squareIndex + increment]) === -1) {
        goNorthEast = false
      }
      bishopPlacestoMove.push(CHESS_BOARD_SQUARES[((rankIndex - increment) * 8) + squareIndex + increment])
    }
    if (goSouthWest && rankPlus && squareMinus) {
      if (allBishopToMoveSquares.indexOf(CHESS_BOARD_SQUARES[((rankIndex + increment) * 8) + squareIndex - increment]) === -1) {
        goSouthWest = false
      }
      bishopPlacestoMove.push(CHESS_BOARD_SQUARES[((rankIndex + increment) * 8) + squareIndex - increment])
    }
    if (goSouthEast && rankPlus && squareMinus) {
      if (allBishopToMoveSquares.indexOf(CHESS_BOARD_SQUARES[((rankIndex + increment) * 8) + squareIndex + increment]) === -1) {
        goSouthEast = false
      }
      bishopPlacestoMove.push(CHESS_BOARD_SQUARES[((rankIndex + increment) * 8) + squareIndex + increment])
    }
  }
  return bishopPlacestoMove
}

const calculateRookMoves = (rankIndex, squareIndex, squareMoves) => {
  const rookPlacestoMove = []
  const allRookToMoveSquares = squareMoves.map((move) => move.to)
  let goNorth = true
  let goEast = true
  let goSouth = true
  let goWest = true
  for (let increment = 1; increment <= 7; increment++) {
    const rankMinus = ((rankIndex - increment) >= 0)
    const rankPlus = ((rankIndex + increment) <= 7)
    const squareMinus = ((squareIndex - increment) >= 0)
    const squarePlus = ((squareIndex + increment) <= 7)
    if (!goNorth && !goEast && !goSouth && !goWest) {
      break;
    }
    if (goNorth && rankMinus) {
      if (allRookToMoveSquares.indexOf(CHESS_BOARD_SQUARES[((rankIndex - increment) * 8) + squareIndex]) === -1) {
        goNorth = false
      }
      rookPlacestoMove.push(CHESS_BOARD_SQUARES[((rankIndex - increment) * 8) + squareIndex])
    }
    if (goSouth && rankPlus) {
      if (allRookToMoveSquares.indexOf(CHESS_BOARD_SQUARES[((rankIndex + increment) * 8) + squareIndex]) === -1) {
        goSouth = false
      }
      rookPlacestoMove.push(CHESS_BOARD_SQUARES[((rankIndex + increment) * 8) + squareIndex])
    }
    if (goWest && squareMinus) {
      if (allRookToMoveSquares.indexOf(CHESS_BOARD_SQUARES[((rankIndex) * 8) + squareIndex - increment]) === -1) {
        goWest = false
      }
      rookPlacestoMove.push(CHESS_BOARD_SQUARES[((rankIndex) * 8) + squareIndex - increment])
    }
    if (goEast && squarePlus) {
      if (allRookToMoveSquares.indexOf(CHESS_BOARD_SQUARES[((rankIndex) * 8) + squareIndex + increment]) === -1) {
        goEast = false
      }
      rookPlacestoMove.push(CHESS_BOARD_SQUARES[((rankIndex) * 8) + squareIndex + increment])
    }
  }
  return rookPlacestoMove
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

export const findSquarestoHighlightforHeatmap = (heatmapScoring) => {
  let maxHeatmapScore = -99999
  let minHeatmapScore = 99999

  CHESS_BOARD_SQUARES.forEach((square) => {
    if(heatmapScoring[square] > maxHeatmapScore) {
      maxHeatmapScore = heatmapScoring[square]
    }
    if (heatmapScoring[square] < minHeatmapScore) {
      minHeatmapScore = heatmapScoring[square]
    }
  })

  const range = maxHeatmapScore - minHeatmapScore
  const normalizedHeatmapScores = {}
  const highlightedSquareStyles = {}
  CHESS_BOARD_SQUARES.forEach((square) => {
    normalizedHeatmapScores[square] = ((heatmapScoring[square] - minHeatmapScore)/range)
    const closestBin = heatmapBins.reduce((a, b) => {
      return Math.abs(b - normalizedHeatmapScores[square]) < Math.abs(a - normalizedHeatmapScores[square]) ? b : a;
    });
    const closestHeatmapColor = heatmapRGBMapping[closestBin.toString()]
    highlightedSquareStyles[square] = {
      backgroundColor: closestHeatmapColor,
      border: '1px solid #000'
    }
  })

  return highlightedSquareStyles
} 