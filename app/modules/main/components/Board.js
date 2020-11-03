/* eslint-disable react/no-array-index-key */
// ? Safe to use index as key in our case
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Tile from './Tile';

const Component = ({ board, disabled, className, onTileClick }) => (
  <div className={classNames(className, 'flex flex-col items-center')}>
    {board.map((row, ir) => (
      <div key={ir} className="flex">
        {row.map((col, ic) => (
          <Tile
            key={ic}
            className="m-1"
            value={col}
            disabled={disabled}
            onClick={() => onTileClick(ir, ic)}
          />
        ))}
      </div>
    ))}
  </div>
);

Component.defaultProps = {
  disabled: false,
  className: '',
};

Component.propTypes = {
  board: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  ).isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onTileClick: PropTypes.func.isRequired,
};

Component.displayName = 'Board';

export default Component;
