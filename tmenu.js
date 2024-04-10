// console.debug(chrome.bookmarks.getTree());
// TODO use promises lmao
let entries;
chrome.bookmarks.search("entries")
  .then(function(entries_node) {
    flatten_book_tree(entries_node[0])
      .then(function(new_entries) {
        entries = new_entries;
        console.debug(entries);
      });
  });

document.querySelector("#search").oninput = 
  function(event) {
    let devices = document.querySelector(".devices");
    console.debug(this.value); // TODO use this to seach entries
    // devices.replaceChildren();
  };

async function flatten_book_tree(node) {
  let out = [];
  if (node.url && (!node.type || node.type == "bookmark" )) {
    out.push(node);
  }
  let children = await chrome.bookmarks.getChildren(node.id);
  for (let child of children) {
    out = out.concat(await flatten_book_tree(child));
  }
  return out;
}
