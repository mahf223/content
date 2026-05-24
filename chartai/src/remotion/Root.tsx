import * as React from "react";
import { Composition } from "remotion";
import { ChartComposition } from "./ChartComposition";
import { DEFAULT_CONFIG, SOCIAL_PRESETS } from "@/lib/presets";

/**
 * Remotion root. Registers a single composition we'll re-parameterize per
 * render via `inputProps` from the API route. Default props are needed so
 * the Remotion Studio (and the bundler) can preview / type-check.
 */
export const Root: React.FC = () => {
  const preset = SOCIAL_PRESETS[DEFAULT_CONFIG.export.preset];
  return (
    <>
      <Composition
        id="Chart"
        component={ChartComposition as any}
        durationInFrames={300}
        fps={60}
        width={preset.width}
        height={preset.height}
        defaultProps={{ config: DEFAULT_CONFIG }}
      />
    </>
  );
};
