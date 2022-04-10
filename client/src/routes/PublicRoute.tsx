import * as React from "react";

const PublicRoute: React.FC = props => {
  return <React.Suspense fallback={<></>}>{props.children}</React.Suspense>;
};

export default PublicRoute;
