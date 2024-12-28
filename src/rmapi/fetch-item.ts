import { Api } from "./api";
// import { remarkable } from "rmapi-js";

(async () => {
  const api = Api();
  const items = await api.fetchItems();
  const item = items.find(
    ({ id }) => id === "547efec1-d557-4088-a1c8-7c9e43ec68ac",
  );
  console.log("items", item);
  // const api = await remarkable(getToken());
  // const files = await api.listFiles();
  // console.log(files);
})();
