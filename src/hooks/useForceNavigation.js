export const useForceNavigation = () => {
  const forceNavigate = (path) => {
    console.log('Force navigating to:', path);

    // Direct window navigation - most reliable method
    window.location.href = window.location.origin + path;
  };

  return forceNavigate;
};
