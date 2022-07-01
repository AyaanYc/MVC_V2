function getFeedList() {
    if(!feedObj) { return; }
    feedObj.showLoading();            
    const param = {
        page: feedObj.currentPage++
    }
    fetch('/feed/rest' + encodeQueryString(param))// feed/rset?page=n
    .then(res => res.json())
    .then(list => {                
        feedObj.makeFeedList(list);                
    })
    .catch(e => {
        console.error(e);
        feedObj.hideLoading();
    });
}
getFeedList();