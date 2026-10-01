from core.security import hash_password, verify_password

password = "MyPassword123"

hashed = hash_password(password)

print("Original Password :", password)
print("Hashed Password   :", hashed)

print("Password Verified :", verify_password(password, hashed))