import PropTypes from 'prop-types';
import classNames from 'classnames';

const Component = ({ className, value, disabled, onClick }) => (
  <button
    type="button"
    css={{ fontFamily: 'Georgia' }}
    className={classNames(
      className,
      'w-10 h-10 rounded uppercase text-3xl text-white',
      {
        'bg-lightgray-700': !value,
        'hover:bg-lightgray-900': !value && !disabled,
        'bg-teal-500': value === 'o',
        'bg-red-500': value === 'x',
        'cursor-default': value || disabled,
      },
    )}
    disabled={value || disabled}
    onClick={onClick}
  >
    {value}
  </button>
);

Component.defaultProps = {
  className: '',
  value: '',
  disabled: false,
};

Component.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

Component.displayName = 'Tile';

export default Component;
