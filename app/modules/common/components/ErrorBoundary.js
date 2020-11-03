import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  // eslint-disable-next-line no-unused-vars
  componentDidCatch(error, errorInfo) {
    //   // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    // eslint-disable-next-line no-console
    console.log('%cerror', 'font-size: 12px; color: #00b3b3', error);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      return process.env.NODE_ENV === 'development' ? (
        // eslint-disable-next-line jsx-a11y/accessible-emoji
        <h3 css={{ color: 'lightcoral' }}>😴You must be sleepy😪</h3>
      ) : (
        <h3 css={{ color: 'lightcoral' }}>
          We&apos;ll figure out what went wrong
        </h3>
      );
    }

    return children;
  }
}

const withErrorBoundary = Component => {
  class WithErrorBoundary extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    // eslint-disable-next-line no-unused-vars
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }

    // eslint-disable-next-line no-unused-vars
    componentDidCatch(error, errorInfo) {
      //   // You can also log the error to an error reporting service
      // logErrorToMyService(error, errorInfo);
      // eslint-disable-next-line no-console
      console.log('%cerror', 'font-size: 12px; color: #00b3b3', error);
    }

    render() {
      const { hasError } = this.state;

      if (hasError) {
        // You can render any custom fallback UI
        return process.env.NODE_ENV === 'development' ? (
          // eslint-disable-next-line jsx-a11y/accessible-emoji
          <h3 css={{ color: 'lightcoral' }}>😴You must be sleepy😪</h3>
        ) : (
          <h3 css={{ color: 'lightcoral' }}>
            We&apos;ll figure out what went wrong
          </h3>
        );
      }

      return <Component {...this.props} />;
    }
  }

  return WithErrorBoundary;
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export { withErrorBoundary };
export default ErrorBoundary;
