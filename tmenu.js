// TODO make sure that if entries takes time to populate, to not error visibly and not require extra input after entries gets loaded

// console.debug(chrome.bookmarks.getTree());
const fuse_options = {
  keys: ["title"]
}

let entries;
let fuse;
chrome.bookmarks.search("entries")
  .then(function(entries_node) {
    flatten_book_tree(entries_node[0])
      .then(function(new_entries) {
        entries = new_entries;
        console.debug(entries);
        fuse = new Fuse(entries, fuse_options);
        reevaluate_options(document.querySelector("#search").value);
      });
  });

document.querySelector("#search").oninput = 
  function() {
    reevaluate_options(this.value);
  };

function reevaluate_options(query) {
  let res_div = document.querySelector(".results");
  let search_res;
  if (!query) {
    search_res = entries;
  } else {
    search_res = fuse.search(query).map((x) => x.item);
  }
  let res_elements = [];
  for (let res of search_res) {
    let element = document.createElement("div");
    console.log(res);
    element.innerText = res.title;
    res_elements.push(element);
  }
  console.debug(res_elements);
  res_div.replaceChildren(...res_elements);
}

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
