import fs from "fs";
import { fromByteArray } from "base64-js";
import qs from "query-string";
// import { getDeviceId } from "./device-id";

export function Api() {
  // const deviceId = getDeviceId();
  // const token = getToken();
  return {
    refresh,
    serviceDiscovery,
    fetchItems,
  };
}

async function refresh() {
  const res = await fetch(
    "https://webapp-prod.cloud.remarkable.engineering/token/json/2/user/new",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    },
  );
  const newToken = await res.text();
  return newToken;
}

type ServiceDiscoveryResponse = {
  Status: "OK";
  Host: string; // document-storage-production-dot-remarkable-production.appspot.com
};
async function serviceDiscovery(): Promise<string> {
  const res = await fetch(
    "https://service-manager-production-dot-remarkable-production.appspot.com/service/json/1/document-storage?environment=production&group=auth0%7C5a68dc51cb30df3877a1d7c4&apiVer=2",
  );
  const { Host }: ServiceDiscoveryResponse = await res.json();
  return `https://${Host}`;
}

type Uuid = string;
type NumericString = string;
type ReMarkableItem = {
  id: Uuid;
  hash: string;
  type: "DocumentType" | "CollectionType";
  visibleName: string;
  lastModified: NumericString;
  fileType: "notebook";
  parent: "trash" | Uuid;
  pinned: boolean;
  lastOpened: NumericString;
};
const origin = "https://eu.tectonic.remarkable.com";
async function fetchItems(): Promise<ReMarkableItem[]> {
  // const encodedParams = qs.stringify(params);
  // const origin = await serviceDiscovery();
  // const url = `${origin}/document-storage/json/2/docs?${encodedParams}`;
  // console.log(url);
  // const res = await fetch(url, {
  //   headers: {
  //     Authorization: `Bearer ${getToken()}`,
  //   },
  // });
  // return res.text();

  // const meta = JSON.stringify({ id: "547efec1-d557-4088-a1c8-7c9e43ec68ac" });
  // const contentType = "text/plain;charset=UTF-8";
  // const encoder = new TextEncoder();
  // const encMeta = encoder.encode(meta);
  // const hash = undefined;
  // const suffix = hash === undefined ? "" : `/${hash}`;
  const token = await refresh();
  const resp = await fetch(`${origin}/doc/v2/files`, {
    headers: {
      // "content-type": contentType,
      Authorization: `Bearer ${token}`,
      // "rm-meta": fromByteArray(encMeta),
      // "rm-source": "WebLibrary",
    },
  });
  const raw = await resp.text();
  return JSON.parse(raw);
}

const file = ".token";

export function getToken() {
  if (fs.existsSync(file)) {
    return fs.readFileSync(file, "utf8");
  }
  throw new Error("call register first");
}
