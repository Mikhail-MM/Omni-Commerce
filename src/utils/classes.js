/**
 * 
 * @param {Boolean} 
 * @returns {String}
 * Check if the UI state is true, and return a modified classname to apply transitions
 */

const applyConditionalClassName = (bool, className) => {
  return (bool) ? ` ${className}` : ""
}

export default applyConditionalClassName