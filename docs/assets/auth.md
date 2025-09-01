## 🔐 Authentication (Optional)

- Adds authentication to all requests.
- Only one method can be active at a time.
- `basic` : Standard HTTP Basic Authentication requests.
- `apikey` : Authentication via `x-api-key` header, which should match the value in config.
- `jwt`: JWT authentication implemented via `araleztoken=` url parameter. `/some/url?araleztoken=TOKEN`
- `jwt`: JWT authentication implemented via `Authorization: Bearer <token>` header.
    - To obtain JWT a token, you should send **generate** request to built in api server's `/jwt` endpoint.
    - `master_key`: should match configured `masterkey` in `main.yaml` and `upstreams.yaml`.
    - `owner` : Just a placeholder, can be anything.
    - `valid` : Time in minutes during which the generated token will be valid.

**Example JWT token generation request**

```bash
PAYLOAD='{
    "master_key": "910517d9-f9a1-48de-8826-dbadacbd84af-cb6f830e-ab16-47ec-9d8f-0090de732774",
    "owner": "valod",
    "valid": 10
}'

TOK=`curl -s -XPOST -H "Content-Type: application/json" -d "$PAYLOAD"  http://127.0.0.1:3000/jwt  | cut -d '"' -f4`
echo $TOK
```

**Example Request with JWT token**

With `Authorization: Bearer` header

```bash
curl -H "Authorization: Bearer ${TOK}" -H 'Host: myip.mydomain.com' http://127.0.0.1:6193/
```

With URL parameter (Very useful if you want to generate and share temporary links)

```bash
curl -H 'Host: myip.mydomain.com' "http://127.0.0.1:6193/?araleztoken=${TOK}`"
```

**Example Request with API Key**

```bash
curl -H "x-api-key: ${APIKEY}" --header 'Host: myip.mydomain.com' http://127.0.0.1:6193/

```

**Example Request with Basic Auth**

```bash
curl  -u username:password -H 'Host: myip.mydomain.com' http://127.0.0.1:6193/

```