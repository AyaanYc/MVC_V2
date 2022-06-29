function encodeQueryString(params) {//객체를 문자열로 순서대로 합쳐서 만들어줌
    const keys = Object.keys(params);
    return keys.length 
            ? "?" + keys.map(key => 
                        encodeURIComponent(key) + "=" + 
                        encodeURIComponent(params[key])
                    ).join("&")
            : "";
}