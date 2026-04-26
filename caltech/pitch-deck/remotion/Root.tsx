import { Composition, Folder } from "remotion";
import { OptimizedOut } from "./compositions/OptimizedOut";
import { Inversion } from "./compositions/Inversion";
import { PinchUnfold } from "./compositions/PinchUnfold";
import { Wordmark } from "./compositions/Wordmark";
import { GlassesScan } from "./compositions/GlassesScan";
import { RoomUnfold } from "./compositions/RoomUnfold";
import { CapturePulse } from "./compositions/CapturePulse";

const W = 1920;
const H = 1080;
const FPS = 30;

export const RemotionRoot = () => (
  <>
    <Folder name="shpatial">
      <Composition
        id="optimized-out"
        component={OptimizedOut}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={240}
      />
      <Composition
        id="inversion"
        component={Inversion}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={300}
      />
      <Composition
        id="glasses-scan"
        component={GlassesScan}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={240}
      />
      <Composition
        id="pinch-unfold"
        component={PinchUnfold}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={360}
      />
      <Composition
        id="capture-pulse"
        component={CapturePulse}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={270}
      />
      <Composition
        id="room-unfold"
        component={RoomUnfold}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={330}
      />
      <Composition
        id="wordmark"
        component={Wordmark}
        width={W}
        height={H}
        fps={FPS}
        durationInFrames={150}
      />
    </Folder>
  </>
);
