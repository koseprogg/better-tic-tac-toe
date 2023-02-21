export const fetchGroupInfo = async (url: string) => {
  let groupInfo;
  // console.log(url);
  await fetch(url)
    .then((r) => r.json())
    .then((it) => (groupInfo = it))
    .catch((err) => {});
  return groupInfo;
};
