from core.jwt import create_access_token, verify_access_token

data = {
    "sub": "john@example.com"
}

token = create_access_token(data)

print("\nGenerated Token:\n")
print(token)

payload = verify_access_token(token)

print("\nDecoded Payload:\n")
print(payload)