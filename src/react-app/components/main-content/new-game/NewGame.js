import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import Chess from "chess.js"; 
import Chessboard from "chessboardjsx";

import {
  onChangeNewGameBoardField
} from '../../../actions'


class NewGame extends React.Component {

  componentDidMount() {
    const chessGame = new Chess()
    this.props.onChangeNewGameBoardField({
      game: chessGame
    })
  }

  // show possible moves
  highlightSquare = (sourceSquare, squaresToHighlight) => {
    const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce(
      (a, c) => {
        return {
          ...a,
          ...{
            [c]: {
              background:
                "radial-gradient(circle, #D3E3FC 36%, transparent 40%)",
              borderRadius: "50%"
            }
          },
        };
      },
      {}
    );

    this.props.onChangeNewGameBoardField({
      squareStyles: { ...highlightStyles }
    });
  };

  onDrop = ({ sourceSquare, targetSquare }) => {

    const {
      game,
    } = this.props.newGame
    // see if the move is legal
    let move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q" // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return;

    const history = game.history({ verbose: true })
    const squareStyles = {
      ...(history.length && {
        [sourceSquare]: {
          backgroundColor: "rgb(255,218,185,0.4)",
        }
      }),
      ...(history.length && {
        [targetSquare]: {
          backgroundColor: "rgb(255,218,185,0.8)",
        }
      })
    }

    this.props.onChangeNewGameBoardField({
      position: game.fen(),
      history: game.history({ verbose: true }),
      squareStyles
    });
  };

  onSquareRightClick = square =>
    this.props.onChangeNewGameBoardField({
      squareStyles: { [square]: { backgroundColor: "red" } }
    });
  
  onMouseOverSquare = square => {
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
  }

  render() {
    const {
      position,
      squareStyles,
    } = this.props.newGame;

    return (
      <div>
        <Chessboard
          id="new-game"
          position={position}
          onDrop={(dropProps) => this.onDrop(dropProps)}
          width={800}
          boardStyle={{
            borderRadius: "5px",
            boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
          }}
          transitionDuration={300}
          darkSquareStyle={{ backgroundColor: '#00887A'}}
          lightSquareStyle={{ backgroundColor: '#fffeee' }}
          squareStyles={squareStyles}
          onSquareRightClick={(square) => this.onSquareRightClick(square)}
          onMouseOverSquare={(square) => this.onMouseOverSquare(square)}
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

