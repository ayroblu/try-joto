import { v4 as uuidv4 } from "uuid";
import fs from "fs";

const file = ".device-id";

export function getDeviceId() {
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, "utf8");
  }
  const id = uuidv4();
  fs.writeFileSync(file, id);
  return id;
}
