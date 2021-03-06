chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "HttpRequest") {
        var url = request.url;
        var authenticity_token = request.authenticity_token;

        var data = new FormData();
        data.append("authenticity_token", authenticity_token);

        fetch(url, {
            method: request.httpMethod,
            // Cookie（ログイン情報）を含める
            credentials: "include",
            body: data
        }).then(function (response) {
            // リダイレクトされてurlが変わっていたら失敗している
            //   ※リダイレクトされた場合statusコードは最後のものだけ取得可能
            // /stockは成功したら200, /unstockは成功したら204が返却される
            // /likesはPOSTメソッドなら200, DELETEメソッドなら204が返却される
            if ((response.status === 200 || response.status === 204) && response.url === url) {
                sendResponse({
                    isSuccess: true
                });
            }
        });
        // 非同期通信の場合はreturn trueしないとsendResponseでcontent_script側に伝わらない
        return true;
    }
});