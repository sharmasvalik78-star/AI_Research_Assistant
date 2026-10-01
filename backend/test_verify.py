from core.jwt import create_access_token, verify_access_token

token = create_access_token({"sub": "test@example.com"})

print("TOKEN:")
print(token)

print("\nVERIFY:")
print(verify_access_token(token))