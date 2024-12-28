import { getDeviceId } from "./device-id";
import fs from "fs";

const file = ".token";

const [code] = process.argv.slice(2);
if (!code) {
  throw new Error(
    "please enter a code from https://my.remarkable.com/#desktop",
  );
}

(async () => {
  const deviceId = getDeviceId();
  const handler = await fetch(
    "https://webapp.cloud.remarkable.com/token/json/2/device/new",
    {
      method: "POST",
      body: JSON.stringify({
        code,
        deviceDesc: "desktop-windows",
        deviceID: deviceId,
      }),
    },
  );
  const result = await handler.text();
  fs.writeFileSync(file, result);
  console.log(result);
})();
