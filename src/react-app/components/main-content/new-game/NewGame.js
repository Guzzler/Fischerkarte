import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import Chess from "chess.js"; 
import Chessboard from "chessboardjsx";

import {
  onChangeNewGameBoardField
} from '../../../actions'

const squareStyling = ({ pieceSquare, history }) => {
  const sourceSquare = history.length && history[history.length - 1].from;
  const targetSquare = history.length && history[history.length - 1].to;

  return {
    [pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
    ...(history.length && {
      [sourceSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    }),
    ...(history.length && {
      [targetSquare]: {
        backgroundColor: "rgba(255, 255, 0, 0.4)"
      }
    })
  };
};


class NewGame extends React.Component {

  componentDidMount() {
    const chessGame = new Chess()
    this.props.onChangeNewGameBoardField({
      game: chessGame
    })
  }
  // keep clicked square style and remove hint squares
  removeHighlightSquare = () => {
    const {
      pieceSquare,
      history,
    } = this.props.newGame

    this.props.onChangeNewGameBoardField({
      squareStyles: squareStyling({ pieceSquare, history })
    });
  };

  // show possible moves
  highlightSquare = (sourceSquare, squaresToHighlight) => {

    const {
      squareStyles,
      history,
      pieceSquare,
    } = this.props.newGame

    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #fffc00 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
          ...squareStyling({
            history,
            pieceSquare,
          })
        };
      },
      {}
    );

    this.props.onChangeNewGameBoardField({
      squareStyles: { ...squareStyles, ...highlightStyles }
    });
  };

  onDrop = ({ sourceSquare, targetSquare }) => {

    const {
      game,
      history,
      pieceSquare
    } = this.props.newGame
    // see if the move is legal
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;
    this.props.onChangeNewGameBoardField({
      position: game.fen(),
      history: game.history({ verbose: true }),
      squareStyles: squareStyling({ pieceSquare, history })
    });
  };

  onMouseOverSquare = square => {
    // get list of possible moves for this square
    const {
      game 
    } = this.props.newGame
    let moves = game.moves({
      square: square,
      verbose: true
    });

    // exit if there are no moves available for this square
    if (moves.length === 0) return;

    let squaresToHighlight = [];
    for (var i = 0; i < moves.length; i++) {
      squaresToHighlight.push(moves[i].to);
    }

    this.highlightSquare(square, squaresToHighlight);
  };

  onMouseOutSquare = square => this.removeHighlightSquare(square);

  // central squares get diff dropSquareStyles
  onDragOverSquare = square => {
    this.props.onChangeNewGameBoardField({
      dropSquareStyle:
        square === "e4" || square === "d4" || square === "e5" || square === "d5"
          ? { backgroundColor: "cornFlowerBlue" }
          : { boxShadow: "inset 0 0 1px 4px rgb(255, 255, 0)" }
    });
  };

  onSquareClick = square => {

    const {
      history,
      game,
      pieceSquare
    } = this.props.newGame
    this.props.onChangeNewGameBoardField({
      squareStyles: squareStyling({ pieceSquare: square, history }),
      pieceSquare: square
    });

    let move = game.move({
      from: pieceSquare,
      to: square,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    this.props.onChangeNewGameBoardField({
      position: game.fen(),
      history: game.history({ verbose: true }),
      pieceSquare: ""
    });
  };

  onSquareRightClick = square =>
    this.props.onChangeNewGameBoardField({
      squareStyles: { [square]: { backgroundColor: "deepPink" } }
    });

  render() {
    const {
      position,
      squareStyles,
      dropSquareStyle
    } = this.props.newGame;

    return (
      <div>
        <Chessboard
          id="humanVsHuman"
          position={position}
          onDrop={(dropProps) => this.onDrop(dropProps)}
          width={800}
          onMouseOverSquare={(square) => this.onMouseOverSquare(square)}
          onMouseOutSquare={(square) => this.onMouseOutSquare(square)}
          boardStyle={{
            borderRadius: "5px",
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
          }}
          squareStyles={squareStyles}
          dropSquareStyle={dropSquareStyle}
          onDragOverSquare={(square) => this.onDragOverSquare(square)}
          onSquareClick={(square) => this.onSquareClick(square)}
          onSquareRightClick={(square) => this.onSquareRightClick(square)}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ base }) => {
  const {
    newGame = {}
  } = base
  return {
    newGame
  }
}

NewGame.propTypes = {
  onChangeNewGameBoardField: PropTypes.func.isRequired,
  newGame: PropTypes.object.isRequired,
}

export default connect(
  mapStateToProps, {
    onChangeNewGameBoardField
})(NewGame)

