import React from "react";

interface LoadingRootProps {
  children: React.ReactNode;
}

export function LoadingRoot({ children }: LoadingRootProps) {
  const [stylesLoaded, setStylesLoaded] = React.useState(false);

  React.useEffect(() => {
    const checkStylesLoaded = () => {
      const styleSheets = document.styleSheets;

      for (let i = 0; i < styleSheets.length; i++) {
        try {
          // Try to access rules - will throw if cross-origin
          const rules = styleSheets[i].cssRules;
          if (!rules && !styleSheets[i].href?.includes("blob:")) {
            return false;
          }
        } catch (_) {
          // For cross-origin stylesheets, we can't check cssRules
          // But if the stylesheet element exists, assume it's loaded
          // Only return false if this seems to be a legitimate loading issue
          if (
            styleSheets[i].href !== null &&
            styleSheets[i].href !== undefined &&
            !styleSheets[i].href?.includes("blob:")
          ) {
            // Cross-origin stylesheet - assume it's loaded if the element exists
            continue;
          } else {
            // Actual loading issue
            return false;
          }
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
