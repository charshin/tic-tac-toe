import { useMediaQuery } from 'react-responsive';
import facepaint from 'facepaint';
import * as R from 'ramda';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const useBreakpoints = () => {
  const smUp = useMediaQuery({ minDeviceWidth: breakpoints.sm });
  const mdUp = useMediaQuery({ minDeviceWidth: breakpoints.md });
  const lgUp = useMediaQuery({ minDeviceWidth: breakpoints.lg });
  const xlUp = useMediaQuery({ minDeviceWidth: breakpoints.xl });

  const smDown = useMediaQuery({ maxDeviceWidth: breakpoints.sm - 1 });
  const mdDown = useMediaQuery({ maxDeviceWidth: breakpoints.md - 1 });
  const lgDown = useMediaQuery({ maxDeviceWidth: breakpoints.lg - 1 });
  const xlDown = useMediaQuery({ maxDeviceWidth: breakpoints.xl - 1 });

  return {
    smUp,
    mdUp,
    lgUp,
    xlUp,
    smDown,
    mdDown,
    lgDown,
    xlDown,
  };
};

const addObjectBreakpointsAPI = facepainter => {
  // Find all the css props whose value contains breakpoints, i.e. { default, xs, sm, md, lg, xl }
  // Convert the breakpoints object to array of 6 values, corresponding to the breakpoints
  // in the correct order; if breakpoint name is missing, use 'null' value.
  // Discard unknown breakpoint names.
  // For example:
  // { padding: { default: 0, xs: 20, sm: 50, lg: 70 } } => { padding: [0, 20, 50, null, 70, null] }
  // { '&:hover': { color: { xs: 'green', md: 'red' } } } => { '&:hover': { color: [null, 'green', null, 'red', null, null] } }
  const breakpointNames = ['default', ...R.keys(breakpoints)];

  /**
   * Convert a breakpoints object to a breakpoints array
   * @param {Object} breakpointsObj - i.e. { xs: 20, sm: 50, lg: 70 }
   * @returns {Array} breakpoints array, i.e. [null, 20, 50, null, 70, null]
   */
  const convertToArrayBreakpointsAPI = breakpointsObj =>
    // eslint-disable-next-line
    R.map(R.propOr(null, R.__, breakpointsObj))(breakpointNames);

  const isBreakpointsObj = R.pipe(
    R.keys,
    R.intersection(breakpointNames),
    R.complement(R.isEmpty),
  );

  // TODO Move to kickass-utilities
  // eslint-disable-next-line no-proto
  const isObjectLiteral = v => v.__proto__ === Object.prototype;

  // ? Not using point free style due to recursion
  const convertRecursively = obj =>
    R.map(
      R.when(
        isObjectLiteral,
        R.ifElse(
          isBreakpointsObj,
          convertToArrayBreakpointsAPI,
          convertRecursively,
        ),
      ),
    )(obj);

  return R.pipe(convertRecursively, facepainter);
};

const useResponsiveStyles = addObjectBreakpointsAPI(
  facepaint(
    R.pipe(
      R.values,
      R.map(bp => `@media (min-width: ${bp}px)`),
    )(breakpoints),
  ),
);

export { useBreakpoints, useResponsiveStyles };
