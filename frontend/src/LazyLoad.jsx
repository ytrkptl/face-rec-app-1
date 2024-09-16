import { lazy, Suspense } from "react";

const LazyLoad = (importFunc) => {
  const LazyComponent = lazy(importFunc);

  return function LazyLoadedComponent(props) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
};

export default LazyLoad;
