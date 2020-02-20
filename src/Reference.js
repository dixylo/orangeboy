// Show Reference
let shown = false;
const refList = "<ol><li>The \"Eric\" image. URL: http://cdn1us.denofgeek.com/sites/denofgeekus/files/styles/main_wide/public/images/21267.jpg?itok=hTskv8zO</li><li>The \"basket\" image. URL: http://1.bp.blogspot.com/_9Xm1rX4MS1M/TUtNRLY3GqI/AAAAAAABKcs/RvF0s63sQCQ/w1200-h630-p-k-no-nu/Apple%2BBasket%2B-2A.jpg</li><li>The \"orange\" image. URL: https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Orange-Whole-%26-Split.jpg/800px-Orange-Whole-%26-Split.jpg</li><li>The \"background\" image. URL: http://images.all-free-download.com/images/graphiclarge/a_tree_vector_156141.jpg</li><li>The background music. Hidden Catch Normal Sub, Composer: Unknown, URL: https://www.youtube.com/watch?v=EvbNmFEKegA</li><li>The outro music. South Park Series End Song, Composer: Primus, URL: https://www.youtube.com/watch?v=yXA6maPNFVo</li></ol>";

export default function (btnReference, pReference) {
  if (!shown) {
    btnReference.innerHTML = "Collaps List";
    pReference.innerHTML = refList;
  }
  else {
    btnReference.innerHTML = "Show References";
    pReference.innerHTML = "";
  }

  shown = !shown;
}
