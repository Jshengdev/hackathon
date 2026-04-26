import { Config } from "@remotion/cli/config";

Config.setEntryPoint("./remotion/index.ts");
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setOverwriteOutput(true);
