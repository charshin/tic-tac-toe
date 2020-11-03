/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { cloneElement, useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { element, func, string, bool } from 'prop-types';

import classNames from 'classnames';
import * as R from 'ramda';

const Modal = ({
  open: controlledOpen,
  closable,
  onOpen,
  onClose,
  trigger,
  children,
  className,
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = R.complement(R.isNil)(controlledOpen)
    ? controlledOpen
    : uncontrolledOpen;

  const handleOpen = useCallback(() => {
    setUncontrolledOpen(true);
    if (!open) {
      onOpen?.();
    }
  }, [open, onOpen]);
  const handleClose = useCallback(() => {
    if (!closable) return;
    setUncontrolledOpen(false);
    if (open) {
      onClose?.();
    }
  }, [open, closable, onClose]);

  useEffect(() => {
    const handleKeyUp = event => event.key === 'Escape' && handleClose();
    document.addEventListener('keyup', handleKeyUp, false);
    return () => {
      document.removeEventListener('keyup', handleKeyUp, false);
    };
  }, [handleClose]);

  return (
    <>
      {process.env.PLATFORM === 'browser' &&
        open &&
        ReactDOM.createPortal(
          <>
            <div className="modal-dimmer" />
            <div className={classNames('modal-container', className)}>
              {closable && (
                <div
                  className="absolute right-0 m-5 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 xl:w-10 xl:h-10 bg-gray-200 opacity-75 hover:opacity-100 rounded-full cursor-pointer flex justify-center items-center"
                  onClick={handleClose}
                >
                  <i className="sh-e-remove-2 text-white" />
                </div>
              )}
              {children}
            </div>
          </>,
          document.getElementById('modal-root'),
        )}
      <div className="cursor-pointer">
        {cloneElement(trigger, {
          onClick: handleOpen,
        })}
      </div>
    </>
  );
};

Modal.defaultProps = {
  open: null,
  closable: false,
  onOpen: null,
  onClose: null,
  className: '',
};

Modal.propTypes = {
  open: bool,
  closable: bool,
  onOpen: func,
  onClose: func,
  trigger: element.isRequired,
  children: element.isRequired,
  className: string,
};

export default Modal;
