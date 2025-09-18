import React from "react";

interface LoadingRootProps {
  children: React.ReactNode;
}

export function LoadingRoot({ children }: LoadingRootProps) {
  const [stylesLoaded, setStylesLoaded] = React.useState(false);

  React.useEffect(() => {
    // Check if all stylesheets are loaded
    const styleSheets = document.styleSheets;
    const checkStylesLoaded = () => {
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          // Try to access rules - will throw if stylesheet not loaded
          const rules = styleSheets[i].cssRules;
          if (!rules && !styleSheets[i].href?.includes("blob:")) {
            return false;
          }
        } catch (e) {
          console.error(e);
          return false;
        }
      }
      return true;
    };

    if (checkStylesLoaded()) {
      setStylesLoaded(true);
    } else {
      const timer = setInterval(() => {
        if (checkStylesLoaded()) {
          setStylesLoaded(true);
          clearInterval(timer);
        }
      }, 50);

      return () => clearInterval(timer);
    }
  }, []);

  if (!stylesLoaded) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 1,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        <div className="text-center">
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
