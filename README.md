# Photoshop-Server


# Get Started

```bash
npm install
node web.js
```

# 起動オプションなどなど



* 環境変数`REDISTOGO_URL`が存在する場合はREDISTOGOに接続します。内容は直接聞いてください。
* 存在しない場合は`localhost:6379`のREDISに接続します。。
* `WITHOUT_REDIS=YES node web` で redis使いません


### examples

```bash
# redistogoのredisをセッションストアとして起動
REDISTOGO_URL=XXXXXXXXX node web
# ローカルのredisをセッションストアとして起動
node web
# redis使わない
WITHOUT_REDIS=YES node web
```


